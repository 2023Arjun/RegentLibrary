from rest_framework import serializers
from .models import Book, BorrowTransaction

# Serializers for Book and BorrowTransaction models
class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = '__all__'

class TransactionSerializer(serializers.ModelSerializer):
    # Fetch specific fields from the related Foreign Keys
    book_isbn = serializers.ReadOnlyField(source='book.isbn')
    book_title = serializers.ReadOnlyField(source='book.title') # Added title too (it's helpful)
    username = serializers.ReadOnlyField(source='user.username')

    class Meta:
        model = BorrowTransaction
        # Explicitly list fields so we get the new ones
        fields = ['id', 'book_isbn', 'book_title', 'username', 'expected_return_date', 'is_returned']

class UserTransactionSerializer(serializers.ModelSerializer):
    # Fetch the title from the related Book object
    book_title = serializers.ReadOnlyField(source='book.title')
    
    class Meta:
        model = BorrowTransaction
        fields = ['id', 'book', 'book_title', 'issue_date', 'expected_return_date']