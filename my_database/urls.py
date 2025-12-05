from django.urls import path
from .views import RegisterUserView, CatalogueView, ReturnBookView, BookDetailView, LibrarianDashboardView, BorrowBookView, CustomLoginView, UserTransactionsView 

urlpatterns = [
    path('register/', RegisterUserView.as_view()),
    path('login/', CustomLoginView.as_view()),
    path('books/', CatalogueView.as_view()),
    path('books/<int:book_id>/', BookDetailView.as_view()),
    path('librarian/dashboard/', LibrarianDashboardView.as_view()), 
    path('borrow/<int:book_id>/', BorrowBookView.as_view()), 
    path('return/<int:transaction_id>/', ReturnBookView.as_view()),
    path('my-books/', UserTransactionsView.as_view()),
]