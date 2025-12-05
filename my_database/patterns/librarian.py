from my_database.models import BorrowTransaction
from my_database.patterns.singleton import LibraryCatalogue

class Librarian:
    """
    Core Object: Librarian
    Responsible for managing the catalogue and tracking books.
    """
    def __init__(self, user_id=None):
        # In a real app, we would verify here if user_id belongs to a Librarian role.
        self.user_id = user_id 
        self.catalogue = LibraryCatalogue() # Access the Singleton

    def add_book_to_library(self, title, author, isbn):
        """Delegate adding book to the catalogue"""
        return self.catalogue.add_book(title, author, isbn)

    def remove_book_from_library(self, book_id):
        """Delegate removing book to the catalogue"""
        self.catalogue.remove_book(book_id)

    def get_all_active_transactions(self):
        """
        Track Borrowed Books: 
        Returns all transactions where the book has not been returned yet.
        """
        return BorrowTransaction.objects.filter(is_returned=False)