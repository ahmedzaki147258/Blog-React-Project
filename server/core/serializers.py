from rest_framework import serializers
from .models import User, Post
from django.contrib.auth import authenticate
import os

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'email']

class UpdateNameSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['first_name', 'last_name']

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email', 'password']

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(**data)
        if not user:
            raise serializers.ValidationError("Invalid Credentials")
        return user

class PostSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()
    user_id = serializers.IntegerField(write_only=True)
    image = serializers.ImageField(required=False)
    image_path = serializers.CharField(read_only=True)
    
    class Meta:
        model = Post
        fields = ['id', 'title', 'image', 'image_path', 'user', 'user_id', 'created_at']
        
    def get_user(self, obj):
        return UserSerializer(obj.user).data

    def validate_user_id(self, value):
        if not User.objects.filter(id=value).exists():
            raise serializers.ValidationError("User not found.")
        return value
        
    def validate_image(self, value):
        if value and not value.content_type.startswith('image'):
            raise serializers.ValidationError("File must be an image.")
            
        if value and value.size > 2 * 1024 * 1024:  # 2MB in bytes
            raise serializers.ValidationError("Image size cannot exceed 2MB.")
            
        return value
        
    def create(self, validated_data):
        user_id = validated_data.pop('user_id')
        validated_data['user_id'] = user_id

        image = validated_data.get('image')
        post = Post.objects.create(**validated_data)
        
        if image:
            server_url = os.environ.get('SERVER_URL', 'http://127.0.0.1:8000')
            post.image_path = f"{server_url}{post.image.url}"
            post.save(update_fields=['image_path'])
            
        return post
        
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if instance.image:
            server_url = os.environ.get('SERVER_URL', 'http://127.0.0.1:8000')
            representation['image_path'] = f"{server_url}{instance.image.url}"
        return representation
