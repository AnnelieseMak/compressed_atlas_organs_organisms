let axisOrders = {
    current: {x: [], y: []},
    normal: {x: [], y: []},
    hierarchical: {x: [], y: []}
}

let testList = {}

const plotTemplate = () => {
    console.log('plot template')
    var trace1 = {
        x: [
          ['SF Zoo','SF Zoo','SF Zoo'],
        //   [' ',' ',' '],
          ['giraffes', 'orangutans', 'monaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaakeys']
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
        //   ['  ','  ','  '],
          ['g', 'o', 'm'],
        ],
        y: ['y1', 'y2', 'y3'],
        z: [[0,1,2], [3,1,5], [6,7,8]],
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
        visible: true,
        name: '',
        type: 'heatmap'
      };
      
      var data = [trace1, trace2, trace3];
        var data2 = [trace1, trace3, trace2]
      console.log(data)
      console.log(data2)

      var layout = {
        height: 750,
        // autosize: true,
        // margin: {
        //     automargin: true,
        // },
        paper_bgcolor:'#ff0000', 
        showlegend: false,
        xaxis: {
          tickson: "boundaries",
          ticklen: 15,
          showdividers: true,
          dividercolor: 'grey',
          dividerwidth: 2,
          title: 'zoos',
          tickangle: 90,
          automargin: true,
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
            yref: 'paper',
            text: 'x0',
            showarrow: false,
        },
        {
            x: 1,
            y: -0.25,
            yref: 'paper',
            text: 'xxxxxxxxxxxxxxxxxxxxx1',
            showarrow: false,
            textangle: -90
        },
        {
            x: 2,
            y: -0.25,
            yref: 'paper',
            text: 'x2',
            showarrow: false, 
        },
        {
            x: 3,
            y: -0.25,
            yref: 'paper',
            text: 'x3s',
            showarrow: false,
        },
        {
            x: 4,
            y: -0.25,
            yref: 'paper',
            text: 'x: 4',
            showarrow: false,
            // textangle: -90
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
    // const t = document.getElementsByClassName('xtick2')
    // console.log(t)
    // for (let i = 0;i < t.length; i++) {
    //     // console.log(t[i])
    //     t[i].onclick = function(){myFunc(i, t)}
    // }
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
    removeClones('celltypeList', 1)
    toggleCTList('close')
    
    const species = "mouse"
    // const species = getCheckedboxNames('.specOpt:checked')
    const tissues = getCheckedboxNames('.tisOpt:checked')
    console.log(`tissue: ${tissues}\nspecies: ${species}`)

    const matchOpt = document.getElementById('drop-select').innerHTML
    // const matchOpt = 2

    const searchInput = $("#searchOpt").val()
    // console.log(searchInput)

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
    let traceOrder = []

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
        traceOrder.push(cellType)
    }

    axisOrders.current.x = axisOrders.normal.x = traceOrder
    axisOrders.current.y = axisOrders.normal.y = featNames

    // sets zmax to overall max for shared scale
    for (const trace of traceData) {
        trace.zmax = maxVal
    }
    // console.log(traceData)
    getHierarchyOrder(traceData)
    // getAnnotations(traceData)
    // console.log('after hier')

    var layout = {
        showlegend: false,
        autosize: true,
        automargin: true,
        margin: {
            autoexpand: true,
        },
        xaxis: {
            tickson: "boundaries",
            ticklen: 15,
            showdividers: true,
            dividercolor: 'grey',
            dividerwidth: 2,
            tickangle: 90,
            tickfont: {
                size: 10
            },
            // ticklabeloverflow: "hide past div",
        },
        yaxis: {
            autorange: "reversed",
        },
        // annotations: [
        //     {
        //         x: 0,
        //         y: -0.25,
        //         yref: 'paper',
        //         text: '1',
        //         showarrow: false,
        //     },
        //     {
        //         x: 1,
        //         y: -0.25,
        //         yref: 'paper',
        //         text: '2',
        //         showarrow: false,
        //         // textangle: -90
        //     },
        // ]
    };

    Plotly.newPlot('plotDiv', traceData, layout);
    makeXClickable()
    updateFilters(featNames, matchOpt)
}

const getAnnotations = (traceData) => {
    console.log(traceData)
    const annotations = []
    for (const [idx, trace] of traceData.entries()) {
        console.log(idx, trace.x[0][0])
        annotations.push({
            x: idx,
            y: -0.3,
            yref: 'paper',
            text: trace.x[0][0],
            showarrow: false
        })
    }
    console.log(annotations)
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

// get celltype data of each tissue
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

const changePlotView = (view) => {
    if (JSON.stringify(axisOrders.current) == JSON.stringify(axisOrders[view])) {
        return
    }
    const [yAxis, zVal] = configureYAxis(view)
    const xAxis = configureXAxis(view)

    Plotly.restyle('plotDiv', {y: yAxis, z: zVal}, [...Array(zVal.length).keys()])
    Plotly.moveTraces('plotDiv', xAxis)
    makeXClickable()
}

const configureXAxis = (view) => {
    let oldOrder = view == 'normal' ? axisOrders.hierarchical.x : axisOrders.normal.x
    let newOrder = view == 'normal' ? axisOrders.normal.x : axisOrders.hierarchical.x

    const newXAxis = []
    for (const value of newOrder) {
        newXAxis.push(oldOrder.indexOf(value))
    }
    axisOrders.current.x = newOrder

    return newXAxis
}

const configureYAxis = (view) => {
    const plotTraces = document.getElementById('plotDiv').data
    const zValues = []
    for (const zVal of plotTraces) {
        zValues.push(zVal.z)
    }

    let oldOrder = view == 'normal' ? axisOrders.hierarchical.y : axisOrders.normal.y
    let newOrder = view == 'normal' ? axisOrders.normal.y : axisOrders.hierarchical.y

    const yValues = Array(zValues.length).fill(newOrder)

    for (const [idx, z] of zValues.entries()) {
        const newZOrder = []
        for (const yName of newOrder) {
            newZOrder.push(z[oldOrder.indexOf(yName)])
        }
        zValues[idx] = newZOrder
    }
    axisOrders.current.y = newOrder

    return [yValues, zValues]
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
    const traces = document.getElementById('plotDiv').data
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
    newItem.onclick = function() {addToPlot(newItem, tickLabel)}
    CTList.append(newItem)

    Plotly.restyle('plotDiv', {visible: false}, tracePos)
    makeXClickable()
}

const addToPlot = (ele, traceName) =>{
    ele.remove()
    toggleCTList('close')
    const tracePos = axisOrders.current.x.indexOf(traceName)
    Plotly.restyle('plotDiv', {visible: true}, tracePos)
    makeXClickable()
}

const makeXClickable = () => {
    const xTicks = document.getElementsByClassName('xtick2')

    for (const tick of xTicks) {
        const tickLabel = tick.children[0].innerHTML
        const tracePos = axisOrders.current.x.indexOf(tickLabel)
        tick.onclick = function(){collapsePlot(tracePos, tickLabel)}
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
        dropSelect.innerHTML = 1
    }

    // tissue
    const checkedTissueCount = document.querySelectorAll('.tisOpt:checked').length
    if (checkedTissueCount == 0) {
        const lungCB = document.getElementById('tisOpt-Lung')
        lungCB.checked = true
        addNumMatchedOption()
    }

    // species
}


/*****************************************************************************
 *                                API CALLS
 *****************************************************************************/

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

const getHierarchyOrder = async (traces) => {
    const zValues = []
    for (const zVal of traces) {
        zValues.push(zVal.z)
    }

    const reqData = {
        data: zValues,
    }

    const hierOrders = await apiCall(JSON.stringify(reqData), '/data/getHierarchy')

    // set X axis hierarchical order
    const hierXName = []
    for (const value of hierOrders.xOrder) {
        hierXName.push(axisOrders.normal.x[value])
    }
    axisOrders.hierarchical.x = hierXName

    // set Y axis hierarchical order
    const hierYName = []
    for (const value of hierOrders.yOrder) {
        hierYName.push(axisOrders.normal.y[value])
    }
    axisOrders.hierarchical.y = hierYName
}

/*****************************************************************************
 *                                INTERACTIONS
 *****************************************************************************/

//temp plot button
$("#plotBtn").click(plotTemplate)

$(".pBtn").click(generatePlot)

// update number matched dropdown options
$(".tisOpt").click(function() {updateNumMatchedOptions(this)})

// toggle dropdown menu
$(".dropdown").click(function () {toggleNumMatchedDrop(this)})

// plot views
$("#viewNorm").click(function() {changePlotView('normal')})
$("#viewHier").click(function() {changePlotView('hierarchical')})

// on page load
$(document).ready(function() {
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

const testA = () => {
    const a = document.getElementById('plotDiv').data
    console.log(a)
}

$("#testBtn").click(testA)
// $("#testBtn2").click(getHierarchyOrder)
// $("#testBtn3").click(function(){changePlotView('normal')})
// $("#testBtn4").click(function(){changePlotView('hierarchical')})
// $("#testBtn5").click(function(){configureYAxis('normal')})
// $("#testBtn6").click(function(){configureYAxis('hierarchical')})




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
