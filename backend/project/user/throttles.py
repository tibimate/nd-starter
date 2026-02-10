from rest_framework.throttling import SimpleRateThrottle


class LoginThrottle(SimpleRateThrottle):
    """
    Rate limit login attempts to 5 per hour per IP address.
    Prevents brute force attacks on the login endpoint.
    """
    scope = 'login'
    
    def get_cache_key(self, request, view):
        # Use client IP as the cache key for anonymous users
        if request.user and request.user.is_authenticated:
            # Even authenticated users attempting to login again are rate limited
            return f'throttle_{self.scope}_{request.user.id}'
        
        # Get client IP from request
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0].strip()
        else:
            ip = request.META.get('REMOTE_ADDR')
        
        return f'throttle_{self.scope}_{ip}'


class StrictLoginThrottle(SimpleRateThrottle):
    """
    Even stricter rate limit for login: 3 attempts per hour.
    Use this for extra protection or as secondary check.
    """
    scope = 'strict_login'
    THROTTLE_RATES = {'strict_login': '3/hour'}
    
    def get_cache_key(self, request, view):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0].strip()
        else:
            ip = request.META.get('REMOTE_ADDR')
        
        return f'throttle_{self.scope}_{ip}'

