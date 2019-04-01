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
# from .utils import basesListToHtml, calculateFillToHtml, calculateMasterToHtml, populateMatrixFormulaBody
from .utils import *

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
        history= History.objects.filter(product=pk).latest('revision')

        data = history.data
        if isinstance(data, str):
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
        prod_currency = str(product.currencies)
        stdlogger.debug("       *** [debug] product_currency: "+ prod_currency)
        prod_admin = ""

        prod_lvl_fill = history.lvl_fill

        if prod_owner == request.user.username or request.user.username == "admin":
            try:
                lista = _data['data']
                stdlogger.debug("       *** [debug] product history_data: {}".format(lista))
            except:
                import traceback
                print(traceback.format_exc())
                lista = { }

            if request.user.username == "admin":
                prod_admin = True
            else:
                prod_admin = False

            matrixList = basesListToHtml(lista, prod_currency)
            nbases = int( (len(matrixList[3]) - 3 ) / 5)
            print("nbases -> {}".format(nbases))
            print("matrixList -> {}".format(matrixList))

            master = calculateMasterToHtml(matrixList, prod_lvl_fill, nbases)

            return render(request, 'product/product_detail.html', {
                'list': matrixList,
                'master': master,
                'prod_name': prod_name,
                'prod_pk': prod_pk,
                'prod_rev': prod_rev,
                'prod_currency': prod_currency,
                'prod_admin': prod_admin,
                'history_id': history_id,
                'prod_lvl_fill': prod_lvl_fill,
                'bases_num': nbases,
                })
            # return render(request, 'product/product_detail.html')
        else:
            stdlogger.debug("       *** [debug] ERROR on detail show: NOT ALLOWED ACTION!!!")
            return render(request, 'product/error.html')


@login_required(login_url='login/')
def product_list(request):

    if request.user.is_authenticated():
        username = request.user.username

        if request.user.is_superuser:
            products = Product.objects.all().order_by('name')
        else:
            products = Product.objects.filter(owner = username).order_by('name')

        stdlogger.info("        +++ [info] Product.objects.raw")
        stdlogger.info(products)
        return render(request, 'product/product_list.html', {'products': products})

    else:
        return render(request, 'product/product_list.html')

@login_required
def product_new(request):
    print(request.GET)
    print(request.POST)
    if request.method == "POST":
        # import pdb; pdb.set_trace()
        my_product_name = request.POST.get('name')
        my_product_data = request.POST.get('data')
        my_product_rev = request.POST.get('revision')
        my_product_currency= request.POST.get('currency')
        my_product_lvl_fill = request.POST.get('lvl_fill')
        my_product_lvl_fill = list(map(int, my_product_lvl_fill.split(" ")))
        if(my_product_rev):
            print("revision -> "+str(my_product_rev))
        elif (my_product_rev is None):
            my_product_rev = 0

        data = json.loads(my_product_data)
        if request.user.is_authenticated():
            username = request.user.username

        try:
            my_product = Product.objects.create(name=my_product_name, owner=username, currencies=my_product_currency)
            my_product.save()
            History.objects.create(data=my_product_data, revision=my_product_rev, product_id=my_product.id,lvl_fill=my_product_lvl_fill)
            messages.success(request, "The product %s has been successfully created" % my_product.name.upper())
        except Exception as e:
            import traceback
            stdlogger.warning("        +++ [warning] Exception raised!")
            stdlogger.warning("type error: " + str(e))
            stdlogger.warning("traceback :\n"+traceback.format_exc())
            my_product_just_created = Product.objects.latest('id')
            my_product_just_created.delete()
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
        my_product_lvl_fill = request.POST.get('lvl_fill')

        # my_product_currency= request.POST.get('currency')

        if(my_product_rev):
            print("revision -> "+str(my_product_rev))
        elif (my_product_rev is None):
            my_product_rev = 0

        data = json.loads(my_product_data)
        # if request.user.is_authenticated():
        #     username = request.user.username
        stdlogger.info("        +++ [info] new History object created")
        lvl_fill = list(map(int, my_product_lvl_fill.split(" ")))
        History.objects.create(data=data, revision=my_product_rev, product_id=my_product_pk, lvl_fill=lvl_fill)
        obj = Product.objects.get(pk=my_product_pk)
        messages.info(request, "The product %s has been successfully updated" % obj.name.upper())
            # redirect to HOME
        return HttpResponseRedirect("/")

    
# delete the history -> the current revision of the product
@login_required
def product_delete(request, pk):

    if pk:
        history = get_object_or_404(History, pk=pk)
        prod_pk = history.product_id
        history_rev = history.revision
        product = Product.objects.get(pk=prod_pk)
        history.delete()
        stdlogger.debug(history_rev)
        if int(history_rev) >= 1:
            messages.info(request, "Revision {} of product {} has been successfully deleted".format(history_rev,product.name.upper()))
        else:
            product.delete()
            messages.warning(request, "Revision {} of product {} has been successfully deleted..\nThe product has been erased.".format(history_rev,product.name.upper()))

    # redirect to HOME
    return HttpResponseRedirect("/")


# erase current product and all his history/revisions
@login_required
def product_erase(request, pk):

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
        messages.warning(request, "The product %s has been successfully deleted" % product.name)
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
    if isinstance(data, str):
        _data = json.loads(data)
    else:
        _data = data
    prod_name = product.name
    prod_pk = pk
    rev = history.revision
    # stdlogger.debug("       *** [debug] product name: "+ prod_name)
    prod_owner = product.owner
    stdlogger.debug("       *** [debug] product owner: "+ prod_owner)
    prod_currency = str(product.currencies)
    stdlogger.debug("       *** [debug] product currency: "+ prod_currency)
    prod_admin = ""
    prod_lvl_fill = history.lvl_fill

    if prod_owner == request.user.username:
        try:
            lista = _data['data']
            # stdlogger.debug("       *** [debug] product data: {}".format(lista))
            
        except:
            import traceback
            print(traceback.format_exc())
            lista = { }

        if request.user.username == "admin":
            prod_admin = True
        else:
            prod_admin = False

        return render(request, 'product/product_update.html', {'list': lista, 'prod_name': prod_name, 'prod_pk':prod_pk, 'prod_rev':rev, 'prod_currency':prod_currency, 'prod_admin':prod_admin, 'prod_lvl_fill':prod_lvl_fill})   
    else:
        stdlogger.debug("       *** [debug] ERROR on detail show: NOT ALLOWED ACTION!!!")
        return render(request, 'product/error.html')


from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
def retrieveBasesAndFillvl(request):
    # import pdb; pdb.set_trace()
    print(request.POST.keys())
    if request.method == 'POST' and 'payload' in request.POST.keys():
        print("server side!")
        _payload = request.POST['payload']
        payload = json.loads(_payload)

        for array in payload:
            for k,item in enumerate(array):
                if not item:
                    # print("empty item? {}:{}".format(k,item))
                    array[k] = None

        nbases = int( (len(payload[0]) - 3 ) / 5)

        print("nbases: {}".format(nbases))
        print("payload:\n{}".format(payload))
        calculatedPayload = populateMatrixFormulaBody(payload, nbases)
        print("calculatedPayload:\n{}".format(calculatedPayload))

        data = {'payload': calculatedPayload}
    else:
        data = {'payload': 'KO'}

    return JsonResponse(data)