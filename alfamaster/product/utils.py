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
    thead2ndRow = ['Raw material', 'Specific weight [g/mL]', 'RM cost']
    theadBase = ['%w/w','mL/100g', '%v/v', 'mL/1000g']
    formulaCost = 'Formula Cost ['+currency+']'
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

    numofRawMat = len(matrixFormula)
    # print("numofRawMat -> {}".format(numofRawMat))

    for array in matrixFormula:
        swArray.append(array[1])
        rmcostArray.append(array[2])

    for i in range(nbases):
        sumofMl100g = 0.0
        sumofVv = 0.0
        sumofMl1000g = 0.0
        sumofFcost = 0.0
        sumofWW = 0.0

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
            index = i*5
            operand1_fcost = swArray[idx]
            operand2_fcost = rmcostArray[idx]
            operand3_fcost = vvArray[idx+index]
            _fcost = ((float(operand1_fcost)*float(operand2_fcost))/1000)*(float(operand3_fcost))
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
        print("::::::::")

    matrixCalculatedValues = [ml100gArray, vvArray, ml1000gArray, fcostArray]
    matrixCalculatedValuesTransposed = [[matrixCalculatedValues[j][i]
                                        for j in
                                        range(len(matrixCalculatedValues))]
                                        for i in
                                        range(len(matrixCalculatedValues[0]))]

    print("matrixCalculatedValues:\n{}".format(matrixCalculatedValues))
    print("matrixCalculatedValuesTransposed:\n{}".format(matrixCalculatedValuesTransposed))


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
    for n in range(numofRawMat):
        if n > 0:
            tmp = []
            for k,v in enumerate(listofIndex):
                if k < 3:
                    value = listofIndex[k]
                    value += n                    
                    tmp.append(value)

            listofIndex.extend(tmp)


    # ! ~~ create empty matrix containter
    '''
        eg matrix
        [
            [],
            [],
            [],
            [],
            []
        ]
    '''
    emptyMatrixContainer = []
    for i in range(numofRawMat):
        tmp = []
        emptyMatrixContainer.append(tmp)

    # ! ~~ populate empty matrix with values
    '''
        eg matrix
        [
            ['25.000', '44.117', '441.170', '0.000', '5.000', '12.500', '125.000', '0.000', '0.000', '0.000', '0.000', '0.000'],
            ['20.000', '35.294', '352.940', '0.141', '10.000', '25.000', '250.000', '0.100', '0.500', '100.000', '1000.000', '0.400'],
            ['11.667', '20.589', '205.890', '0.191', '25.000', '62.500', '625.000', '0.581', '0.000', '0.000', '0.000', '0.000'],
            ['0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000'],
            ['0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000', '0.000']
        ]
    '''
    counter = 0
    for i in range(numofRawMat):
        idx = i + (2*i)
        for k,v in enumerate(listofIndex):
            if idx == 0:
                if k < nbases:
                    emptyMatrixContainer[i].extend(matrixCalculatedValuesTransposed[v])
            elif k>=idx and k < (idx + nbases ) :
                emptyMatrixContainer[i].extend(matrixCalculatedValuesTransposed[v])


    # ! ~~ substitute None with specific values from matrix
    '''
        eg starting matrix
        [
            ['25.000', None, None, None, '5.000', None, None, None, '0.000', None, None, None],
            ...
        ]

        eg matrix after substitution
        [
            ['25.000', '44.117', '441.170', '0.000', '5.000', '12.500', '125.000', '0.000', '0.000', '0.000', '0.000', '0.000'],
            ...
        ]
    '''
    for idx, array in enumerate(matrixFormula):
        counter = 0
        for v in array:
            if v is None:
                idxNone = array.index(v)
                # print("spotted a None at index : {}".format(idxNone))
                # print("specific value -> {}".format(matrix[idx].pop(0)))
                array[idxNone] = emptyMatrixContainer[idx].pop(0)

    return matrixFormula

def populateFormulaFooter(tfooter):
    innerTotalArray = totalArray
    for v in tfooter:
        if v is None:
            idxNone = tfooter.index(v)
            tfooter[idxNone] = float(innerTotalArray.pop(0))

def calculateFillToHtml(lista):
    listofFillCalculated = []

    operand1 = lista[4][5]
    operand2 = lista[4][10]
    value1 = round((float(operand1) * 100) / float(operand2))
    value2 = 100 - value1
    value3 = value2

    return listofFillCalculated

def calculateMasterToHtml(lista, listofFillvl, nbases):

    defLvl = listofFillvl[2]
    print("defLvl : {}".format(defLvl))
    _lista = lista[2:-1]    # no op on header and footer arrays
    matrixTransposed = [[_lista[j][i] for j in range(len(_lista))] for i in range(len(_lista[0]))] 

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
            for k,v in enumerate(listofBase1VV):
                res = 0.000
                if k != 2 and k != 4 :
                    res = (float(listofBase1VV[k]) - float(listofTiVV[k])*((100-defLvl)/100))/(defLvl/100)

                    # TODO: add check for solid raw material
                    if k > 4:
                        print("TODO: check for solid raw material")

                res = "{:.3f}".format(res)
                listofTiRemoving.append(float(res))
                sumofTiRemoving += float(res)
            
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
                    if res <= 1:
                        print("TODO: check which value of VV insert")

                listofVV.append(res)
                sumofVV += res

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
            global masterMatrix
            masterMatrix = [[masterMatrixTransposed[j][i] for j in range(len(masterMatrixTransposed))] for i in range(len(masterMatrixTransposed[0]))] 
            masterMatrix.extend([totalArrayMaster])

            # ! ~~ testing print
            # print("******\listofTiRemoving : {}".format(listofTiRemoving))
            # print("******\sumofTiRemoving : {}".format(sumofTiRemoving))
            # print("******\listofVV : {}".format(listofVV))
            # print("******\sumofVV : {}".format(sumofVV))
            # print("******\listof100ml : {}".format(listof100ml))
            # print("******\sumof100ml : {}".format(sumof100ml))
            # print("******\listofWW : {}".format(listofWW))
            # print("******\sumofWW : {}".format(sumofWW))
            # print("******\listofCost : {}".format(listofCost))
            # print("******\sumofCost : {}".format(sumofCost))
            # print("\n masterMatrix:\n{}".format(masterMatrix))

        
        # ! ~~ end of calculation
    # ! ~~ end of loop
    return masterMatrix