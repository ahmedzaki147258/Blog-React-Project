from django.urls import path
from .views import *

urlpatterns = [
    path('register', RegisterView.as_view()),
    path('login', LoginView.as_view()),
    path('users/<int:user_id>', UpdateNameView.as_view()),
    path('posts', PostListCreateView.as_view()),
    path('posts/user/<int:user_id>', PostByUserView.as_view()),
    path('posts/<int:post_id>/title', UpdatePostTitleView.as_view()),
    path('posts/<int:post_id>/image', UpdatePostImageView.as_view()),
    path('posts/<int:post_id>', DeletePostView.as_view()),
]
