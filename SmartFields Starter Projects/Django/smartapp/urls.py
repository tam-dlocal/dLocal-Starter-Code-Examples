from django.urls import path
from .views.views import index  # Correct the import path

urlpatterns = [
    path('', index, name='index'),
]
