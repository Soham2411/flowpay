from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db.models import Sum, Count, Avg
from django.utils import timezone
from datetime import timedelta
from .models import PaymentMethod, Payment
from .serializers import PaymentMethodSerializer, PaymentSerializer

class PaymentMethodViewSet(viewsets.ModelViewSet):
    queryset = PaymentMethod.objects.all()
    serializer_class = PaymentMethodSerializer

class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all().order_by('-created')
    serializer_class = PaymentSerializer

@api_view(['GET'])
def dashboard_analytics(request):
    """
    Business Analytics API for Dashboard
    Provides key business metrics and insights
    """
    
    # Get date range (default: last 30 days)
    end_date = timezone.now().date()
    start_date = end_date - timedelta(days=30)
    
    # Filter payments by date range
    payments = Payment.objects.filter(created__date__gte=start_date)
    
    # Overall Summary
    summary = payments.aggregate(
        total_payments=Count('id'),
        total_revenue=Sum('amount') or 0,
        total_fees=Sum('processing_fee') or 0,
        total_net=Sum('net_amount') or 0,
        average_payment=Avg('amount') or 0
    )
    
    # Payment Method Breakdown
    method_breakdown = payments.values('method__name').annotate(
        count=Count('id'),
        total_amount=Sum('amount'),
        total_fees=Sum('processing_fee')
    ).order_by('-total_amount')
    
    # Daily Trends (last 7 days)
    daily_trends = []
    for i in range(7):
        date = end_date - timedelta(days=i)
        day_payments = payments.filter(created__date=date)
        daily_trends.append({
            'date': date.strftime('%Y-%m-%d'),
            'day_name': date.strftime('%A'),
            'count': day_payments.count(),
            'amount': float(day_payments.aggregate(Sum('amount'))['amount__sum'] or 0)
        })
    
    # Top Cashiers
    top_cashiers = payments.values('user__username').annotate(
        payment_count=Count('id'),
        total_sales=Sum('amount')
    ).order_by('-total_sales')[:5]
    
    return Response({
        'summary': {
            'total_payments': summary['total_payments'],
            'total_revenue': float(summary['total_revenue']),
            'total_fees': float(summary['total_fees']),
            'total_net': float(summary['total_net']),
            'average_payment': float(summary['average_payment']),
        },
        'payment_methods': list(method_breakdown),
        'daily_trends': daily_trends,
        'top_cashiers': list(top_cashiers),
        'date_range': {
            'start': start_date.strftime('%Y-%m-%d'),
            'end': end_date.strftime('%Y-%m-%d')
        }
    })

@api_view(['POST'])
def create_payment(request):
    """
    API endpoint for creating payments (for future POS integration)
    """
    serializer = PaymentSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)