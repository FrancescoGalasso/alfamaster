# from django.shortcuts import render
from django.utils import timezone
from .models import Product
from django.shortcuts import render, get_object_or_404
import json

def product_detail(request, pk):
    product = get_object_or_404(Product, pk=pk)
    # print(product.data)
    # _json = '{"raw_material": "H20", "specific_weight": "1", "RM_cost": "1", "base_product":[{"base_name":"pastello", "g/100g":"x"}]}'
    # print(_json)
    print(product)
    data =product.data
    print(data)
        # {u'office': {u'medical': [{u'use': u'reception', u'sq-ft': 50, u'price': 75, u'room-number': 100}, {u'use': u'waiting', u'sq-ft': 250, u'price': 75, u'room-number': 101}, {u'use': u'examination', u'sq-ft': 125, u'price': 150, u'room-number': 102}, {u'use': u'examination', u'sq-ft': 125, u'price': 150, u'room-number': 103}, {u'use': u'office', u'sq-ft': 150, u'price': 100, u'room-number': 104}]}, u'parking': {u'price': 750, u'style': u'covered', u'location': u'premium'}}
    test = json.dumps(data)
    print(test)
        # {"office": {"medical": [{"use": "reception", "sq-ft": 50, "price": 75, "room-number": 100}, {"use": "waiting", "sq-ft": 250, "price": 75, "room-number": 101}, {"use": "examination", "sq-ft": 125, "price": 150, "room-number": 102}, {"use": "examination", "sq-ft": 125, "price": 150, "room-number": 103}, {"use": "office", "sq-ft": 150, "price": 100, "room-number": 104}]}, "parking": {"price": 750, "style": "covered", "location": "premium"}}

    test2 = json.loads(test)
    # data  = json.loads(data)
    # print(_json['base_product'][0])
    prod_name = product.name
    print(prod_name)

    print("")
    # Create fixed data structures to pass to template
    # data could equally come from database queries
    # web services or social APIs
    STORE_NAME = 'Downtown'
    store_address = {'street':'Main #385','city':'San Diego','state':'CA'}
    store_amenities = ['WiFi','A/C']
    store_menu = ((0,''),(1,'Drinks'),(2,'Food'))
    values_for_template = {'store_name':STORE_NAME, 'store_address':store_address, 'store_amenities':store_amenities, 'store_menu':store_menu}

    return render(request, 'product/product_detail.html', values_for_template)    
    # return render(request, 'product/product_detail.html')


def product_list(request):
    products = Product.objects.all()
    return render(request, 'product/product_list.html', {'products': products})