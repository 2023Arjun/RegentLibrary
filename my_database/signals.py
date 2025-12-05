from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import BorrowTransaction

@receiver(post_save, sender=BorrowTransaction)
def notify_observers(sender, instance, created, **kwargs):
    # Trigger only when book is returned
    if instance.is_returned and instance.actual_return_date:
        book = instance.book
        book.is_available = True
        book.save()

        # Notify Users in waiting list (Observer Logic)
        waiting_users = book.waiting_list.all()
        if waiting_users.exists():
            print(f"--- NOTIFICATION ---")
            print(f"Book '{book.title}' is now available.")
            print(f"Notifying users: {[u.username for u in waiting_users]}")
            # In a real app, you would send an email here
            
            # Clear waiting list (optional based on logic)
            # book.waiting_list.clear()