from django.db import models
from thumbnails.fields import ImageField
from django.contrib.auth.models import User
from django.conf import settings


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, unique=True, related_name='profile',)
    avatar = ImageField(upload_to='profile_images', pregenerated_sizes=["small", "large", "medium", "extra_small"], default=None, null=True, blank=True)
    last_activity = models.DateTimeField(default=None, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    @property
    def get_absolute_avatar_url(self):
        return "{0}{1}".format(settings.MEDIA_URL, self.avatar.url)

    def __str__(self):
        return self.user.first_name + ' ' + self.user.last_name