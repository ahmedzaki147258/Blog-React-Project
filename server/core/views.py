from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Post
from .serializers import RegisterSerializer, UserSerializer, UpdateNameSerializer, LoginSerializer, PostSerializer
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import get_user_model
import os

# Create your views here.
User = get_user_model()

class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data
            return Response(UserSerializer(user).data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UpdateNameView(APIView):
    def patch(self, request, user_id):
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = UpdateNameSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(UserSerializer(user).data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
#################################################

class PostListCreateView(APIView):
    def get(self, request):
        posts = Post.objects.all().order_by('-created_at')
        serializer = PostSerializer(posts, many=True)
        return Response(serializer.data)

    def post(self, request):
        if 'image' not in request.FILES:
            return Response({"error": "No image provided"}, status=status.HTTP_400_BAD_REQUEST)
          
        serializer = PostSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PostByUserView(APIView):
    def get(self, request, user_id):
        posts = Post.objects.filter(user_id=user_id).order_by('-created_at')
        serializer = PostSerializer(posts, many=True)
        return Response(serializer.data)

class UpdatePostTitleView(APIView):
    def patch(self, request, post_id):
        post = Post.objects.get(id=post_id)
        post.title = request.data['title']
        post.save()
        return Response(PostSerializer(post).data)

class UpdatePostImageView(APIView):
    def patch(self, request, post_id):
        try:
            post = Post.objects.get(id=post_id)
        except Post.DoesNotExist:
            return Response({"error": "Post not found"}, status=status.HTTP_404_NOT_FOUND)
            
        # Validate the image file
        if 'image' not in request.FILES:
            return Response({"error": "No image provided"}, status=status.HTTP_400_BAD_REQUEST)
            
        image = request.FILES['image']
        
        if not image.content_type.startswith('image'):
            return Response({"error": "File must be an image"}, status=status.HTTP_400_BAD_REQUEST)
            
        # Check file size (2MB limit)
        if image.size > 2 * 1024 * 1024:
            return Response({"error": "Image size cannot exceed 2MB"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Delete old image if it exists
        if post.image:
            if os.path.isfile(post.image.path):
                os.remove(post.image.path)
        
        # Save new image
        post.image = image
        post.save()
        return Response(PostSerializer(post).data)

class DeletePostView(APIView):
    def delete(self, request, post_id):
        try:
            post = Post.objects.get(id=post_id)
        except Post.DoesNotExist:
            return Response({"error": "Post not found"}, status=status.HTTP_404_NOT_FOUND)
            
        # The image file will be deleted by the Post.delete() method
        post.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)