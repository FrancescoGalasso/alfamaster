$( document ).ready(function() {
    console.log("il documento è ready!")
    setClassesForCalculation()
    generateDataForDetail()
});

/**
 * 
 * Parse each cells of the TBody and TFooter starting from 2nd child and put the correct ClassName to them.
 * The ClassName basic is ['ww','ml100g', 'vv' , 'ml1000g' , 'fcost']
 * to it are added the suffixes corresponding to the bases created (e.g. ["_b1", "_ti", "_b2", ...])
 */
function setClassesForCalculation() {

    var listClassNameBase = ['sw', 'rm_cost']
    var generatedSuffixByClassesNum = generateBaseClassName()
    var basicBaseClassName = ['ww','ml100g', 'vv' , 'ml1000g' , 'fcost']
    var listClassNameFinal = []
    for (var i=0; i<generatedSuffixByClassesNum.length; i++) {
        for (var k=0; k<basicBaseClassName.length; k++) {
            var tmp = basicBaseClassName[k] + generatedSuffixByClassesNum[i]
            listClassNameFinal.push(tmp)
        }
    }

    listClassNameBase.push(...listClassNameFinal)

    // td_counter for details
    // if (td_counter == 0) {
    //     td_counter = $("table > tbody > tr:first > td").length
    // }

    td_counter = $("#main-dashboard-inner-detailpage-table-bases > tbody > tr:first > td").length

    for (var j=2; j < td_counter+1; j++) {
        $('#main-dashboard-inner-detailpage-table-bases tbody tr td:nth-child('+j+')').addClass(listClassNameBase[j-2]);
    }
}

function generateBaseClassName() {
    var baseClassName = ['_b1', '_ti', '_b2']
    if(bases_num == 3 ) {
        return baseClassName
    } else if (bases_num > 3) {
        for (var i = 3; i < bases_num; i++) {
            var value = parseInt(i)
            var _baseClassName = '_b'+value
            baseClassName.push(_baseClassName)
        }
        return baseClassName
    } else { // used on product update (for testing)
        return baseClassName
    }
}

function generateDataForDetail() {
    var counterWeightClassName = 2
    var baseClassName = generateBaseClassName()
    for (var q=0; q< baseClassName.length; q++) {
        sum_ml100g = 0
        sum_vv = 0
        sum_ml1000g = 0
        sum_fcost = 0

            // insert sum of data for cell Total ww
        tmp = document.getElementsByClassName('totalww'+baseClassName[q])[0]
        // dynamic refactor
        if(q < numofWeightClassNames){
            var tmp_value = list_sum[counterWeightClassName]
            var value = parseFloat(tmp_value).toFixed(2)
            tmp.innerHTML = value
            counterWeightClassName ++
        }


            // insert single data for the cell mL/100g
        for (var i = 0; i < global_num_raw_material; i++){
            tmp = document.getElementsByClassName('ml100g'+baseClassName[q])[i]
            var a = matrixWeightInput[q][i]
            var b = sw[i]
            var division = a/b
            var op = parseFloat(division).toFixed(3)
            tmp.innerHTML = op
            sum_ml100g += parseFloat(op)
        }

            // insert sum of data for cell Total mL/100g
        tmp = document.getElementsByClassName('totalml100g'+baseClassName[q])[0]
        tmp.innerHTML = parseFloat(sum_ml100g).toFixed(2)

            // insert single data for the cell %v/v
        for (var i = 0; i < global_num_raw_material; i++){
            var tmp = document.getElementsByClassName('vv'+baseClassName[q])[i]

            var elems = document.getElementsByClassName("ml100g"+baseClassName[q]);

            var elem = elems[i].innerText
            var op = (100*elem)/sum_ml100g
            var _op = parseFloat(op).toFixed(3)
            tmp.innerHTML = _op
            sum_vv += parseFloat(_op)
        }

            // insert sum of data for cell Total %v/v
        tmp = document.getElementsByClassName('totalvv'+baseClassName[q])[0]
        tmp.innerHTML = parseFloat(sum_vv).toFixed(2)

            // insert single data for the cell mL/1000g
        for (var i = 0; i < global_num_raw_material; i++){
            var tmp = document.getElementsByClassName('ml1000g'+baseClassName[q])[i]

            var elems = document.getElementsByClassName("vv"+baseClassName[q]);

            var elem = elems[i].innerText
            var op = (10*elem)
            var _op = parseFloat(op).toFixed(2)
            tmp.innerHTML = _op
            sum_ml1000g += parseFloat(_op)
        }

            // insert sum of data for cell Total mL/1000g
        tmp = document.getElementsByClassName('totalml1000g'+baseClassName[q])[0]
        tmp.innerHTML = parseFloat(sum_ml1000g).toFixed(0)

            // insert single data for the cell Formula Cost
        for (var i = 0; i < global_num_raw_material; i++){
            var tmp = document.getElementsByClassName('fcost'+baseClassName[q])[i]

            var elems_sw = document.getElementsByClassName("sw")
            var elems_rmcost = document.getElementsByClassName("rm_cost")
            var elems_vv = document.getElementsByClassName("vv"+baseClassName[q])


            var elem_vv = elems_vv[i].innerText
            var elem_sw = elems_sw[i].innerText
            var elem_rmcost = elems_rmcost[i].innerText 

            var op1 = elem_sw*elem_rmcost
            var _op = (parseFloat(op1)/1000)*elem_vv*10
            tmp.innerHTML = parseFloat(_op).toFixed(2)
            sum_fcost += parseFloat(_op)
        }

            // insert sum of data for cell Total Formula Cost
        tmp = document.getElementsByClassName('totalfcost'+baseClassName[q])[0]
        tmp.innerHTML = parseFloat(sum_fcost).toFixed(2)
    }
}