from .models import Profile
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from rest_framework_simplejwt.views import TokenViewBase
from .serializers import CustomLoginSerializer, CustomLogoutSerializer, ProfileSerializer, UserSerializer, ChangePasswordSerializer, RegisterUserSerializer
from .throttles import LoginThrottle
from rest_framework import viewsets, mixins, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response

class RegisterViewSet(viewsets.GenericViewSet, mixins.CreateModelMixin):
    serializer_class = RegisterUserSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        profile = user.profile
        profile_serializer = ProfileSerializer(profile, context={'request': request})
        return Response(profile_serializer.data, status=status.HTTP_201_CREATED)

class AccountViewSet(mixins.ListModelMixin, viewsets.GenericViewSet):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    pagination_class = None
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        queryset = super().get_queryset()
        queryset = queryset.filter(user=user)
        return queryset

    
    def list(self, request, *args, **kwargs):
        profile = request.user.profile
        if profile:
            return Response(self.get_serializer(profile, many=False).data)
        return Response({"detail": "Profile not found"}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['post'])
    def remove_avatar(self, request, *args, **kwargs):
        """Remove current user avatar."""
        profile = request.user.profile
        if not profile:
            return Response({"detail": "Profile not found"}, status=status.HTTP_404_NOT_FOUND)

        profile.avatar.delete(save=True)
        return Response(self.get_serializer(profile, many=False).data)
    

    @action(detail=False, methods=['post'])
    def update_password(self, request, *args, **kwargs):
        profile = request.user.profile
        serializer = ChangePasswordSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        profile_serializer = ProfileSerializer(profile)
        return Response(profile_serializer.data)
    
    @action(detail=False, methods=['put', 'patch'])
    def update_account(self, request, *args, **kwargs):
        
        """Update current user profile with PUT or PATCH."""
        user = request.user
        serializer = self.get_serializer(user.profile, data=request.data, partial=request.method == 'PATCH')
        serializer.is_valid(raise_exception=False)
        user_serializer = None

        if request.data.get('first_name') or request.data.get('last_name') or request.data.get('email'):
            user_data = {
                'email': request.data.get('email', user.email),
                'first_name': request.data.get('first_name', user.first_name),
                'last_name': request.data.get('last_name', user.last_name),
            }
            user_serializer = UserSerializer(user, data=user_data, partial=True, context={'request': request})
            user_serializer.is_valid(raise_exception=False)
            
        errors = None
        
        if not serializer.is_valid():
            errors = serializer.errors.copy()
        

        if user_serializer is not None:
          if not user_serializer.is_valid():
            if errors is None:
              errors = user_serializer.errors.copy()  
            else:
              errors.update(user_serializer.errors)

        if errors:
          return Response(errors, status=status.HTTP_400_BAD_REQUEST)
        
        serializer.save()

        if user_serializer is not None:
          user_serializer.save()

        return Response(serializer.data)
    
    
@method_decorator(csrf_exempt, name='dispatch')
class CustomLoginView(TokenViewBase):
    """
    Return JWT tokens (access and refresh) for specific user based on username and password.
    
    Security: Rate limited to 5 login attempts per hour per IP address
    to prevent brute force attacks. CSRF protection disabled for JWT auth.
    """
    serializer_class = CustomLoginSerializer
    throttle_classes = [LoginThrottle]
    

class CustomLogoutView(TokenViewBase):
    """
        Return JWT tokens (access and refresh) for specific user based on username and password.
    """
    serializer_class = CustomLogoutSerializer