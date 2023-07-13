let plotData = {
    traces: [],
    order: {
        x: {hierarchical: [], normal: []},
        y: {hierarchical: [], normal: []}
    }
}
/* 
{
    traces: []
    order: {
        x: {hierarchical: [], normal: []},
        y: {hierarchical: [], normal: []}
    }
}
*/
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
        // xaxis: 'x',
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
        z: [[0,1,2], [3,1,5], [6,7,8]],
        // xaxis: 'x2',
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
        z: [[0,1,2], [3,7,5], [6,0,8]],
        // xaxis: 'x3',
        visible: true,
        name: '',
        type: 'heatmap'
      };
      
      var data = [trace1, trace2, trace3];
        var data2 = [trace1, trace3, trace2]
      console.log(data)
      console.log(data2)

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
        },
        annotations: [
        {
            x: 0,
            y: -0.25,
            // xref: 'x',
            yref: 'paper',
            text: 'x0',
            showarrow: false,
        },
        {
            x: 1,
            y: -0.25,
            // xref: 'x',
            yref: 'paper',
            text: 'x1',
            showarrow: false,
        },
        {
            x: 2,
            y: -0.25,
            // xref: 'x',
            yref: 'paper',
            text: 'x2',
            showarrow: false, 
        },
        {
            x: 3,
            y: -0.25,
            // xref: 'x',
            yref: 'paper',
            text: 'x3s',
            showarrow: false,
        },
        {
            x: 4,
            y: -0.25,
            // xref: 'x',
            yref: 'paper',
            text: 'x: 4',
            showarrow: false,
        }
        ]
      };
      testList = {'SF Zoo':0, 'LA Zoo':1, 'AU Zoo':2}

    //   annotations: class="annotations"

    //   for (let i = 0; i < quarter_names.length; i++) {
    //     text_annotations.push(
    //       {
    //         x: quarter_positions[i],
    //         y: -0.15,
    //         xref: 'paper',
    //         yref: 'paper',
    //         text: quarter_names[i],
    //         showarrow: false,
    //       }
    //     )
    //   }

    //   https://stackoverflow.com/questions/69874927/multiple-x-axis-in-plotly-timeseries
      
      Plotly.newPlot('plotDiv', data, layout);
    //   clickable()

    // const t = document.getElementsByClassName('annotation')
    const t = document.getElementsByClassName('xtick2')
    console.log(t)
    for (let i = 0;i < t.length; i++) {
        // console.log(t[i])
        t[i].onclick = function(){myFunc(i, t)}
    }
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
    traceDict = {}
    removeClones('celltypeList', 1)
    toggleCTList('close')
    
    const species = "mouse"
    // const species = getCheckedboxNames('.specOpt:checked')
    const tissues = getCheckedboxNames('.tisOpt:checked')
    console.log(`tissue: ${tissues}\nspecies: ${species}`)

    const matchOpt = document.getElementById('drop-select').innerHTML
    // const matchOpt = 2

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

        if (matchOpt > tissueList.length) {
            continue
        }

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
        
        traceData.push(trace)
        traceDict[cellType] = Object.keys(traceDict).length
    }

    // sets zmax to overall max for shared scale
    for (const trace of traceData) {
        trace.zmax = maxVal
    }

    plotData.traces = traceData
    const ret = getHierarchyOrder()
    // plotData["xOrder"] = 
    // plotData["yOrder"] = 

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

    // console.log('trace data:')
    // console.log(traceData)

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

// GET CELL TYPE DATA OF EACH TISSUE
const getCellType_Tissue = (data, cellType, featuresCount) => {
    // console.log('\t\t\t\t\t\t\t\tFUNCTION: getCellType_Tissue')
    // console.log(data)
    const CTcols = [...Array(featuresCount)].map(e => Array(1));
    let tissueList = []
    let colNo = 0
    
    for (const [key, value] of Object.entries(data)) {
        // console.log(colNo, key)
        // console.log(key, value)
        const tissueCT = value.celltypes
        const CTidx = tissueCT.indexOf(cellType)

        if (CTidx != -1) {
            const tissueData = value.data[0]
            // console.log(`tissueData: ${JSON.stringify(tissueData)}`)
            // console.log(`${key} data at ${CTidx}: ${tissueData[0][CTidx]}`)
            for (let i = 0; i < featuresCount; i++) {
                // console.log(`[${i}][${CTidx}]: ${tissueData[i][CTidx]}`)
                CTcols[i][colNo] = tissueData[i][CTidx]
            }
            tissueList.push(key)
            colNo++
        }
    }

    // console.log(CTcols.flat())s

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
    // console.log(xTicks)

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
    // console.log('add child')
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

const apiCall = (requestData, path) => {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: 'GET',
            url: path,
            // data: $.param(requestData),
            data: requestData,
            success: function(result) {
                // console.log(result)
                resolve(result)
            }
        })
    })
}

const getData = async (tissues, species, feature_names) => {

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
        const retVal = await apiCall(reqData, '/data/by_celltype')
        data[tissue] = retVal
        // console.log(data)
    }

    return data
}

const plotHier = () => {
    console.log(traceDict)
    // const tt = [...Array((test.xOrder).length).keys()]
    // console.log(tt)
    // console.log(test.xOrder)
    // Plotly.moveTraces('plotDiv', test.xOrder)
    // Plotly.moveTraces('plotDiv', [0])
}

const getHierarchyOrder = async () => {
    console.log(plotData.traces)

    const zValues = []
    for (const zVal of plotData.traces) {
        zValues.push(zVal.z)
    }

    const reqData = {
        data: zValues,
    }
    console.log(`reqData`)
    console.log(reqData)
    const hierOrders = await apiCall(JSON.stringify(reqData), '/data/getHierarchy')
    console.log(hierOrders)
    plotData.order.x.hierarchical = hierOrders.xOrder
    plotData.order.y.hierarchical = hierOrders.yOrder

    // plotData["orders"]["hierarchical"] = hierOrders

    // for (const [idx, z] of zValues.entries()) {
    //     console.log(`idx: ${idx}\t z: ${z}`)
    // }

    // for (const [idx, z] of zValues.entries()) {
    //     console.log(z)
    //     const hOrdered = []
    //     const yAxis = []
    //     for (const yV of retVal.yOrder) {
    //         hOrdered.push(z[yV])
    //         yAxis.push(currY[yV])
    //     }
    //     zValues[idx] = hOrdered
    //     yValues.push(yAxis)
    // }

    // console.log(zValues)
    // console.log(yValues)

    // const update = {y: yValues, z: zValues}
    // Plotly.restyle('plotDiv', update, [0, 1, 2])
    // Plotly.moveTraces('plotDiv',[0,1,2], retVal.xOrder)

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
    // plotTemplate()
    // generatePlot()
});


/*****************************************************************************
 *                             TEST INTERACTIONS
 *****************************************************************************/

const apiCall2 = (requestData) => {
    var array = {data: requestData}

    return new Promise((resolve, reject) => {
        $.ajax({
            type: 'GET',
            url: '/data/getHierarchy',
            // data: JSON.stringify(array2),
            data: JSON.stringify(array),
            // data: requestData,
            success: function(response) {
                resolve(response)
            }
        });
    })
}

const testFunc = async () => {
    const t = plotData.traces
    console.log(t)
    const zValues = []
    console.log(t.length)
    for(const tt of t) {
        zValues.push(tt.z)
    }
    const currY = t[0].y
    console.log(`yVals: ${currY}`)
    console.log(`yVals length: ${currY.length}`)
    console.log(`yVals: ${currY[0]}`)

    const retVal = await apiCall2(zValues)
    console.log(`zValues:`)
    console.log(retVal)
    console.log(zValues)

    const yValues = []

    

    for (const [idx, z] of zValues.entries()) {
        console.log(z)
        const hOrdered = []
        const yAxis = []
        for (const yV of retVal.yOrder) {
            hOrdered.push(z[yV])
            yAxis.push(currY[yV])
        }
        zValues[idx] = hOrdered
        yValues.push(yAxis)
    }

    console.log(zValues)
    console.log(yValues)

    const update = {y: yValues, z: zValues}
    Plotly.restyle('plotDiv', update, [0, 1, 2])
    Plotly.moveTraces('plotDiv',[0,1,2], retVal.xOrder)

    //////////////////////////////////////////////////////////////////////////////
    // const testV = [[[0,1],[3,4],[9,8]], [[11,7],[5,1],[5,5]], [[8,4],[6,8],[9,8]]]
    // console.log(testV)

    // // new order: 1,2,0
    // const newOrder = [1,2,0]

    // for (let i = 0; i < testV.length; i++) {
    //     let currZ = testV[i]
    //     // console.log(currZ)
    //     const newV = []
    //     for (let i = 0; i < newOrder.length; i++) {
    //         // console.log(newOrder[i])
    //         newV.push(currZ[newOrder[i]])
    //     }
    //     // console.log(newV)
    //     testV[i] = newV
    // }

    // console.log(testV)

    // https://plotly.com/javascript/plotlyjs-function-reference/?_ga=2.3300214.73196253.1688987035-2104928824.1688987035#plotlymovetraces

}

const testA = () => {
    console.log(traceDict)
    console.log(plotData)
}

// $("#testBtn").click(plotHier)
$("#testBtn").click(testA)
// $("#testBtn").click(getHierarchyOrder)

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
