from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer, TokenBlacklistSerializer
from user.models import Profile
from django.conf import settings
from django.contrib.auth.models import User
from django.contrib.auth import password_validation
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
import re

class UserSerializer(serializers.ModelSerializer):

    id = serializers.IntegerField(read_only=True)
    username = serializers.CharField(max_length=50)
    email = serializers.CharField(max_length=100)
    first_name = serializers.CharField(max_length=50, required=False, allow_blank=True)
    last_name = serializers.CharField(max_length=50, required=False, allow_blank=True)
    is_staff = serializers.BooleanField(read_only=True)
    
    #permissions = serializers.SerializerMethodField(read_only=True)
    
    
    class Meta:
        model = User
        fields = [
            'id', 
            'username', 
            'email', 
            'first_name', 
            'last_name', 
            'is_staff', 
        ]
        
          
    def validate_username(self, value):
        request = self.context.get('request')
        if not request:
            return value
        
        if value and User.objects.filter(username__exact=value).exclude(pk=request.user.id).exists():
            raise serializers.ValidationError("The specified username already exists")

        return value
    
    def validate_email(self, value):
        request = self.context.get('request')
        if not request:
            return value
        
        if (value and not value.strip()) or value == "":
            raise serializers.ValidationError("Email cannot be empty.")
        # Validate email format
        try:
            validate_email(value)
        except ValidationError:
            raise serializers.ValidationError("Enter a valid email address.")
        
        if value and User.objects.filter(email__exact=value).exclude(pk=request.user.id).exists():
            raise serializers.ValidationError("The specified email already exists.")
        
        return value
    
class ProfileSerializer(serializers.ModelSerializer):
    updated_at = serializers.DateTimeField(read_only=True)
    created_at = serializers.DateTimeField(read_only=True)
    avatar = serializers.ImageField(required=False)
    avatar_thumbnails = serializers.SerializerMethodField(read_only=True)
    user = UserSerializer(read_only=True)
    last_activity = serializers.CharField(read_only=True)


    class Meta:
        model = Profile
        fields = ['avatar', 'created_at', 'updated_at', 'avatar_thumbnails', 'user', 'last_activity']


    
    def get_avatar_thumbnails(self, obj):
        if obj.avatar:
            thumbnails_dict = {
                'extra_small': settings.APP_URL + obj.avatar.thumbnails.extra_small.url,
                'small': settings.APP_URL + obj.avatar.thumbnails.small.url,
                'medium': settings.APP_URL + obj.avatar.thumbnails.medium.url,
                'large': settings.APP_URL + obj.avatar.thumbnails.large.url,
                'original': settings.APP_URL + obj.avatar.url,
            }
            return thumbnails_dict
        return None
    
    def update(self, instance, validated_data):

        if validated_data.get('avatar') is not None:
            if instance.avatar:
                instance.avatar.delete()
            instance.avatar = validated_data.get('avatar', instance.avatar)
        
        
        instance.save()
        return instance

class CustomLoginSerializer(TokenObtainPairSerializer):

    def validate(self, attrs):
        data = super().validate(attrs)
               
        
        refresh = self.get_token(self.user)
        data['lifetime'] = int(refresh.access_token.lifetime.total_seconds())
        profile = Profile.objects.filter(user=self.user).first()
        data['profile'] = ProfileSerializer(profile).data
        return data

class CustomLogoutSerializer(TokenBlacklistSerializer):


    def validate(self, attrs):
        data = super().validate(attrs)
        
        data['success'] = True
        data['message'] = "User logged out."
        
        return data
    

class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(max_length=128, write_only=True, required=True)
    new_password1 = serializers.CharField(max_length=128, write_only=True, required=True)
    new_password2 = serializers.CharField(max_length=128, write_only=True, required=True)

    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError(
                "The current password is not correct. Please try again."
            )
        return value

    def validate(self, data):
        if data['new_password1'] != data['new_password2']:
            raise serializers.ValidationError({'new_password2': "The passwords do not match."})
        
        if data['new_password1'] == data['old_password']:
            raise serializers.ValidationError({'new_password2': "The new password cannot be the same as the old password."})
        
        # Custom password validation
        password = data['new_password1']
        
        if len(password) < 6:
            raise serializers.ValidationError({'new_password1': "Password must be at least 6 characters long."})
        
        if not re.search(r'[A-Z]', password):
            raise serializers.ValidationError({'new_password1': "Password must contain at least one uppercase letter."})
        
        if not re.search(r'[0-9]', password):
            raise serializers.ValidationError({'new_password1': "Password must contain at least one number."})
        
        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
            raise serializers.ValidationError({'new_password1': "Password must contain at least one special character."})
        
        password_validation.validate_password(data['new_password1'], self.context['request'].user)
        return data

    def save(self, **kwargs):
        password = self.validated_data['new_password1']
        user = self.context['request'].user
        user.set_password(password)
        user.save()
        return user