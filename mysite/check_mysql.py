from django.core.management.base import BaseCommand
from django.db import connection
from django.db.utils import OperationalError


class Command(BaseCommand):
    help = "Check MySQL connection."

    def handle(self, *args, **kwargs):
        self.stdout.write("Checking MySQL connection...")
        try:
            # Try to get cursor (forces a connection)
            with connection.cursor() as cursor:
                cursor.execute("SELECT 1;")
                row = cursor.fetchone()
            if row and row[0] == 1:
                self.stdout.write(self.style.SUCCESS("MySQL connection successful!"))
            else:
                self.stdout.write(self.style.WARNING("Connected, but unexpected response."))
        except OperationalError as e:
            self.stdout.write(self.style.ERROR(f"MySQL connection failed: {e}"))