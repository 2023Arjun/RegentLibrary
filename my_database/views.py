from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from datetime import date, timedelta
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication

# Patterns
from .patterns.singleton import LibraryCatalogue
from .patterns.factory import UserFactory
from .patterns.decorator import FeeCalculator, LateFeeDecorator
from .patterns.librarian import Librarian

# Models & Serializers
from .models import Book, BorrowTransaction, UserProfile
from .serializers import BookSerializer, TransactionSerializer, UserTransactionSerializer

class RegisterUserView(APIView):
    """ Factory Pattern Usage """
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        role = request.data.get('role', 'STUDENT') # STUDENT or FACULTY
        
        try:
            UserFactory.create_user(username, password, role)
            return Response({"message": "User created successfully"}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class CatalogueView(APIView):
    """ Singleton Pattern Usage """
    def get(self, request):
        catalogue = LibraryCatalogue() 
        
        # Check if frontend sent a search query
        search_query = request.query_params.get('search', '').strip()

        if search_query:
            # Use the method we defined in the Singleton Step 1
            books = catalogue.find_book_by_title(search_query)
        else:
            # Default behavior: Return all books
            books = catalogue.get_all_books()

        serializer = BookSerializer(books, many=True)
        return Response(serializer.data)

    def post(self, request):
        # Only Librarians should add books
        librarian = Librarian() 
        
        try:
            book = librarian.add_book_to_library(
                title=request.data.get('title'),
                author=request.data.get('author'),
                isbn=request.data.get('isbn')
            )
            return Response({"message": f"Librarian added {book.title}"}, status=201)
        except Exception as e:
            return Response({"error": str(e)}, status=400)

class BookDetailView(APIView):
    # Handles operations on a specific book ID
    def delete(self, request, book_id):
        # Only Librarians should remove books
        librarian = Librarian()
        
        try:
            librarian.remove_book_from_library(book_id)
            return Response({"message": "Librarian deleted book"}, status=204)
        except Exception as e:
            return Response({"error": str(e)}, status=400)

class LibrarianDashboardView(APIView):
    """ New View: Allows librarian to track borrowed books """
    def get(self, request):
        librarian = Librarian()
        transactions = librarian.get_all_active_transactions()
        
        # We need a serializer for transactions
        serializer = TransactionSerializer(transactions, many=True)
        return Response(serializer.data)

class ReturnBookView(APIView):
    """ Observer & Decorator Pattern Usage """
    def post(self, request, transaction_id):
        try:
            txn = BorrowTransaction.objects.get(id=transaction_id)
            if txn.is_returned:
                return Response({"message": "Already returned"})

            # Set Return Data
            txn.actual_return_date = date.today()
            txn.is_returned = True
            
            # Decorator Pattern: Calculate Fees
            base_calc = FeeCalculator()
            late_fee_calc = LateFeeDecorator(base_calc)
            fee = late_fee_calc.calculate(txn)
            
            txn.fee_charged = fee
            txn.save() # This save triggers the Signal (Observer Pattern)

            return Response({
                "message": "Book returned successfully", 
                "fee": fee
            })
        except BorrowTransaction.DoesNotExist:
            return Response({"error": "Transaction not found"}, status=404)
        
class BookDetailView(APIView):
    """ Handles operations on a specific book ID """
    def delete(self, request, book_id):
        catalogue = LibraryCatalogue()
        try:
            catalogue.remove_book(book_id)
            return Response({"message": "Book deleted"}, status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class BorrowBookView(APIView):
    authentication_classes = [TokenAuthentication] # Explicitly use Token Auth
    permission_classes = [IsAuthenticated] # <--- ONLY LOGGED IN USERS CAN BORROW

    def post(self, request, book_id):
        book = get_object_or_404(Book, id=book_id)
        user = request.user # <--- THE REAL USER
        
        # 1. Check Availability
        if not book.is_available:
            return Response({"error": "Book is currently unavailable"}, status=400)

        # 2. Determine Due Date
        if request.data.get('test_late'):
            expected_date = date.today() - timedelta(days=5)
        else:
            expected_date = date.today() + timedelta(days=7)

        # 3. Create Transaction
        BorrowTransaction.objects.create(
            user=user,
            book=book,
            expected_return_date=expected_date
        )

        # 4. Update Book
        book.is_available = False
        book.save()

        return Response({"message": f"Borrowed '{book.title}' successfully!"})
    
class CustomLoginView(ObtainAuthToken):
    """ Authenticate user and return Token + Role """
    def post(self, request, *args, **kwargs):
        # This calls Django's internal login logic
        serializer = self.serializer_class(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        
        # Get or Create Token
        token, created = Token.objects.get_or_create(user=user)
        
        # Get Role from UserProfile
        role = 'STUDENT' # Default
        if hasattr(user, 'userprofile'):
            role = user.userprofile.role

        return Response({
            'token': token.key,
            'user_id': user.pk,
            'username': user.username,
            'role': role
        })
    
class UserTransactionsView(APIView):
    permission_classes = [IsAuthenticated] # Must be logged in

    def get(self, request):
        # Filter: Current User AND Not Returned yet
        txns = BorrowTransaction.objects.filter(user=request.user, is_returned=False)
        serializer = UserTransactionSerializer(txns, many=True)
        return Response(serializer.data)