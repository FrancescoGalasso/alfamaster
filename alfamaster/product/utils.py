totalArray = []

def basesListToHtml(lista, currency = ""):
    # lista [
    #   {'bases': [{'g_100g': '25'}, {'g_100g': '5'}, {'g_100g': '0'}],
    #    'RM_cost': '0',
    #    'raw_material': 'H2O',
    #    'specific_weight': '1'},
    #    { .. }
    # ]

    print("lista {}".format(lista))
    print("type lista : {}".format(type(lista)))

    listofFormula = []
    nbases = 0

    for d in lista:
        formula = []
        for k, v in sorted(d.items()):
            # k: RM_cost | v: 0.58
            # k: bases | v: [{'g_100g': '0.1'}, ..]
            # k: raw_material | v: nh3
            # k: specific_weight | v: 1
            # print("k: {} | v: {}".format(k,v))
            if 'RM_cost' in k:
                formula.append(v)
            if 'bases' in k:
                arrayofBases = []
                arrayofBases = convertBasesListToArray(v)
                formula.extend(arrayofBases)
                nbases = len(v)
            if 'raw_material' in k:
                formula.insert(0,v)
            if 'specific_weight' in k:
                formula.insert(1,v)

        listofFormula.append(formula)


    thead1stRow = [None, None, None, 'Base1 (PASTEL)', 'TiO<sub>2</sub> slurry', 'Base2']
    thead2ndRow = ['Raw material', 'Specific weight [g/mL]', 'RM cost ['+currency+' / Kg ]']
    theadBase = ['%w/w','mL/100g', '%v/v', 'mL/1000g']
    formulaCost = 'Formula Cost [ '+currency+' / L ]'
    theadBase.append(formulaCost)
    
    for i in range(nbases):
        thead2ndRow.extend(theadBase)
        if i > 2:
            newBase = 'Base'+str(i)
            thead1stRow.append(newBase)

    # a = populateMatrixFormulaBody(listofFormula, nbases)
    populateMatrixFormulaBody(listofFormula, nbases)
    # print("thead1stRow completed : {}".format(thead1stRow))
    # print("thead2ndRow completed : {}".format(thead2ndRow))
    listofFormula.insert(0,thead1stRow)
    listofFormula.insert(1,thead2ndRow)

    tfooter = ['Total']
    nCellTfooterMissing = len(thead2ndRow) - 3
    for i in range(nCellTfooterMissing):
        tfooter.append(None)

    populateFormulaFooter(tfooter)
    
    listofFormula.append(tfooter)

    return listofFormula
    
def convertBasesListToArray(bases):
    # [{'g_100g': '0'}, {'g_100g': '0'}, {'g_100g': '0'}]
    nbases = len(bases)
    basesListToArray = []

    for base in bases:
        for k,v in base.items():
            # print("k: {} | v: {}".format(k,v))
            basesListToArray.append(v)
            basesListToArray.extend([None, None, None, None])

    return basesListToArray

def convertMatrixToBasesList(matrix):

    # data : [ {
    # "raw_material" :
    # "specific_weight" :
    # "RM_cost" :
    # "bases" : [ ... ]
    # } ]

    listofIndexs = [0,1,2,3,8,13]
    nbases = (len(matrix[0]) - 3) / 5
    print("nbases : {}".format(nbases))

    if nbases > 3:
        nbasesDefault = 3
        missingIndex = int(nbases) - nbasesDefault
        for i in range(missingIndex):
            try:
                lastVal = listofIndexs[-1]
                lastVal += 5
                listofIndexs.append(lastVal)
            except:
                print(" @ exception @")
                break

    data = {}
    arr = []
    for n in matrix:
        obj = {}
        arr2 = []
        for k,v in enumerate(n):
            for idx in listofIndexs:
                if k == idx and idx < 3:
                    if k == 0:
                        obj['raw_material'] = v
                    elif k == 1:
                        obj['specific_weight'] = v
                    elif k == 2:
                        obj['RM_cost'] = v
                elif k == idx and idx >= 3:
                    objBase = {}
                    objBase['g_100g'] = v
                    arr2.append(objBase)

        print("obj : {}".format(obj))
        print("objBase : {}".format(objBase))
        obj['bases'] = arr2
        arr.append(obj)

    # print("arr :\n{}".format(arr))
    data['data'] = arr
    print("data :\n{}".format(data))

    return data

def populateMatrixFormulaBody(matrixFormula, nbases):
    # this formula has no header no footer
    sum_ml100g = 0
    sum_vv = 0
    sum_ml1000g = 0
    sum_fcost = 0

    swArray = []
    rmcostArray = []
    ml100gArray = []
    vvArray = []
    ml1000gArray = []
    fcostArray = []

    # ! ~~ put None to all calculated values on matrixFormula each time this function is called
    default_indexs = [0,1,2,3,8,13]
    if nbases > 2:
        diff = int(nbases) - 3
        for i in range(diff):
            last_index = default_indexs[-1]
            new_calculated_index_value = int(last_index) + 5
            default_indexs.append(new_calculated_index_value)
    for arr in matrixFormula:
        for k,v in enumerate(arr):
            if k not in default_indexs:
                arr[k] = None

    numofRawMat = len(matrixFormula)
    print("numofRawMat -> {} | nbases -> {}".format(numofRawMat, nbases))

    for array in matrixFormula:
        swArray.append(array[1])
        rmcostArray.append(array[2])

    totalArray.clear()
    for i in range(nbases):
        sumofMl100g = 0.0
        sumofVv = 0.0
        sumofMl1000g = 0.0
        sumofFcost = 0.0
        sumofWW = 0.0
        _test = int(nbases)-1
        print("\t{} of {}".format(i, _test))
        for array in matrixFormula:
            index = i*5
            ww = array[3+index]
            sumofWW += float(ww)

        tmpMl100g = []
        for array in matrixFormula:
            index = i*5
            operand1_ml100g = array[3+index]
            operand2_ml100g = array[1]
            _ml100g = float(operand1_ml100g)/float(operand2_ml100g)
            ml100g = "{:.3f}".format(_ml100g)
            sumofMl100g += float(ml100g)
            tmpMl100g.append(ml100g)
        ml100gArray.extend(tmpMl100g)

        tmpVV = []
        for idx,array in enumerate(matrixFormula):
            index = i*numofRawMat
            operand1_vv = ml100gArray[idx+index]
            operand2_vv = sumofMl100g
            _vv = (float(operand1_vv)*100)/float(operand2_vv)
            print('DEBUG::: operand1_vv:{} , operand2_vv: {}'.format(operand1_vv, operand2_vv))
            vv = "{:.3f}".format(_vv)
            sumofVv += float(vv)
            tmpVV.append(vv)
        vvArray.extend(tmpVV)

        tmpMl1000g = []
        for idx,array in enumerate(matrixFormula):
            index = i*numofRawMat           
            operand1_ml1000g = vvArray[idx+index]
            _ml1000g = float(operand1_ml1000g)*10
            ml1000g = "{:.3f}".format(_ml1000g)
            sumofMl1000g += float(ml1000g)
            tmpMl1000g.append(ml1000g)
        ml1000gArray.extend(tmpMl1000g)

        tmpFcost = []
        for idx,array in enumerate(matrixFormula):
            index = i*numofRawMat
            operand1_fcost = swArray[idx]
            operand2_fcost = rmcostArray[idx]
            operand3_fcost = vvArray[idx+index]
            _fcost = ((float(operand1_fcost)*float(operand2_fcost)*10)/1000)*(float(operand3_fcost))
            fcost = "{:.3f}".format(_fcost)
            sumofFcost += float(fcost)
            tmpFcost.append(fcost)
        fcostArray.extend(tmpFcost)

        totalArray.extend([sumofWW,sumofMl100g , sumofVv, sumofMl1000g, sumofFcost])

        # print("sumofWW: {}".format(sumofWW))
        # print("sumofMl100g: {}".format(sumofMl100g))
        # print("ml100gArray: {}".format(ml100gArray))
        # print("sumofVv: {}".format(sumofVv))
        # print("vvArray: {}".format(vvArray))
        # print("sumofMl1000g: {}".format(sumofMl1000g))
        # print("ml1000gArray: {}".format(ml1000gArray))
        # print("sumofFcost:{}".format(fcostArray))
        # print("fcostArray: {}".format(fcostArray))
        print("::::::::")

    # ! ~~ create base listofIndex depending on base's number
    listofIndex = [0,numofRawMat,numofRawMat*2]
    if nbases > 3:
        nbasesDefault = len(listofIndex)
        missingIndex = nbases - nbasesDefault
        for i in range(missingIndex):
            try:
                lastVal = listofIndex[-1]
                lastVal += int(numofRawMat)
                listofIndex.append(lastVal)
            except:
                print(" @ exception @")
                break
    # ! ~~ create calcuted listofIndex based on [ml100gArray, vvArray, ml1000gArray, fcostArray]
    _tmp = []
    import copy
    _tmp = copy.copy(listofIndex)
    low_val = _tmp[0]
    high_val = _tmp[1]
    diff = int(high_val) - int(low_val)
    for i in range(diff):
        idx = i+1
        for n in _tmp:
            new_value = int(n)+idx
            listofIndex.append(new_value)

    matrixCalculatedValues = [ml100gArray, vvArray, ml1000gArray, fcostArray]
    listof_calculated_values = []

    for i in listofIndex:
        for arr in matrixCalculatedValues:
            for k,v in enumerate(arr):
                if k == i:
                    listof_calculated_values.append(v)

    for idx, array in enumerate(matrixFormula):
        for v in array:
            if v is None:
                idxNone = array.index(v)
                try:
                    value = listof_calculated_values.pop(0)
                    array[idxNone] = value
                except:
                    print('exception on idxNone:{}'.format(idxNone))
                    print('exception on listof_calculated_values:{}'.listof_calculated_values)

    return matrixFormula

def populate_Matrix_Formula_footer():
    return totalArray

def populateFormulaFooter(tfooter):
    innerTotalArray = totalArray
    for v in tfooter:
        if v is None:
            idxNone = tfooter.index(v)
            tfooter[idxNone] = float(innerTotalArray.pop(0))

def calculateFillToHtml(lista):
    listofFillCalculated = []

    print("lista:\n{}".format(lista))
    operand1 = lista[2][5]
    operand2 = lista[2][10]
    print("op1: {} | op2: {}".format(operand1, operand2))
    value1 = round((float(operand1) * 100) / float(operand2))
    value2 = 100 - value1
    value3 = value2
    print("{} - {} - {}".format(value1, value2, value3))
    listofFillCalculated.extend([value1, value2, value3])

    return listofFillCalculated

def calculateMasterToHtml(lista, Fillvl, nbases):

    defLvl = int(Fillvl)
    matrixTransposed = [[lista[j][i] for j in range(len(lista))] for i in range(len(lista[0]))] 
    matrixofVV = []
    listofRawMatNames = []
    listofSpecificWeight = []
    listofRawMatCost = []
    limitCycle = len(matrixTransposed) - 1
    masterMatrix = []

    for idx,v in enumerate(matrixTransposed):
        if idx == 0:
            listofRawMatNames = v
        elif idx%5 == 0:
            matrixofVV.append(v)
        elif idx == 1:
            listofSpecificWeight = v
        elif idx == 2:
            listofRawMatCost = v
        elif idx == limitCycle:

            listofBase1VV = matrixofVV[0]
            listofTiVV = matrixofVV[1]

            listofTiRemoving = []
            sumofTiRemoving = 0.000
            listof_solid_rawMat = []
            value_to_add_to_h2o = 0.000
            value_to_add_to_max_rawMat = 0.000
            for k,v in enumerate(listofBase1VV):
                res = 0.000
                forced_res_to_zero = False 
                wwB1_current_RawMat = matrixTransposed[3][k]
                print('\nwwB1 : {}'.format(wwB1_current_RawMat))
                # if k != 2 and k != 4 and float(wwB1_current_RawMat) > 0:
                if k != 2 and k != 4:
                    res = (float(listofBase1VV[k]) - float(listofTiVV[k])*((100-defLvl)/100))/(defLvl/100)
                    print('rmvv_i: {}, rmS_i: {}, defLvl: {}'.format(float(listofBase1VV[k]), float(listofTiVV[k]), defLvl))
                    print('TiO2 Removing calculated: {} for RawMat: {}'.format(res, matrixTransposed[0][k]))
                    # check for no default raw materials (no water, no binder, no Ti )
                    if k > 4:
                        wwB1_current_RawMat = matrixTransposed[3][k]
                        index = len(matrixTransposed)
                        wwBN_current_RawMat = matrixTransposed[index-5][k]
                        diff = abs(float(wwB1_current_RawMat) - float(wwBN_current_RawMat))
                        limit = float(wwB1_current_RawMat) * 15/100
                        specific_Weight_RawMat = float(matrixTransposed[1][k])
                        print("\tcurrent raw mat: {} | specificWeight: {} | wwB1currentRawMat: {} | wwBNcurrentRawMat: {}, diff: {}, limit: {}".format(
                            matrixTransposed[0][k], specific_Weight_RawMat, wwB1_current_RawMat, wwBN_current_RawMat, diff, limit))

                        # if specific_Weight_RawMat > 1.5 and float(wwB1_current_RawMat) > 1:
                            # if wwB1_current_RawMat <= wwBN_current_RawMat and diff <= limit:
                            #     print("{} is a RAW MATERIAL SOLID\nCalculated normally\nadd to rawMatSolid list\n".format(matrixTransposed[0][k]))
                            #     tuple_ = (res, diff, k)
                            #     listof_solid_rawMat.append(tuple_)
                            # elif wwB1_current_RawMat <= wwBN_current_RawMat and diff > limit:
                            #     print("{} is a RAW MATERIAL SOLID\nCalculated normally\n".format(matrixTransposed[0][k]))
                            # elif wwB1_current_RawMat > wwBN_current_RawMat and diff <= limit:
                            #     print("{} is a RAW MATERIAL SOLID\nCalculated normally\nadd to rawMatSolid list\n".format(matrixTransposed[0][k]))
                            #     tuple_ = (res, diff, k)
                            #     listof_solid_rawMat.append(tuple_)
                            # elif wwB1_current_RawMat > wwBN_current_RawMat and diff > limit:
                            #     print("{} is a RAW MATERIAL SOLID\nCalculated must be shown as ZERO" \
                            #     "\nadd calculated value {} to max rawMatSolid in the rawMatSolid list\n".format(matrixTransposed[0][k], res))
                            #     forced_res_to_zero = True
                            #     value_to_add_to_max_rawMat += float(res)

                            # test 10/07/19
                        if specific_Weight_RawMat > 1.5:
                            if wwB1_current_RawMat <= wwBN_current_RawMat:
                                print("{} is a RAW MATERIAL SOLID\nCalculated normally\nadd to rawMatSolid list\n".format(matrixTransposed[0][k]))
                                trasposed_matrixofVV = [[matrixofVV[j][i] for j in range(len(matrixofVV))] for i in range(len(matrixofVV[0]))]
                                print('list of vv values for current rawMat: {}'.format(trasposed_matrixofVV[k]))
                                current_rawMat_vv_values = trasposed_matrixofVV[k]

                                # check if there is a value > 0 in 50% of above vv values
                                count_ok = 0
                                count_ko = 0
                                check_filler_bases = False
                                for value_vv in current_rawMat_vv_values:
                                    if float(value_vv) > 0:
                                        count_ok += 1
                                    elif float(value_vv) == 0:
                                        count_ko += 1
                                if count_ok > 0.5 * len(current_rawMat_vv_values):  
                                    check_filler_bases = True

                                tuple_ = (res, diff, k, check_filler_bases)
                                listof_solid_rawMat.append(tuple_)
                            elif wwB1_current_RawMat > wwBN_current_RawMat and diff <= limit:
                                print("{} is a RAW MATERIAL SOLID\nCalculated normally".format(matrixTransposed[0][k]))
                            elif wwB1_current_RawMat > wwBN_current_RawMat and diff > limit:
                                print("{} is a RAW MATERIAL SOLID\nCalculated must be shown as ZERO" \
                                "\nadd calculated value {} to max rawMatSolid in the rawMatSolid list\n".format(matrixTransposed[0][k], res))
                                forced_res_to_zero = True
                                value_to_add_to_max_rawMat += float(res)


                        # elif specific_Weight_RawMat < 1.5 and float(wwB1_current_RawMat) > 10:
                        elif specific_Weight_RawMat < 1.5 and float(wwB1_current_RawMat) > 2:
                            # if wwB1_current_RawMat > wwBN_current_RawMat and diff > limit:
                            #     print('wwB1_current_RawMat: {}, wwBN: {}, diff: {}, limit: {}'.format(wwB1_current_RawMat, wwBN_current_RawMat, diff, limit))
                            limit2 = float(wwB1_current_RawMat) * 0.5
                            if wwB1_current_RawMat > wwBN_current_RawMat and diff > limit2:
                                print('wwB1_current_RawMat: {}, wwBN: {}, diff: {}, limit2: {}'.format(wwB1_current_RawMat, wwBN_current_RawMat, diff, limit2))
                                print("{} is not a RAW MATERIAL SOLID\nmustbe calculated to ZERO on MASTER TABLE." \
                                "\nAdd calculated value to h2o".format(matrixTransposed[0][k]))
                                forced_res_to_zero = True
                                value_to_add_to_h2o += float(res)
                            else:
                                print("{} is not a RAW MATERIAL SOLID\nnothing to do".format(matrixTransposed[0][k]))
                        elif float(wwB1_current_RawMat) < 10:
                            print("{} is not a RAW MATERIAL SOLID\nnothing to do".format(matrixTransposed[0][k]))
                        # if TiO2 removing value is < 0,  set it to 0
                        if res < 0:
                            print('forcing {} TiO2 removing to 0'.format(matrixTransposed[0][k]))
                            forced_res_to_zero = True
                            res = 0.000

                res = "{:.3f}".format(res)
                if forced_res_to_zero :
                    listofTiRemoving.append(float(0.000))
                else:
                    listofTiRemoving.append(float(res))
                sumofTiRemoving += float(res)
            print('DEBUG:: list-solid_rawMat: {}'.format(listof_solid_rawMat))
            # old implementation
            # if listof_solid_rawMat:
            #     from operator import itemgetter
            #     index_of_max_rawMat = max(listof_solid_rawMat,key=itemgetter(1,2))[2]
            #     print('DEBUG:: max rawMat: {}'.format(max(listof_solid_rawMat,key=itemgetter(1,2))))
            #     current_value = listofTiRemoving[index_of_max_rawMat]
            #     new_value = float(current_value) + value_to_add_to_max_rawMat
            #     new_value = "{:.3f}".format(new_value)
            #     listofTiRemoving[index_of_max_rawMat] = new_value
            #     print('\tprev val: {} - adding {} to {} - current val: {}'.format(current_value, value_to_add_to_max_rawMat,  matrixTransposed[0][index_of_max_rawMat], new_value))

            # test 11/07/2019
            if listof_solid_rawMat:    
                def getKey(item):
                    return item[1]            
                print('listof_solid_rawMat: {}'.format(listof_solid_rawMat))
                sorted_list_by_diff =  sorted(listof_solid_rawMat, key=getKey, reverse=True)
                print('sorted_list_by_diff: {}'.format(sorted_list_by_diff))
                for sorted_v in sorted_list_by_diff:
                    if True in sorted_v:
                        print('FIND MAX RAW MAT - {}'.format(sorted_v))
                        current_value = listofTiRemoving[sorted_v[2]]
                        new_value = float(current_value) + value_to_add_to_max_rawMat
                        new_value = "{:.3f}".format(new_value)
                        listofTiRemoving[sorted_v[2]] = new_value
                        print('\tprev val: {} - adding {} to {} - current val: {}'.format(current_value, value_to_add_to_max_rawMat,  matrixTransposed[0][sorted_v[2]], new_value))
                        break

            if value_to_add_to_h2o > 0:
                prev_value_h2o = listofTiRemoving[0]
                current_value_h2o = float(prev_value_h2o) + float(value_to_add_to_h2o)
                listofTiRemoving[0] = current_value_h2o
                print('\tprev h2o val: {} - adding {} to h2o - current h2o val: {}'.format(prev_value_h2o, value_to_add_to_h2o, current_value_h2o))


            listofVV = []
            sumofVV = 0.000
            for k,v in enumerate(listofTiRemoving):
                operand1_vv = listofTiRemoving[k]
                res = (100 * float(operand1_vv)) / sumofTiRemoving
                res = "{:.3f}".format(res)
                res = float(res)

                if k == 2 or k == 4:
                    res = 0.000
                else:
                    # TODO: check for res <= 1
                    # print("starting check for res <= 1")
                    if res <= 1:
                        # print("TODO: check which value of VV insert  || res <= 1")
                        # print("RawMatName: {} || idx of res <= 1 : {} || matrixofVV : {}".format(listofRawMatNames[k], k, matrixofVV))

                        tmp_listof_vv_current_rawMat = []
                        for arr in matrixofVV:
                            # print("vv: {} of {}".format(arr[k], listofRawMatNames[k]))
                            tmp_listof_vv_current_rawMat.append(arr[k])

                        # print("\t_tmp_listof_vv_current_rawMat : {}".format(tmp_listof_vv_current_rawMat))

                        listof_vv_checks = []
                        for key,v in enumerate(tmp_listof_vv_current_rawMat):
                            calc = 0
                            margin = float(tmp_listof_vv_current_rawMat[0]) * 0.1
                            # print("key: {} | len {}".format(key, len(tmp_listof_vv_current_rawMat)))
                            if k < (len(tmp_listof_vv_current_rawMat) - 1):
                                # print('k: {}, len(tmp_listof_vv_current_rawMat): {}'.format(k, len(tmp_listof_vv_current_rawMat) - 1))
                                if key+1 <= k:
                                    calc = abs(float(tmp_listof_vv_current_rawMat[key]) - float(tmp_listof_vv_current_rawMat[key+1]))
                            else:
                                calc = abs(float(tmp_listof_vv_current_rawMat[key]) - float(tmp_listof_vv_current_rawMat[0]))

                            # print("calc : {} | margin: {}".format(calc, margin))
                            if calc < margin:
                                # print("1 - correct")
                                listof_vv_checks.append(1)
                            else:
                                # print("0 - uncorrect")
                                listof_vv_checks.append(0)
                            
                        print("\tlistof_vv_checks : {}".format(listof_vv_checks))
                        if(len(set(listof_vv_checks))== 1 and listof_vv_checks[0] == 1):
                            # rispetto base1-10% < VALUE x < base1+10%
                            print("All elements in list are same")
                            base1 = float(tmp_listof_vv_current_rawMat[0])
                            margin = 0.1
                            leftBound = base1 - (base1 * margin)
                            rightBound = base1 + (base1 * margin)
                            if res > leftBound and res < rightBound:
                                print("res > leftBound && res < rightBound  -> show calculated res: {} for {}".format(res, listofRawMatNames[k]))
                            else:
                                print("****   NO **** res > leftBound && res < rightBound")
                                # mostro contenuto vvB1 al posto del valore calcolato
                                print("vvB1 val calculated : {}".format(tmp_listof_vv_current_rawMat[k]))
                                res = tmp_listof_vv_current_rawMat[k]
                        else:
                            # non rispetto base1-10% < VALUE x < base1+10%
                            print("All elements in list are not same or all values are 0...save calculated res: {} for {}".format(res, listofRawMatNames[k]))
                listofVV.append(res)
                sumofVV += float(res)

            listof100ml = []
            sumof100ml = 0.000
            for k,v in enumerate(listofVV):
                operand1_g100mL = listofVV[k]
                operand2_g100mL = listofSpecificWeight[k]

                res = float(operand1_g100mL) * float(operand2_g100mL)
                res = "{:.3f}".format(res)
                res = float(res)

                listof100ml.append(res)
                sumof100ml += res    


            listofWW = []
            sumofWW = 0.000
            for k,v in enumerate(listof100ml):
                operand1_ww = listof100ml[k]
                operand2_ww = sumof100ml

                res = (float(operand1_ww) * 100 ) / float(operand2_ww)
                res = "{:.3f}".format(res)
                res = float(res)

                listofWW.append(res)
                sumofWW += res                  

            listofCost = []
            sumofCost = 0.000
            for k,v in enumerate(listofVV):
                operand1_cost = listofSpecificWeight[k]
                operand2_cost = listofRawMatCost[k]
                res = ((float(operand1_cost) * float(operand2_cost) * 10) / 1000 ) * listofVV[k]
                res = "{:.3f}".format(res)
                res = float(res)
                listofCost.append(res)
                sumofCost += res

            totalArrayMaster = ['Total', sumofTiRemoving, sumofVV, sumof100ml, sumofWW, sumofCost]

            masterMatrixTransposed = [listofRawMatNames,listofTiRemoving, listofVV, listof100ml, listofWW, listofCost]
            # global masterMatrix
            masterMatrix = [[masterMatrixTransposed[j][i] for j in range(len(masterMatrixTransposed))] for i in range(len(masterMatrixTransposed[0]))] 
            masterMatrix.extend([totalArrayMaster])
        
        # ! ~~ end of calculation
    # ! ~~ end of loop
    return masterMatrix