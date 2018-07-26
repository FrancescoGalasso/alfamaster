# from django.shortcuts import render
from django.utils import timezone
from .models import Product
from django.shortcuts import render, get_object_or_404

def product_detail(request, pk):
    product = get_object_or_404(Product, pk=pk)
    return render(request, 'product/product_detail.html', {'product': product})

def product_list(request):
    products = Product.objects.all()
    return render(request, 'product/product_list.html', {'products': products})