from django.contrib.auth.models import User
from my_database.models import UserProfile

class UserFactory:
    @staticmethod
    def create_user(username, password, role):
        # Common User creation
        user = User.objects.create_user(username=username, password=password)
        
        # Specific Profile creation based on Role
        limit = 3 if role == 'STUDENT' else 10
        UserProfile.objects.create(user=user, role=role, borrow_limit=limit)
        
        return user