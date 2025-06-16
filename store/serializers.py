from rest_framework import serializers
from .models import PaymentMethod, Payment

class PaymentMethodSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentMethod
        fields = '__all__'

class PaymentSerializer(serializers.ModelSerializer):
    method_name = serializers.CharField(source='method.name', read_only=True)
    cashier_name = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = Payment
        fields = ['id', 'amount', 'method', 'method_name', 'user', 'cashier_name', 
                 'processing_fee', 'net_amount', 'created']