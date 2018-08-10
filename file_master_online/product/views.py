# from django.shortcuts import render
from django.utils import timezone
from .models import Product
from django.shortcuts import render, get_object_or_404
import json

# Python logging package
import logging
# Standard instance of a logger with __name__
stdlogger = logging.getLogger(__name__)


def product_detail(request, pk):
    stdlogger.info("        +++ [info] Call to PRODUCT_DETAIL method")

    product = get_object_or_404(Product, pk=pk)
    data =product.data
    prod_name = product.name
    stdlogger.debug("       *** [debug] product name: "+ prod_name)

    try:
        lista = data['data']
        stdlogger.debug("       *** [debug] product data: {}".format(lista))
    except:
        import traceback
        print traceback.format_exc()
        lista = { }
    return render(request, 'product/product_detail.html', {'list': lista, 'prod_name': prod_name})    
    # return render(request, 'product/product_detail.html')


def product_list(request):
    products = Product.objects.all()
    return render(request, 'product/product_list.html', {'products': products})