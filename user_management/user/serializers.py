from django.contrib.auth.models import User, Group, Permission
from rest_framework import serializers

class UserSerializer(serializers.ModelSerializer):
    groups = serializers.StringRelatedField(many=True)
    user_permissions = serializers.StringRelatedField(many=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'is_staff', 'is_superuser', 'groups', 'user_permissions']

class GroupSerializer(serializers.ModelSerializer):
    permissions = serializers.StringRelatedField(many=True)

    class Meta:
        model = Group
        fields = ['id', 'name', 'permissions']
