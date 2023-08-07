let axisOrders = {
    current: {x: [], y: []},
    normal: {x: [], y: []},
    hierarchical: {x: [], y: []}
}

const generatePlot = async () => {
    // console.log('generate plot')
    removeClones('celltypeList2', 1)
    toggleCTList('close')
    
    const species = "mouse"
    // const species = getCheckedboxNames('.specOpt:checked')
    const tissues = getCheckedboxNames('.tisOpt:checked')
    console.log(`tissue: ${tissues}\nspecies: ${species}`)

    const matchOpt = document.getElementById('dropBtnText').innerHTML
    // const matchOpt = 2

    const searchInput = $("#searchInput").val()
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

    if (traceData.length > 1) {
        await getHierarchyOrder(traceData)
    }

    var layout = {
        height: 700,
        showlegend: false,
        autosize: true,
        automargin: true,
        margin: {
            autoexpand: true,
            b: 200
        },
        xaxis: {
            automargin: true,
            tickson: "boundaries",
            ticklen: 15,
            showdividers: true,
            dividercolor: 'grey',
            dividerwidth: 2,
            tickangle: 90,
            tickfont: {
                size: 10
            },
            ticklabeloverflow: "hide past div",
        },
        yaxis: {
            autorange: "reversed",
        },
        annotations: getAnnotations(traceData)
    };

    $('#plotDiv2').empty()
    $('#plotDiv2').removeClass('placeholderDiv')
    Plotly.newPlot('plotDiv2', traceData, layout);

    const plotView = $(".viewSwitch.active").attr('id')
    if (plotView == "viewHier") {
        $("#viewHier").trigger('click')
    }

    // makeXClickable()
    makeClickable()
    updateFilters(featNames, matchOpt)
}

const makeClickable = () => {
    const plotDiv = $("#plotDiv2")[0]
    // const plotData = plotDiv.data
    const plotAnnotations = plotDiv.layout.annotations
    const annotationEls = document.getElementsByClassName('annotation')

    for (let i = 0; i < annotationEls.length; i++) {
        annotationEls[i].onclick = function(){hideTrace(plotAnnotations[i].text)}
    }
}

const hideTrace = (annotationLabel) => {
    const plotAnnotations = $("#plotDiv2")[0].layout.annotations
    if (plotAnnotations.length == 1) {
        return
    }

    const axisOrder = axisOrders.current.x
    const tracePos = axisOrder.indexOf(annotationLabel)

    toggleCTList('open')

    const CTList = document.getElementById('celltypeList2')
    const template = document.getElementById('celltypeName2-template')
    const newItem = template.cloneNode(true)
    newItem.removeAttribute('id')
    newItem.style.display = 'block'
    newItem.innerHTML = annotationLabel
    newItem.onclick = function() {showTrace(newItem, annotationLabel)}
    CTList.append(newItem)

    Plotly.restyle('plotDiv2', {visible: false}, tracePos)

    const annotation = getAnnotations()
    Plotly.relayout('plotDiv2', {annotations: annotation})
    makeClickable()
}

const showTrace = (ele, annotationLabel) => {
    ele.remove()
    toggleCTList('close')
    const tracePos = axisOrders.current.x.indexOf(annotationLabel)
    Plotly.restyle('plotDiv2', {visible: true}, tracePos)

    const annotation = getAnnotations()
    Plotly.relayout('plotDiv2', {annotations: annotation})
    makeClickable()
}

// annotation labels
const getAnnotations = (traceData) => {
    traceData = traceData || $("#plotDiv2")[0].data

    const annotation = []
    let xCount = 0;
    for (const trace of traceData) {
        if (trace.visible) {
            const xLabel = trace.x[0][0]
            const xColCount = trace.x[1].length
            const labelPos = xCount + (xColCount - 1)/2
            annotation.push({
                x: labelPos,
                y: -0.50,
                yref: 'paper',
                text: xLabel,
                showarrow: false,
                textangle: '90',
            })

            xCount += xColCount
        }
    }

    return annotation
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

    // console.log(CTcols.flat())

    return [CTcols, Math.max(...CTcols.flat()), tissueList]
}

const changePlotView = (view) => {
    
    if (JSON.stringify(axisOrders.current) == JSON.stringify(axisOrders[view])) {
        return
    }

    const [yAxis, zVal] = configureYAxis(view)
    const xAxis = configureXAxis(view)

    Plotly.restyle('plotDiv2', {y: yAxis, z: zVal}, [...Array(zVal.length).keys()])
    const plotTraces = document.getElementById('plotDiv2').data
    if (plotTraces.length > 1) {
        Plotly.moveTraces('plotDiv2', xAxis)
    }
    // makeXClickable()
    const annotation = getAnnotations()
    Plotly.relayout('plotDiv2', {annotations: annotation})
    makeClickable()
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
    const plotTraces = document.getElementById('plotDiv2').data
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
/***************************************************
 *                  DEVELOPMENTAL
 ***************************************************/

/***************************************************
 *                  CURRENT FIXED
 ***************************************************/

const collapsePlot = (tracePos, tickLabel) => {
    const traces = document.getElementById('plotDiv2').data
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

    const CTList = document.getElementById('celltypeList2')
    const template = document.getElementById('celltypeName2-template')
    const newItem = template.cloneNode(true)
    newItem.removeAttribute('id')
    newItem.style.display = 'block'
    newItem.innerHTML = tickLabel
    newItem.onclick = function() {addToPlot(newItem, tickLabel)}
    CTList.append(newItem)

    Plotly.restyle('plotDiv2', {visible: false}, tracePos)
    makeXClickable()
}

const addToPlot = (ele, traceName) =>{
    ele.remove()
    toggleCTList('close')
    const tracePos = axisOrders.current.x.indexOf(traceName)
    Plotly.restyle('plotDiv2', {visible: true}, tracePos)
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
    const CTList = document.getElementById('celltypeList2')
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
    const optionParent = document.getElementById('dropContent')
    optionParent.removeChild(optionParent.lastChild)
    const dropSelect = document.getElementById('dropBtnText')
    if (!isNaN(dropSelect.innerHTML) && dropSelect.innerHTML > optionParent.lastChild.innerHTML) {
        dropSelect.innerHTML = optionParent.lastChild.innerHTML
    }
}

const addNumMatchedOption = () => {
    // console.log('add child')
    const optionParent = document.getElementById('dropContent')
    const childCount = optionParent.childElementCount
    const optionTemplate = document.getElementById('dropOp-template')
    const newOption = optionTemplate.cloneNode(true)
    newOption.removeAttribute("id")
    newOption.innerHTML = `${childCount}`
    newOption.onclick = function() {
        document.getElementById('dropBtnText').innerHTML = `${childCount}`
    }

    optionParent.appendChild(newOption)
}

const updateFilters = (featNames, matchOpt) => {
    // search bar
    const searchBar = document.getElementById('searchInput')
    searchBar.value = featNames

    //number of matches
    const dropSelect = document.getElementById('dropBtnText')
    if (isNaN(matchOpt)) {
        dropSelect.innerHTML = 1
    }

    // tissue
    const checkedTissueCount = document.querySelectorAll('.tisOpt:checked').length
    if (checkedTissueCount == 0) {
        const lungCB = document.getElementById('tLung')
        lungCB.checked = true
        addNumMatchedOption()
    }

    // species
    const checkedSpeciesCount = document.querySelectorAll('.speciesOpt:checked').length
    if (checkedTissueCount == 0) {
        const mouseCB = document.getElementById('sMouse')
        mouseCB.checked = true
    }
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
    console.log(traces)
    const zValues = []
    for (const zVal of traces) {
        zValues.push(zVal.z)
    }

    const reqData = {
        data: zValues,
    }

    console.log(reqData)

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

$(".pBtn").click(generatePlot)

// update number matched dropdown options
$(".tisOpt").click(function() {updateNumMatchedOptions(this)})

// toggle dropdown menu
$(".dropdown2").click(function () {toggleNumMatchedDrop(this)})

// plot views
$("#viewNorm").click(function() {
    $("#viewNorm").addClass('active')
    $("#viewHier").removeClass('active')
    changePlotView('normal')
})
$("#viewHier").click(function() {
    $("#viewNorm").removeClass('active')
    $("#viewHier").addClass('active')
    changePlotView('hierarchical')
})

// on page load
$(document).ready(function() {
    // plotTemplate()
    // generatePlot()
});

const toggleFilters = () => {
    console.log('toggle')
    const filter = document.getElementById('filterTabContent')
    filter.classList.toggle('active')
}

$("#filterMenuBtn").click(toggleFilters)

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
