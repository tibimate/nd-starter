from django.contrib import admin
from django.urls import include, path
from django.conf import settings
from django.conf.urls.static import static
from user.views import CustomLoginView, CustomLogoutView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls), #recomended to change the endpoint for security reasons
    path('login/', CustomLoginView.as_view(), name='token_obtain_pair'),
    path('login/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('logout/', CustomLogoutView.as_view(), name='token_blacklist'),
    path('user/', include('user.urls')),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
