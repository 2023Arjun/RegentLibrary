from datetime import date

# Component Interface
class FeeCalculator:
    def calculate(self, transaction):
        return 0.0  # Base fee is 0

# Decorator: Late Fee
class LateFeeDecorator:
    def __init__(self, wrapped_calculator):
        self.wrapped = wrapped_calculator
        self.daily_fine = 2.0  # $2 per day

    def calculate(self, transaction):
        base_fee = self.wrapped.calculate(transaction)
        
        # Logic: If returned late, add fee
        if transaction.actual_return_date and transaction.actual_return_date > transaction.expected_return_date:
            overdue_days = (transaction.actual_return_date - transaction.expected_return_date).days
            return base_fee + (overdue_days * self.daily_fine)
        
        return base_fee