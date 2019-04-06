# from django.shortcuts import render
from django.utils import timezone
from .models import Product
from .models import History
from django.shortcuts import render, get_object_or_404, get_list_or_404
from django.http import HttpResponse, HttpResponseNotFound, Http404,  HttpResponseRedirect
from django.shortcuts import redirect
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from .utils import *
import json
import traceback
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
        prod_owner = product.owner
        prod_rev = str(history.revision)
        prod_currency = str(product.currencies)
        prod_admin = ""
        prod_lvl_fill = history.lvl_fill

        stdlogger.debug("       *** [debug] product history_id: "+ str(history_id))
        stdlogger.debug("       *** [debug] product_name: "+ prod_name)
        stdlogger.debug("       *** [debug] product_owner: "+ prod_owner)
        stdlogger.debug("       *** [debug] product history_revision: "+ prod_rev)
        stdlogger.debug("       *** [debug] product_currency: "+ prod_currency)


        if prod_owner == request.user.username or request.user.username == "admin":
            try:
                lista = _data['data']
                stdlogger.debug("       *** [debug] product history_data: {}".format(lista))
            except:
                print(traceback.format_exc())
                lista = { }

            if request.user.username == "admin":
                prod_admin = True
            else:
                prod_admin = False

            matrixList = basesListToHtml(lista, prod_currency)
            nbases = int( (len(matrixList[3]) - 3 ) / 5)
            # print("nbases -> {}".format(nbases))
            # print("matrixList -> {}".format(matrixList))

            _lista = matrixList[2:-1]    # no op on header and footer arrays
            _fillvl = prod_lvl_fill[2]
            master = calculateMasterToHtml(_lista, _fillvl, nbases)

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
def product_savenew(request):
    print(request.GET)
    print(request.POST)
    if request.method == "POST":

        formula_name = request.POST.get('main-dashboard-form-save-input-name')
        formula_data = request.POST.get('main-dashboard-form-save-input-data')
        formula_currency = request.POST.get('main-dashboard-form-save-input-currency')
        formula_fillvl = request.POST.get('main-dashboard-form-save-input-fillvl')
        formula_revision = request.POST.get('main-dashboard-form-save-input-revision')
        formula_pk = request.POST.get('main-dashboard-form-save-input-pk')

        # print("{}, {}, {}, {}, {}, {}".format(formula_name, formula_data, formula_currency, formula_fillvl, formula_revision, formula_pk))

        _formula_revision = int(formula_revision)
        if(_formula_revision > 0):
            _formula_revision += 1

        _data = json.loads(formula_data)
        data = convertMatrixToBasesList(_data)

        if request.user.is_authenticated():
            username = request.user.username

        try:
            my_product = Product.objects.create(name=formula_name, owner=username, currencies=formula_currency)
            my_product.save()
            _formula_fillvl = list(map(int, formula_fillvl.split(" ")))
            History.objects.create(data=data, revision=formula_revision, product_id=my_product.id,lvl_fill=_formula_fillvl)
            messages.success(request, "The product %s has been successfully created" % my_product.name.upper())
        except Exception as e:
            import traceback
            stdlogger.warning("        +++ [warning] Exception raised!")
            stdlogger.warning("type error: " + str(e))
            stdlogger.warning("traceback :\n"+traceback.format_exc())
            formula_just_created = Product.objects.latest('id')
            formula_just_created.delete()
        # redirect to HOME
        return HttpResponseRedirect("/")

    return render(request, "product/product_new.html")


@login_required
def product_saveupdate(request):
    print(request.GET)
    print(request.POST)
    if request.method == "POST":

        print(request.POST.keys())

        formula_name = request.POST.get('main-dashboard-form-save-input-name')
        formula_data = request.POST.get('main-dashboard-form-save-input-data')
        formula_currency = request.POST.get('main-dashboard-form-save-input-currency')
        formula_fillvl = request.POST.get('main-dashboard-form-save-input-fillvl')
        formula_revision = request.POST.get('main-dashboard-form-save-input-revision')
        formula_pk = request.POST.get('main-dashboard-form-save-input-pk')

        # my_product_currency= request.POST.get('currency')

        if(int(formula_revision) > 0):
            formula_revision += 1

        data = json.loads(formula_data)
        stdlogger.info("        +++ [info] new History object created")
        lvl_fill = list(map(int, my_product_lvl_fill.split(" ")))
        History.objects.create(data=formula_data, revision=formula_revision, product_id=formula_pk, lvl_fill=formula_fillvl)
        obj = Product.objects.get(pk=formula_pk)
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

    if request.user.is_authenticated():
        # import pdb; pdb.set_trace()
        stdlogger.info("        +++ [info] Call to UPDATE logic")
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
        prod_owner = product.owner
        prod_rev = str(history.revision)
        prod_currency = str(product.currencies)
        prod_admin = ""
        prod_lvl_fill = history.lvl_fill

        stdlogger.debug("       *** [debug] product history_id: "+ str(history_id))
        stdlogger.debug("       *** [debug] product_name: "+ prod_name)
        stdlogger.debug("       *** [debug] product_owner: "+ prod_owner)
        stdlogger.debug("       *** [debug] product history_revision: "+ prod_rev)
        stdlogger.debug("       *** [debug] product_currency: "+ prod_currency)


        if prod_owner == request.user.username or request.user.username == "admin":
            try:
                lista = _data['data']
                stdlogger.debug("       *** [debug] product history_data: {}".format(lista))
            except:
                print(traceback.format_exc())
                lista = { }

            if request.user.username == "admin":
                prod_admin = True
            else:
                prod_admin = False

            matrixList = basesListToHtml(lista, prod_currency)
            nbases = int( (len(matrixList[3]) - 3 ) / 5)
            # print("nbases -> {}".format(nbases))
            # print("matrixList -> {}".format(matrixList))

            _lista = matrixList[2:-1]    # no op on header and footer arrays
            _fillvl = prod_lvl_fill[2]
            master = calculateMasterToHtml(_lista, _fillvl, nbases)

            return render(request, 'product/product_update.html', {
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


from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
def retrieveBasesAndFillvl(request):
    print(request.POST.keys())
    if request.method == 'POST' and 'payload' in request.POST.keys():
        _payload = request.POST['payload']
        payload = json.loads(_payload)

        for array in payload:
            for k,item in enumerate(array):
                if not item:
                    array[k] = None

        nbases = int( (len(payload[0]) - 3 ) / 5)

        print("nbases: {}".format(nbases))
        print("payload:\n{}".format(payload))
        calculatedPayloadBases = populateMatrixFormulaBody(payload, nbases)
        print("calculatedPayload:\n{}".format(calculatedPayloadBases))
        calculatedPayloadFillvl = calculateFillToHtml(payload)
        print("calculatedPayloadFillvl:\n{}".format(calculatedPayloadFillvl))

        data = {'payloadBases': calculatedPayloadBases, 'payloadFillvl': calculatedPayloadFillvl}
    else:
        data = {'payload': 'KO'}

    return JsonResponse(data)

@csrf_exempt
def retrieveMaster(request):
    print(request.POST.keys())
    if request.method == 'POST' and ( 'payloadBases' and 'payloadLvl' in request.POST.keys() ) :
        _payload1 = request.POST['payloadBases']
        payload1 = json.loads(_payload1)
        _payload2 = request.POST['payloadLvl']
        payload2 = json.loads(_payload2)

        for array in payload1:
            for k,item in enumerate(array):
                if not item:
                    array[k] = None

        nbases = int( (len(payload1[0]) - 3 ) / 5)

        try:
            calculatedPayloadMaster = calculateMasterToHtml(payload1, payload2, nbases)
        except Exception as e:
            print(traceback.format_exc())
            calculatedPayloadMaster = []

        print("calculatedPayloadMaster:\n{}".format(calculatedPayloadMaster))
        data = {'replyFromServer': calculatedPayloadMaster}
    else:
        data = {'payload': 'KO'}

    return JsonResponse(data)