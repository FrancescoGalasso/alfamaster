# from django.shortcuts import render
from django.utils import timezone
from .models import Product
from .models import History
from django.shortcuts import render, get_object_or_404, get_list_or_404
import json
from django.http import HttpResponse, HttpResponseNotFound, Http404,  HttpResponseRedirect
from django.shortcuts import redirect
from django.contrib.auth.decorators import login_required
# framework messages
from django.contrib import messages


# Python logging package
import logging
# Standard instance of a logger with __name__
stdlogger = logging.getLogger(__name__)

@login_required
def product_detail(request, pk):

    if request.user.is_authenticated():
        # import pdb; pdb.set_trace()
        stdlogger.info("        +++ [info] Call to PRODUCT_DETAIL method")
        product = get_object_or_404(Product, pk=pk)
        # history_list = get_list_or_404(History, product=pk)
        history= History.objects.filter(product=pk).latest('revision')

        data = history.data
        if isinstance(data, basestring):
            _data = json.loads(data)
        else:
            _data = data

        prod_name = product.name
        prod_pk = pk
        history_id = history.id 
        stdlogger.debug("       *** [debug] product history_id: "+ str(history_id))

        stdlogger.debug("       *** [debug] product_name: "+ prod_name)
        prod_owner = product.owner
        stdlogger.debug("       *** [debug] product_owner: "+ prod_owner)
        prod_rev = str(history.revision)
        stdlogger.debug("       *** [debug] product history_revision: "+ prod_rev)
        prod_currency = unicode(product.currencies)
        stdlogger.debug("       *** [debug] product_currency: "+ prod_currency)
        prod_admin = ""

        if prod_owner == request.user.username or request.user.username == "admin":
            try:
                lista = _data['data']
                stdlogger.debug("       *** [debug] product history_data: {}".format(lista))
            except:
                import traceback
                print traceback.format_exc()
                lista = { }

            if request.user.username == "admin":
                prod_admin = True
            else:
                prod_admin = False

            return render(request, 'product/product_detail.html', {'list': lista, 'prod_name': prod_name, 'prod_pk':prod_pk, 'prod_rev':prod_rev, 'prod_currency':prod_currency, 'prod_admin':prod_admin, 'history_id':history_id})    
            # return render(request, 'product/product_detail.html')
        else:
            stdlogger.debug("       *** [debug] ERROR on detail show: NOT ALLOWED ACTION!!!")
            return render(request, 'product/error.html')

# @login_required
def product_list(request):

    if request.user.is_authenticated():
        username = request.user.username

        products = Product.objects.all()

        stdlogger.info("        +++ [info] Product.objects.raw")
        stdlogger.info(products)
        stdlogger.info(" - ")
        stdlogger.warning(Product.objects.filter(owner="simple_user"))
        return render(request, 'product/product_list.html', {'products': products})

    else:
        return render(request, 'product/product_list.html')

@login_required
def product_new(request):
    print(request.GET)
    print(request.POST)
    if request.method == "POST":
        my_product_name = request.POST.get('name')
        my_product_data = request.POST.get('data')
        my_product_rev = request.POST.get('revision')
        my_product_currency= request.POST.get('currency')

        if(my_product_rev):
            print("revision -> "+str(my_product_rev))
        elif (my_product_rev is None):
            my_product_rev = 0

        data = json.loads(my_product_data)
        if request.user.is_authenticated():
            username = request.user.username

        # Product.objects.create(name=my_product_name, data=data, revision=my_product_rev, owner=username, currencies=my_product_currency)
        my_product = Product.objects.create(name=my_product_name, owner=username, currencies=my_product_currency)
        # my_product = Product.objects.get(name='my_product_name')
        # my_product = get_object_or_404(Product, name='my_product_name', owner=username)
        my_product.save()
        History.objects.create(data=my_product_data, revision=my_product_rev, product_id=my_product.id)
            # redirect to HOME
        return HttpResponseRedirect("/")

    return render(request, "product/product_new.html")

@login_required
def product_save(request):
    print(request.GET)
    print(request.POST)
    if request.method == "POST":
        my_product_pk = request.POST.get('pk')
        my_product_data = request.POST.get('data')
        my_product_rev = request.POST.get('revision')
        # my_product_currency= request.POST.get('currency')

        if(my_product_rev):
            print("revision -> "+str(my_product_rev))
        elif (my_product_rev is None):
            my_product_rev = 0

        data = json.loads(my_product_data)
        # if request.user.is_authenticated():
        #     username = request.user.username
        stdlogger.info("        +++ [info] new History object created")
        History.objects.create(data=data, revision=my_product_rev, product_id=my_product_pk)
            # redirect to HOME
        return HttpResponseRedirect("/")

# delete the history -> the current revision of the product
@login_required
def product_delete(request, pk):

    if pk:
        history = History.objects.filter(pk=pk)
        if history.exists():
            # Standard Django delete
            history.delete()

    # redirect to HOME
    return HttpResponseRedirect("/")

# erase current product and all his history/revisions
@login_required
def product_erase(request, pk):

    # obj = get_object_or_404(Product, pk=int(pk))
    # # if not request.user.is_superuser and not request.user == obj.owner:
    # if not request.user == obj.owner:
    #     from django.core.exceptions import PermissionDenied
    #     raise PermissionDenied
    # try:
    #     obj.delete()
    #     messages.info(request, "Il prodotto %s e stato cancellato" % pk)
    # except Exception as e:
    #     messages.error(request, "ERRORE: " + str(e))
    # return HttpResponseRedirect("/")



    # import pdb; pdb.set_trace()
    product = get_object_or_404(Product, pk=int(pk))
    history = History.objects.filter(product_id=pk)
        # if not request.user == product.owner:
        #     from django.core.exceptions import PermissionDenied
        #     raise PermissionDenied

    try:
        stdlogger.info("        +++ [info] Product erased with his history")
        # Standard Django delete
        product.delete()
        history.delete()
        messages.info(request, "The product %s has been successfully deleted" % product.name)
    except Exception as e:
        stdlogger.error("        +++ [error] {}".format(e))
        messages.error(request, "ERROR: " + str(e))

    # redirect to HOME
    return HttpResponseRedirect("/")


@login_required
def product_update(request, pk):
    stdlogger.info("        +++ [info] Call to PRODUCT_UPDATE method")
    product = get_object_or_404(Product, pk=pk)
    history= History.objects.filter(product=pk).latest('revision')
    data =history.data
    if isinstance(data, basestring):
        _data = json.loads(data)
    else:
        _data = data
    prod_name = product.name
    prod_pk = pk
    rev = history.revision
    # stdlogger.debug("       *** [debug] product name: "+ prod_name)
    prod_owner = product.owner
    stdlogger.debug("       *** [debug] product owner: "+ prod_owner)
    prod_currency = unicode(product.currencies)
    stdlogger.debug("       *** [debug] product currency: "+ prod_currency)
    prod_admin = ""

    if prod_owner == request.user.username:
        try:
            lista = _data['data']
            # stdlogger.debug("       *** [debug] product data: {}".format(lista))
            
        except:
            import traceback
            print traceback.format_exc()
            lista = { }

        if request.user.username == "admin":
            prod_admin = True
        else:
            prod_admin = False

        return render(request, 'product/product_update.html', {'list': lista, 'prod_name': prod_name, 'prod_pk':prod_pk, 'prod_rev':rev, 'prod_currency':prod_currency, 'prod_admin':prod_admin})   
    else:
        stdlogger.debug("       *** [debug] ERROR on detail show: NOT ALLOWED ACTION!!!")
        return render(request, 'product/error.html')
