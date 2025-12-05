from django.test import TestCase
from django.contrib.auth.models import User
from .models import Book, BorrowTransaction, UserProfile
from .patterns.singleton import LibraryCatalogue
from .patterns.factory import UserFactory
from datetime import date, timedelta

class LibrarySystemTests(TestCase):

    def setUp(self):
        # Setup initial data
        self.catalogue = LibraryCatalogue()
        self.catalogue.add_book("Clean Code", "Robert Martin", "12345")

    def test_singleton_catalogue(self):
        """Test that Catalogue acts as a singleton access point"""
        cat1 = LibraryCatalogue()
        cat2 = LibraryCatalogue()
        self.assertEqual(cat1, cat2) # Check instance identity
        self.assertEqual(len(cat1.get_all_books()), 1)

    def test_factory_user_creation(self):
        """Test Factory pattern for User creation"""
        UserFactory.create_user("student1", "pass", "STUDENT")
        UserFactory.create_user("prof1", "pass", "FACULTY")
        
        s_profile = UserProfile.objects.get(user__username="student1")
        p_profile = UserProfile.objects.get(user__username="prof1")
        
        self.assertEqual(s_profile.borrow_limit, 3)
        self.assertEqual(p_profile.borrow_limit, 10)

    def test_observer_pattern(self):
        """Test Signal triggers on return"""
        user = User.objects.create(username="borrower")
        book = Book.objects.get(isbn="12345")
        book.is_available = False
        book.save()
        
        # Create a transaction
        txn = BorrowTransaction.objects.create(
            user=user, book=book, 
            expected_return_date=date.today()
        )
        
        # Simulate Return
        txn.actual_return_date = date.today()
        txn.is_returned = True
        txn.save() # Should trigger signal to make book available
        
        book.refresh_from_db()
        self.assertTrue(book.is_available)

    def test_decorator_fee(self):
        """Test Decorator pattern for late fees"""
        user = User.objects.create(username="late_user")
        book = Book.objects.get(isbn="12345")
        
        # Past due date
        expected = date.today() - timedelta(days=5)
        
        txn = BorrowTransaction.objects.create(
            user=user, book=book, 
            expected_return_date=expected
        )
        
        # Return today (5 days late)
        from .patterns.decorator import FeeCalculator, LateFeeDecorator
        txn.actual_return_date = date.today()
        
        calc = LateFeeDecorator(FeeCalculator())
        fee = calc.calculate(txn)
        
        # 5 days * $2 = $10
        self.assertEqual(fee, 10.0)