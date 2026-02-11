from django.utils.timezone import now

from django.contrib.auth.models import User

class UpdateLastActivityMiddleware:
  
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        
        member: User = request.user
        if member.is_authenticated:
            member.profile.last_activity = now()
            member.profile.save()
        return response
      