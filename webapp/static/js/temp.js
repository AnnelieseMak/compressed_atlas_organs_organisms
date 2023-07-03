let plotData = {}

let testList = {}
let traceDict = {}
// {
//  neutrophil: {normal: 0, cluster: 1},
//  basophil: {normal: 1, cluster: 4}
// }

const plotTemplate = () => {
    console.log('plot template')
    var trace1 = {
        x: [
          ['SF Zoo','SF Zoo','SF Zoo'],
          ['giraffes', 'orangutans', 'monaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaakeys']
        ],
        y: ['y1', 'y2', 'y3'],
        z: [[10,11,112], [13,14,15], [16,17,18]],
        visible: true,
        name: '',
        type: 'heatmap'
      };
      
      var trace2 = {
        x: [
          ['LA Zoo','LA Zoo','LA Zoo'],
          ['g', 'o', 'm'],
        ],
        y: ['y1', 'y2', 'y3'],
        z: [[0,1,2], [3,null,5], [6,7,8]],
        visible: true,
        name: '',
        type: 'heatmap'
      };

      var trace3 = {
        x: [
          ['AU Zoo','AU Zoo','AU Zoo'],
          ['a', 'b', 'c'],
        ],
        y: ['y1', 'y2', 'y3'],
        z: [[0,1,2], [3,7,5], [6,null,8]],
        visible: true,
        name: '',
        type: 'heatmap'
      };
      
      var data = [trace1, trace2, trace3];
    //   console.log(data)

      var layout = {
        showlegend: false,
        xaxis: {
          tickson: "boundaries",
          ticklen: 15,
          showdividers: true,
          dividercolor: 'grey',
          dividerwidth: 2,
          title: 'zoos',
          tickangle: 0,
        //   color: 'red'
        //   ticklabeloverflow: 'hide past domain'
        },
        yaxis: {
            autorange: "reversed",
        }
      };
      testList = {'SF Zoo':0, 'LA Zoo':1, 'AU Zoo':2}
      
      Plotly.newPlot('plotDiv', data, layout);
    //   clickable()
}

const myFunc = (elPos, tickLabel) => {
    console.log(elPos, tickLabel)
    const tv = document.getElementById('plotDiv')
    console.log(tv.data)
    let visibleCount = 0

    for (let i = 0; i < tv.data.length; i++) {
        const traceData = tv.data[i]
        console.log(traceData)
        console.log(traceData.visible)
        if (traceData.visible) {
            visibleCount++
        }
    }

    if (visibleCount == 1) {
        return
    }

    const ctListEl = document.getElementById('celltypeList')

    if (ctListEl.style.display == "none") {
        console.log('is none')
        ctListEl.style.display = "block"
    }

    const ctNameTemplate = document.getElementById('celltypeName-template')
    const newCT = ctNameTemplate.cloneNode(true)
    newCT.removeAttribute('id')
    newCT.style.display = "block"
    newCT.innerHTML = tickLabel
    newCT.onclick = function(){addBack(newCT, elPos)}

    ctListEl.appendChild(newCT)

    Plotly.restyle('plotDiv', {visible: false}, elPos)
    clickable()
}

const addBack = (el, elPos) => {
    el.remove()
    const ctListParent = document.getElementById('celltypeList')
    if (ctListParent.childElementCount == 1) {
        ctListParent.style.display = "none"
    }

    Plotly.restyle('plotDiv', {visible: true}, elPos)
    clickable()
}

const clickable = () => {
    const xTicks = document.getElementsByClassName('xtick2')
    // console.log(testList)

    // console.log(`xticks`)
    // console.log(xTicks)

    for (let i = 0; i < xTicks.length; i++) {
        const tickLabel = xTicks[i].children[0].innerHTML
        // console.log(testList[tickLabel])
        xTicks[i].onclick = function(){myFunc(testList[tickLabel], tickLabel)}
    }

}


/*****************************************************************************
 *                              USED METHODS
 *****************************************************************************/

const generatePlot = async () => {
    // console.log('generate plot')
    // traceDict = {}
    removeClones('celltypeList', 1)
    toggleCTList('close')
    
    const species = "mouse"
    // const species = getCheckedboxNames('.specOpt:checked')
    const tissues = getCheckedboxNames('.tisOpt:checked')
    // console.log(`tissue: ${tissues}\nspecies: ${species}`)

    // tissues.push('Colon')      // , 'Bone Marrow', 'Kidney','Pancreas', 'Tongue'

    const matchOpt = document.getElementById('drop-select').innerHTML
    // console.log(matchOpt)

    const searchInput = $("#searchOpt").val()

    const data = await getData(tissues, species, searchInput)
    // console.log(`data:\n${JSON.stringify(data)}`)
    // console.log(`data:\n${data}`)

    const firstTissue = data[Object.keys(data)[0]]
    const featNames = firstTissue.features[0]

    const allCellTypes = getAllCellTypes(data)
    // console.log(allCellTypes)
    // const traceData = new Array(allCellTypes.length)

    let traceData = []
    let maxVal = 0

    for (const [idx, cellType] of allCellTypes.entries()) {
        const [CTvals, maxV, tissueList] = getCellType_Tissue(data, cellType, featNames.length)
        // console.log(maxV)

        maxVal = Math.max(maxVal, maxV)
        const trace = {
            x: [
                Array(tissueList.length).fill(cellType),
                tissueList
            ],
            y: featNames,
            z: CTvals,
            zmin: 0,
            colorscale: 'Reds',
            type: 'heatmap',
            name: '',
            xgap: 3,
            ygap: 3,
            visible: true
        }
        
        if (matchOpt > tissueList.length) {
            continue
        }

        traceData.push(trace)
        traceDict[cellType] = idx
    }

    // sets zmax to overall max for shared scale
    for (const trace of traceData) {
        trace.zmax = maxVal
    }

    var layout = {
        showlegend: false,
        autosize: true,
        automargin: true,
        xaxis: {
            tickson: "boundaries",
            ticklen: 15,
            showdividers: true,
            dividercolor: 'grey',
            dividerwidth: 2,
            // tickangle: 0,
        },
        yaxis: {
            autorange: "reversed",
        }
    };

    Plotly.newPlot('plotDiv', traceData, layout);
    makeXClickable()
    updateFilters(featNames, matchOpt)
}

// return list of unique celltype names
const getAllCellTypes = (data) => {
    let allCellTypes = []

    for (const [key, value] of Object.entries(data)) {
        allCellTypes.push(...value.celltypes)
    }

    allCellTypes = [...new Set(allCellTypes)]

    return allCellTypes
}

/*********************
        GET CELL TYPE DATA OF EACH TISSUE
*********************/
const getCellType_Tissue = (data, cellType, featuresCount) => {
    // console.log('\t\t\t\t\t\t\t\tFUNCTION: getCellType_Tissue')
    const CTcols = [...Array(featuresCount)].map(e => Array(1));
    let tissueList = []
    let colNo = 0
    
    for (const [key, value] of Object.entries(data)) {
        // console.log(colNo, key)
        // console.log(idx, key, value)
        const tissueCT = value.celltypes
        const CTval = tissueCT.indexOf(cellType)

        if (CTval != -1) {
            const tissueData = value.data[0]
            // console.log(`tissueData: ${JSON.stringify(tissueData)}`)
            // console.log(`${key} data at ${CTval}: ${tissueData[0][CTval]}`)
            for (let i = 0; i < featuresCount; i++) {
                // console.log(`[${i}][${CTval}]: ${tissueData[i][CTval]}`)
                CTcols[i][colNo] = tissueData[i][CTval]
            }
            tissueList.push(key)
            colNo++
        }
    }

    // console.log(CTcols.flat())

    return [CTcols, Math.max(...CTcols.flat()), tissueList]
}

/*****************************************************************************
 *                              GENERAL HELPER
 *****************************************************************************/

const removeClones = (loc, length) => {
    const location = document.getElementById(loc);
    while(location.children.length > length) {
        location.removeChild(location.lastChild);
    }
}

const getCheckedboxNames = (loc) => {
    const checked = Array.from(document.querySelectorAll(loc))

    for (const [idx, el] of checked.entries()) {
        checked[idx] = el.value
    }
    return checked
}

/*****************************************************************************
 *                            INTERFACE METHODS
 *****************************************************************************/
const collapsePlot = (tracePos, tickLabel) => {
    console.log(`collapse plot: ${tracePos}, ${tickLabel}`)
    const traces = document.getElementById('plotDiv').data
    console.log(traces)
    let visibleCount = 0

    for (const trace of traces) {
        if (trace.visible) {
            visibleCount++
        }
    }

    if (visibleCount == 1) {
        return
    }

    toggleCTList('open')

    const CTList = document.getElementById('celltypeList')
    const template = document.getElementById('celltypeName-template')
    const newItem = template.cloneNode(true)
    newItem.removeAttribute('id')
    newItem.style.display = 'block'
    newItem.innerHTML = tickLabel
    newItem.onclick = function() {addToPlot(newItem, tracePos)}
    CTList.append(newItem)

    Plotly.restyle('plotDiv', {visible: false}, tracePos)
    makeXClickable()

}

const addToPlot = (ele, tracePos) =>{
    ele.remove()
    toggleCTList('close')
    Plotly.restyle('plotDiv', {visible: true}, tracePos)
    makeXClickable()
}

const makeXClickable = () => {
    const xTicks = document.getElementsByClassName('xtick2')

    for (const tick of xTicks) {
        const tickLabel = tick.children[0].innerHTML
        tick.onclick = function(){collapsePlot(traceDict[tickLabel], tickLabel)}
    }
}

const toggleCTList = (action) => {
    const CTList = document.getElementById('celltypeList')
    if (action == 'close' && CTList.childElementCount == 1) {
        CTList.classList.remove('active')
    } else if (action == 'open' && !CTList.classList.contains('active')) {
        CTList.classList.add('active')
    }
}

const toggleNumMatchedDrop = (ele) => {
    console.log('toggle menu')
    ele.classList.toggle('active')
}

const updateNumMatchedOptions = (ele) => {
    if (!ele.checked) {
        removeNumMatchedOption()
    } else {
        addNumMatchedOption()
    }
}

const removeNumMatchedOption = () => {
    const optionParent = document.getElementById('drop-options')
    optionParent.removeChild(optionParent.lastChild)
    const dropSelect = document.getElementById('drop-select')
    if (!isNaN(dropSelect.innerHTML) && dropSelect.innerHTML > optionParent.lastChild.innerHTML) {
        dropSelect.innerHTML = optionParent.lastChild.innerHTML
    }
}

const addNumMatchedOption = () => {
    console.log('add child')
    const optionParent = document.getElementById('drop-options')
    const childCount = optionParent.childElementCount
    const optionTemplate = document.getElementById('dropOp-template')
    const newOption = optionTemplate.cloneNode(true)
    newOption.removeAttribute("id")
    newOption.innerHTML = `${childCount}`
    newOption.onclick = function() {
        document.getElementById('drop-select').innerHTML = `${childCount}`
    }

    optionParent.appendChild(newOption)
}

const updateFilters = (featNames, matchOpt) => {
    // search bar
    const searchBar = document.getElementById('searchOpt')
    searchBar.value = featNames

    //number of matches
    const dropSelect = document.getElementById('drop-select')
    if (isNaN(matchOpt)) {
        addNumMatchedOption()
        dropSelect.innerHTML = 1
    }

    // tissue
    const lungCB = document.getElementById('tisOpt-Lung')
    lungCB.checked = true

    // species
}


/*****************************************************************************
 *                                API CALLS
 *****************************************************************************/

// inputs:
// '/data/by_celltype'
//      feature_names
//      species
//      tissue

const apiCall = (requestData) => {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: 'GET',
            url: '/data/by_celltype',
            data: $.param(requestData),
            success: function(result) {
                // console.log(result)
                resolve(result)
            }
        })
    })
}

const getData = async (tissues, species, feature_names) => {
    // console.log(`tissue: ${tissues}\nspecies: ${species}\nfeature_names: ${feature_names}`)

    if (tissues.length == 0) {
        tissues = ["Lung"]
    }

    if (!feature_names) {
        feature_names = "Actc1,Actn2,Myl2,Myh7,Col1a1,Col2a1,Pdgfrb,Pecam1,Gja5,Vwf,Ptprc,Ms4a1,Gzma,Cd3d,Cd68,Epcam"
    }
    let data = {}

    for (const tissue of tissues) {
        const reqData = {
            feature_names,
            species,
            tissue
        }
        // console.log(reqData)
        const retVal = await apiCall(reqData)
        data[tissue] = retVal
        // console.log(data)
    }

    return data
}

/*****************************************************************************
 *                                INTERACTIONS
 *****************************************************************************/

//temp plot button
$("#plotBtn").click(plotTemplate)

$("#pBtn").click(generatePlot)

// update number matched dropdown options
$(".tisOpt").click(function() {updateNumMatchedOptions(this)})

// toggle dropdown menu
$(".dropdown").click(function () {toggleNumMatchedDrop(this)})

// on page load
$(document).ready(function() {
    console.log('page load');
    plotTemplate()
});


/*****************************************************************************
 *                             TEST INTERACTIONS
 *****************************************************************************/

const testFunc = () => {
    const searchInput = $('#searchOpt').val()
    console.log(searchInput)
}

$("#testBtn").click(testFunc)

// const closeDropdown = (e) => {
//     // console.log('close')
//     const dropdown = document.getElementsByClassName('dropdown')[0]
//     // console.log(e.target)
//     if (dropdown != (e.target).parentElement && dropdown.classList.contains('active')) {
//         dropdown.classList.toggle('active')
//     }
//     // console.log(dropdown)
// }

// $(document).click(function(e) {closeDropdown(e)})





/*****************************************************************************
 *                             RANDOM NOTES
 *****************************************************************************/

// EACH TRACE IS FOR 1 CELL TYPE
// trace
//  x:
//      x1: cell type   -->     [ct1, ct1]
//      x2: tissue      -->     [lung, heart]
//  y:  genes           -->     [g1, g2, g3]
//  z:  values

// var trace = {
//     x: [
//         []
//     ],
//     // y: ,
//     // z: ,
//     type: 'heatmap'
// }
