from my_database.models import Book

# Singleton Pattern Implementation
class LibraryCatalogue:
    # Single instance holder
    _instance = None

    # Ensuring only one instance is created
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(LibraryCatalogue, cls).__new__(cls)
        return cls._instance

    # Catalogue Methods
    def get_all_books(self):
        return Book.objects.all()

    def find_book_by_title(self, title):
        return Book.objects.filter(title__icontains=title)

    def add_book(self, title, author, isbn):
        return Book.objects.create(title=title, author=author, isbn=isbn)

    def remove_book(self, book_id):
        Book.objects.filter(id=book_id).delete()