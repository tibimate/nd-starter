from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response


DEFAULT_PAGE = 1
DEFAULT_PAGE_SIZE = 50

class CustomPagination(PageNumberPagination):
    page = DEFAULT_PAGE
    page_size = DEFAULT_PAGE_SIZE
    page_size_query_param = 'page_size'

    def get_paginated_response(self, data):
        # Get id's of records in current page
        firstRecord = data[0]['id'] if (data and 'id' in data[0]) else None
        lastRecord = data[-1]['id'] if (data and 'id' in data[0]) else None
        previous_page = None
        next_page = None
        
        current_page = int(self.request.query_params.get('page', 1))
        
        if current_page > 1:
          previous_page = current_page - 1
          
        total_pages = self.page.paginator.count
        last_page = self.page.paginator.num_pages
        
        if current_page != last_page:
          next_page = current_page + 1
        
        return Response({
            'pagination': {
              'total': total_pages,
              'per_page': self.get_page_size(self.request),
              'current_page': current_page,
              'next_page': next_page,
              'previous_page': previous_page,
              'last_page': last_page,
              'next_page_url': self.get_next_link(),
              'previous_page_url': self.get_previous_link(),
              'from': firstRecord,
              'to': lastRecord,
            },
            'results': data
        })