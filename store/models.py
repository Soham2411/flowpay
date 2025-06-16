from django.db import models
from django.contrib.auth.models import User
from decimal import Decimal

class PaymentMethod(models.Model):
    name = models.CharField(max_length=50)
    fee_percent = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    
    def __str__(self):
        return f"{self.name} ({self.fee_percent}% fee)"

class Payment(models.Model):
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    method = models.ForeignKey(PaymentMethod, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created = models.DateTimeField(auto_now_add=True)
    
    # Auto-calculated fields
    processing_fee = models.DecimalField(max_digits=8, decimal_places=2, default=0.00)
    net_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    
    def save(self, *args, **kwargs):
        # Fixed business logic - keep everything as Decimal
        if self.method and self.amount:
            fee_percent = self.method.fee_percent
            print(f"DEBUG: Method={self.method.name}, Fee%={fee_percent}")
            
            if fee_percent > 0:
                # Convert to Decimal to avoid type mixing
                fee_rate = Decimal(str(fee_percent)) / Decimal('100')
                self.processing_fee = self.amount * fee_rate
                self.net_amount = self.amount - self.processing_fee
                print(f"DEBUG: Amount=${self.amount}, Fee=${self.processing_fee}, Net=${self.net_amount}")
            else:
                self.processing_fee = Decimal('0.00')
                self.net_amount = self.amount
                print(f"DEBUG: No fee for {self.method.name}")
        
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"${self.amount} - {self.method.name} (Net: ${self.net_amount})"