from django.db import models
from django.contrib.auth.models import User

class Book(models.Model):
    # Basic book model
    title = models.CharField(max_length=255)
    author = models.CharField(max_length=255)
    isbn = models.CharField(max_length=14, unique=True)
    is_available = models.BooleanField(default=True)
    waiting_list = models.ManyToManyField(User, related_name='waiting_for', blank=True)

    def __str__(self):
        return self.title

# UserProfile to extend User model with roles and borrow limits
class UserProfile(models.Model):
    ROLE_CHOICES = (
        ('STUDENT', 'Student'), 
        ('FACULTY', 'Faculty'),
        ('LIBRARIAN', 'Librarian')
    )
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)
    borrow_limit = models.IntegerField(default=5)

    def __str__(self):
        return f"{self.user.username} - {self.role}"

# BorrowTransaction model to track book borrowings
class BorrowTransaction(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    issue_date = models.DateField(auto_now_add=True)
    expected_return_date = models.DateField()
    actual_return_date = models.DateField(null=True, blank=True)
    is_returned = models.BooleanField(default=False)
    fee_charged = models.DecimalField(max_digits=6, decimal_places=2, default=0.00)

    def __str__(self):
        return f"{self.user.username} borrowed {self.book.title}"