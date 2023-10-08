let axisOrders = {
    current: {x: [], y: []},
    normal: {x: [], y: []},
    hierarchical: {x: [], y: []}
}

let testList = {}

const plotTemplate = () => {
    var trace1 = {
        x: [["celltype1","celltype1","celltype1"],['t1x1', 't1x2', 't1x3']],
        y: ['y1', 'y2', 'y3'],
        z: [[0,1,2],[3,4,5],[6,7,8]],
        visible: true,
        type: 'heatmap',
    }

    var trace2 = {
        x: [["celltype2","celltype2","celltype2"],['t2x1', 't2x2', 't2x3']],
        y: ['y1', 'y2', 'y3'],
        z: [[0,1,2],[3,4,5],[6,7,8]],
        visible: true,
        type: 'heatmap',
    }

    var trace3 = {
        x: [["celltype3","celltype3"],['t3x1', 't3x2']],
        y: ['y1', 'y2', 'y3'],
        z: [[0,1],[3,4],[6,7]],
        visible: true,
        type: 'heatmap',
    }
    
    var trace4 = {
        x: [["celltype4"],['t4x1']],
        y: ['y1', 'y2', 'y3'],
        z: [[0],[3],[6]],
        visible: true,
        type: 'heatmap',
    }
    
    const data = [trace1, trace2, trace3, trace4]
    var ann = []
    let xCount = 0;
    for (const trace of data) {
        console.log(trace)
        if (trace.visible) {
            const xLabel = trace.x[0][0]
            const xColCount = trace.x[1].length
            const labelPos = xCount + (xColCount - 1)/2
            // console.log(`labelPos: ${labelPos}`)
            ann.push({
                x: labelPos,
                y: -0.40,
                yref: 'paper',
                text: xLabel,
                showarrow: false,
                textangle: '90',
            })
            xCount += xColCount
        }
    }

    var layout = {
        showlegend: false,
        xaxis: {
            tickson: "boundaries",
            ticklen: 15,
            showdividers: true,
            dividercolor: 'grey',
            dividerwidth: 2,
            tickangle: 90,
            automargin: true,
        },
        yaxis: {
            autorange: "reversed",
        },
        annotations: ann
    }


    Plotly.newPlot('plotDiv', data, layout);
}

// const plotTemplate = () => {
//     console.log('plot template')
//     var trace1 = {
//         x: [
//           ['SF Zoo','SF Zoo','SF Zoo'],
//         //   [' ',' ',' '],
//           ['giraffes', 'orangutans', 'monaaaaaaaaaakeys']
//         ],
//         y: ['y1', 'y2', 'y3'],
//         z: [[10,11,112], [13,14,15], [16,17,18]],
//         visible: true,
//         name: '',
//         type: 'heatmap'
//       };
      
//       var trace2 = {
//         x: [
//           ['LA Zoo','LA Zoo','LA Zoo'],
//         //   ['  ','  ','  '],
//           ['g', 'o', 'm'],
//         ],
//         y: ['y1', 'y2', 'y3'],
//         z: [[0,1,2], [3,1,5], [6,7,8]],
//         visible: true,
//         name: '',
//         type: 'heatmap'
//       };

//       var trace3 = {
//         x: [
//           ['AU Zoo','AU Zoo','AU Zoo'],
//           ['a', 'b', 'c'],
//         ],
//         y: ['y1', 'y2', 'y3'],
//         z: [[0,1,2], [3,7,5], [6,0,8]],
//         visible: true,
//         name: '',
//         type: 'heatmap'
//       };
      
//       var data = [trace1, trace2, trace3];
//         var data2 = [trace1, trace3, trace2]
//       console.log(data)
//       console.log(data2)

//       var layout = {
//         height: 750,
//         // autosize: true,
//         // margin: {
//         //     automargin: true,
//         // },
//         // paper_bgcolor:'#ff0000', 
//         showlegend: false,
//         xaxis: {
//           tickson: "boundaries",
//           ticklen: 15,
//           showdividers: true,
//           dividercolor: 'grey',
//           dividerwidth: 2,
//           title: 'zoos',
//           tickangle: 90,
//           automargin: true,
//         //   color: 'red'
//         //   ticklabeloverflow: 'hide past domain'
//         },
//         yaxis: {
//             autorange: "reversed",
//         },
//         // annotations: [
//         // {
//         //     x: 0,
//         //     y: -0.25,
//         //     yref: 'paper',
//         //     text: 'x0',
//         //     showarrow: false,
//         // },
//         // {
//         //     x: 1,
//         //     y: -0.25,
//         //     yref: 'paper',
//         //     text: 'xxxxxxxxxxxxxxxxxxxxx1',
//         //     showarrow: false,
//         //     textangle: -90
//         // },
//         // {
//         //     x: 2,
//         //     y: -0.25,
//         //     yref: 'paper',
//         //     text: 'x2',
//         //     showarrow: false, 
//         // },
//         // {
//         //     x: 3,
//         //     y: -0.25,
//         //     yref: 'paper',
//         //     text: 'x3s',
//         //     showarrow: false,
//         // },
//         // {
//         //     x: 4,
//         //     y: -0.25,
//         //     yref: 'paper',
//         //     text: 'x: 4',
//         //     showarrow: false,
//         //     // textangle: -90
//         // }
//         // ]
//       };
//       testList = {'SF Zoo':0, 'LA Zoo':1, 'AU Zoo':2}

//     //   annotations: class="annotations"

//     //   for (let i = 0; i < quarter_names.length; i++) {
//     //     text_annotations.push(
//     //       {
//     //         x: quarter_positions[i],
//     //         y: -0.15,
//     //         xref: 'paper',
//     //         yref: 'paper',
//     //         text: quarter_names[i],
//     //         showarrow: false,
//     //       }
//     //     )
//     //   }

//     //   https://stackoverflow.com/questions/69874927/multiple-x-axis-in-plotly-timeseries
      
//       Plotly.newPlot('plotDiv', data, layout);
//     //   clickable()

//     // const t = document.getElementsByClassName('annotation')
//     // const t = document.getElementsByClassName('xtick2')
//     // console.log(t)
//     // for (let i = 0;i < t.length; i++) {
//     //     // console.log(t[i])
//     //     t[i].onclick = function(){myFunc(i, t)}
//     // }
// }

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

    getHierarchyOrder(traceData)
    const annotations = getAnnotations(traceData)
    console.log(annotations)

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
        annotations: annotations
    };

    Plotly.newPlot('plotDiv', traceData, layout);
    // makeXClickable()
    makeClickable()
    updateFilters(featNames, matchOpt)
}

const makeClickable = () => {
    const plotDiv = $("#plotDiv")[0]
    const plotData = plotDiv.data
    const plotAnnotations = plotDiv.layout.annotations
    console.log(plotData)
    console.log(plotAnnotations)
    const annotationEls = document.getElementsByClassName('annotation')

    
    for (let i = 0; i < annotationEls.length; i++) {
        console.log(i, annotationEls[i])
        annotationEls[i].onclick = function(){hideTrace(plotAnnotations[i].text)}
    }
}

const hideTrace = (annotationLabel) => {
    console.log(annotationLabel)
    const axisOrder = axisOrders.current.x
    const tracePos = axisOrder.indexOf(annotationLabel)

    toggleCTList('open')

    const CTList = document.getElementById('celltypeList')
    const template = document.getElementById('celltypeName-template')
    const newItem = template.cloneNode(true)
    newItem.removeAttribute('id')
    newItem.style.display = 'block'
    newItem.innerHTML = annotationLabel
    newItem.onclick = function() {showTrace(newItem, annotationLabel)}
    CTList.append(newItem)

    Plotly.restyle('plotDiv', {visible: false}, tracePos)

    const annotation = getAnnotations()
    Plotly.relayout('plotDiv', {annotations: annotation})
    makeClickable()
}

const showTrace = (ele, annotationLabel) => {
    ele.remove()
    toggleCTList('close')
    const tracePos = axisOrders.current.x.indexOf(annotationLabel)
    Plotly.restyle('plotDiv', {visible: true}, tracePos)

    const annotation = getAnnotations()
    Plotly.relayout('plotDiv', {annotations: annotation})
    makeClickable()
}


const getAnnotations = (traceData) => {
    traceData = traceData || $("#plotDiv")[0].data

    const annotation = []
    let xCount = 0;
    for (const trace of traceData) {
        console.log(trace)
        if (trace.visible) {
            const xLabel = trace.x[0][0]
            const xColCount = trace.x[1].length
            const labelPos = xCount + (xColCount - 1)/2
            console.log(labelPos)
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
    // console.log(CTcols)
    // console.log(CTcols.flat())

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
    // template()
    template2()
});

/*****************************************************************************
 *                             TEST INTERACTIONS
 *****************************************************************************/
const template2 = () => {
    Plotly.newPlot('plotDiv', [{
        x: [['celltype0','celltype0','celltype0','celltype0'],['mouse_lung', 'human_lung']],
        y: ['g1, g11', 'g2, g22', 'g3, g33', '', 'g5, g55', 'g6, g66'],
        z: [[5,6],[9,5],[1,2],[3,2],[null,2],[1,9]],
        type: 'heatmap'
      }])
}


const printData = () => {
    const celltypeAxis = document.getElementsByClassName('annotation')
    const plotAnnotations = plotDiv.layout.annotations
    console.log(`celltype axis:`)
    console.log(celltypeAxis)
    console.log(`plot annotation:`)
    console.log(plotAnnotations)
}

const plotData = async () => {

    const data = await getData([], 'mouse', )
    // console.log(data)

    const firstTissue = data[Object.keys(data)[0]]
    const featNames = firstTissue.features[0]

    const allCellTypes = getAllCellTypes(data)

    // console.log(featNames)
    // console.log(allCellTypes)

    const traceData = []

    for (const [idx, cellType] of allCellTypes.entries()) {
        // console.log(`idx: ${idx}\tcelltype: ${cellType}`)
        const [CTvals, maxV, tissueList] = getCellType_Tissue(data, cellType, featNames.length)
        // console.log(`CTvals: ${CTvals}\t tissueList: ${tissueList}`)
        // console.log(maxV)

        const x = [
            Array(tissueList.length).fill(cellType),
            tissueList
        ]

        console.log(x)
        console.log(featNames)
        console.log(CTvals)

        // const trace = {
        //     x: [
        //         Array(tissueList.length).fill(cellType),
        //         tissueList
        //     ],
        //     y: featNames,
        //     z: CTvals,
        //     zmin: 0,
        //     colorscale: 'Reds',
        //     type: 'heatmap',
        //     name: '',
        //     xgap: 3,
        //     ygap: 3,
        //     visible: true
        // }
        
        traceData.push(trace)

        if (idx == 1) {
            break
        }
        // traceOrder.push(cellType)
    }

    Plotly.newPlot("plotDiv", traceData)
}

$("#testBtn").click(plotData)
$("#testBtn2").click(printData)

const template = () => {
    var data = [
    {
        x: [['celltype0','celltype0','celltype0','celltype0'],['mouse_lung', 'human_lung']],
        // y: ['g1', 'g2', 'g3'],
        y: ['g1, g11', 'g2, g22', 'g3, g33', 'g4, g44', 'g5, g55', 'g6, g66'],
        z: [[5,6],[9,5],[1,2],[3,2],[5,2],[1,9]],
        visible: true,
        type: 'heatmap',
        name: '',
        hovertemplate: '<b>Celltype:</b> %{x[0]}<br><b>Species:</b> %{x[1]}'
    },
    // {
    //     x: [['celltype1','celltype1','celltype1','celltype1','celltype1'],['mouse_lung','mouse_heart','human_lung','human_heart','human_colon']],
    //     // y: ['g1', 'g2', 'g3'],
    //     y: ['g1, g11', 'g2, g22', 'g3, g33', 'g4, g44', 'g5, g55', 'g6, g66'],
    //     z: [[1,2,3,4,6],[5,6,7,8,6],[9,5,3,1,6],[9,5,3,1,6],[9,5,3,1,6],[9,5,3,1,6]],
    //     visible: true,
    //     type: 'heatmap',
    // },
    {
        // x: [['celltype2','celltype2','celltype2'],['mouse_lung','mouse_heart','human_lung']],
        x: [['celltype2','celltype2','celltype2'],['mouse_lung','mouse_heart','human_lung']],
        // y: ['g1', 'g2', 'g3'],
        y: ['g1, g11', 'g2, g22', 'g3, g33', 'g4, g44', 'g5, g55', 'g6, g66'],
        z: [[5,6,7],[9,5,3],[1,2,7],[5,6,7],[9,5,3],[1,2,7]],
        visible: true,
        type: 'heatmap',
    },
    {
        x: [['celltype3','celltype3','celltype3','celltype3'],['mouse_lung','mouse_heart','human_lung','human_heart']],
        // y: ['g1', 'g2', 'g3'],
        y: ['g1, g11', 'g2, g22', 'g3, g33', 'g4, g44', 'g5, g55', 'g6, g66'],
        z: [[5,6,7,8],[9,5,3,1],[1,2,6,4],[1,2,6,4],[1,2,6,4],[1,2,6,4]],
        visible: true,
        type: 'heatmap',
    },
    {
        x: [['celltype4','celltype4','celltype4','celltype4'],['mouse_lung','mouse_heart','human_lung','human_heart']],
        // y: ['g1', 'g2', 'g3'],
        y: ['g1, g11', 'g2, g22', 'g3, g33', 'g4, g44', 'g5, g55', 'g6, g66'],
        z: [[5,6,7,8],[9,5,3,1],[1,2,6,4],[1,2,6,4], [1,2,6,4], [1,2,6,4]],
        visible: true,
        type: 'heatmap',
    },
    // {
    //     x: [['celltype5','celltype5','celltype5','celltype5'],['mouse_lung','mouse_heart','human_lung','human_heart']],
    //     // y: ['g1', 'g2', 'g3'],
    //     y: ['g1, g11', 'g2, g22', 'g3, g33'],
    //     z: [[5,6,7,8],[9,5,3,1],[1,2,6,4]],
    //     visible: true,
    //     type: 'heatmap',
    // },
    // {
    //     x: [['celltype6','celltype6','celltype6','celltype6'],['mouse_lung','mouse_heart','human_lung','human_heart']],
    //     // y: ['g1', 'g2', 'g3'],
    //     y: ['g1, g11', 'g2, g22', 'g3, g33'],
    //     z: [[5,6,7,8],[9,5,3,1],[1,2,6,4]],
    //     visible: true,
    //     type: 'heatmap',
    // },
    // {
    //     x: [['celltype7','celltype7','celltype7','celltype7'],['mouse_lung','mouse_heart','human_lung','human_heart']],
    //     // y: ['g1', 'g2', 'g3'],
    //     y: ['g1, g11', 'g2, g22', 'g3, g33'],
    //     z: [[5,6,7,8],[9,5,3,1],[1,2,6,4]],
    //     visible: true,
    //     type: 'heatmap',
    // },
    ]

    // annotations: tissue axis, species axis, celltypes axis
    // shapes:
    //      vertical: trace divisions, species division
    //      horizontal: spcecies/tissue axis

    const shapes = []

    let labelPos = 0
    const annotations = []
    for (const [idxT, trace] of data.entries()) {
        if (!trace.visible) {
            continue
        }
        const celltype = trace.x[0][0]
        const tisAxis = trace.x[1]
        const celltypePos = labelPos+(tisAxis.length-1)/2
        // annotation for celltype axis
        annotations.push({
            x: celltypePos,
            y: 1.1,
            yref: 'paper',
            text: celltype,
            showarrow: false,
            captureevents: true,
        })


        let speciesCount = 0
        for (const [idxL, label] of tisAxis.entries()) {
            const splitLabel = label.split("_")
            const speciesType = splitLabel[0]
            const tissueType = splitLabel[1]
                
            const nextId = idxL+1
            const nextEle = tisAxis[nextId]

            if (nextEle == undefined || !nextEle.startsWith(speciesType)) {
                const speciesPos = labelPos-(speciesCount/2)
                // annotation for species axis
                annotations.push({
                    x: speciesPos,
                    y: -0.25,
                    yref: 'paper',
                    text: speciesType,
                    showarrow: false,
                    textangle: '90'
                })
                speciesCount = 0
                if (nextEle != undefined) {
                    const speciesLinePos = labelPos+0.5
                    // species line division
                    shapes.push({
                        type: 'line',
                        yref: 'paper',
                        x0: speciesLinePos,
                        y0: 1,
                        x1: speciesLinePos,
                        y1: -0.25,
                        line: {
                            dash: 'dot'
                        }
                    })
                }
            } else {
                speciesCount++;
            }

            // annotation for tissue axis
            annotations.push({
                x: labelPos,
                y: -0.05,
                yref: 'paper',
                text: tissueType,
                showarrow: false,
            })
            labelPos++;
        }

        const nextTrace = data[idxT+1]
        if (nextTrace) {
            const celltypeLinePos = labelPos-0.5
            // celltype line division
            shapes.push({
                type: 'line',
                yref: 'paper',
                x0: celltypeLinePos,
                y0: 1.15,
                x1: celltypeLinePos,
                y1: 0,
                line: {
                    width: 3,
                }
            })
        }
    }
   
    var layout = {
        height: 600,
        showlegend: false,
        autosize: true,
        automargin: true,
        margin: {
            autoexpand: true,
            b: 200
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
        annotations: annotations,
        shapes: shapes
    };

    Plotly.newPlot("plotDiv", data, layout)

    const gd = document.getElementById('plotDiv')
    gd.on('plotly_clickannotation', (annotation) => {
        console.log('annotation clicked !!!');
        const celltype = annotation.annotation.text
        console.log(celltype);

        // call hide trace function

    })

}

// const template = () => {
//     var data = [{
//         // x: [['celltype1', 'celltype1', 'celltype1', 'celltype1', 'celltype1'],['species1', 'species1', 'species1','species1','species1'],['tissue1','tissue2','tissue3','tissue4','tissue5']],
//         // x: [['celltype1', 'celltype1', 'celltype1', 'celltype1'],['species1', 'species1','species1','species1'],['tissue1','tissue2','tissue3','tissue4']],
//         // x: [['celltype1', 'celltype1', 'celltype1'],['species1', 'species1','species1'],['tissue1','tissue2','tissue3']],
//         x: [['celltype1', 'celltype1'],['species1', 'species1'],['tissue1','tissue2']],
//         // x: [['celltype1'],['species1'],['tissue1']],

//         // x: [['celltype1', 'celltype1', 'celltype1', 'celltype1','celltype1'],['tissue1','tissue2','tissue3','tissue4']],
//         // x: [['celltype1'],['tissue1']],
//         // x: ['tis1'],
//         y: ['g1', 'g2', 'g3'],

//         // y: ['g1', 'g2'],
//         // z: [[1,2,3,4,5],[4,5,6,7,8]],
//         // z: [[1,2,3],[4,5,6]],
//         // z: [[1,2],[4,5]],
//         // z: [[1],[4]],
        
//         // z: [[1,2,3,4,5],[4,5,6,7,8],[7,8,9,1,2]],
//         z: [[1,2],[4,5],[7,8]],
//         // z: [[1],[4],[7]],


//         type: 'heatmap',
//     },
//     // {
//     //     // x: [['celltype2', 'celltype2', 'celltype2'],['species1', 'species1', 'species1'],['tissue1','tissue2','tissue3']],
//     //     x: [['celltype2'],['species1'],['tissue1']],
//     //     y: ['g1', 'g2', 'g3'],
//     //     z: [[3],[6],[9]],
//     //     type: 'heatmap',
//     // },
//     ]
//     // var data = [{
//     //     // x: [['celltype1','celltype1','celltype1','celltype1'],['11','11','12','13'],['01','02','01','01']],
//     //     x: [['celltype1','celltype1'],['tis1','tis2']],
//     //     // x: ['tis1'],
//     //     y: ['g1','g2'],
//     //     z: [[1,2],[3,4]],
//     //     type: 'heatmap',
//     // },
//     // {
//     //     // x: [['celltype2','celltype2','celltype2','celltype2'],['11','11','12','13'],['01','02','01','01']],
//     //     x: [['celltype2','celltype2','celltype2','celltype2'],['tis1','tis2','tis3','tis4']],
//     //     y: ['g1','g2','g3'],
//     //     z: [[1,2,3,4],[9,8,7,6],[4,3,2,1]],
//     //     type: 'heatmap',
//     // }
//     // ]

//     // console.log(data)

//     Plotly.newPlot("plotDiv", data)
  
// }


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

// add annotations
const testB = () => {
    console.log('testB')
    const plotDiv = $("#plotDiv")[0]
    const plotData = plotDiv.data
    console.log(plotDiv.layout.annotations)
    console.log(plotData)

    const annotation = []
    let xCount = 0;
    for (const trace of plotData) {
        console.log(trace)
        if (trace.visible) {
            const xLabel = trace.x[0][0]
            const xColCount = trace.x[1].length
            const labelPos = xCount + (xColCount - 1)/2
            // console.log(labelPos)
            annotation.push({
                x: labelPos,
                y: -0.40,
                yref: 'paper',
                text: xLabel,
                showarrow: false,
                textangle: '90',
            })

            xCount += xColCount
        }
    }

    // console.log(annotation)
    Plotly.relayout('plotDiv', {annotations: annotation})
    testC();
}

// make clickable
const testC = () => {
    const plotDiv = $("#plotDiv")[0]
    const plotData = plotDiv.data
    const plotAnnotations = plotDiv.layout.annotations
    console.log(plotData)
    console.log(plotAnnotations)
    const annotationEls = document.getElementsByClassName('annotation')

    
    for (let i = 0; i < annotationEls.length; i++) {
        console.log(i, annotationEls[i])
        annotationEls[i].onclick = function(){testD(plotAnnotations[i].text)}
    }
}

const testD = (traceAnnotationLabel) => {
    console.log('hide trace')
    console.log(traceAnnotationLabel)
}

// hides a trace
const testA = () => {
    const plotDiv = $("#plotDiv")[0]
    const plotData = plotDiv.data
    console.log(plotData)
    Plotly.restyle('plotDiv', {visible: false}, 1)
}

const testE = () => {
    // const plotDiv = $("#plotDiv")[0]
    // const plotData = plotDiv.data

    // console.log(plotData)
    console.log(axisOrders)
}

// $("#testBtn").click(testB)
// $("#testBtn2").click(testA)
$("#testBtn3").click(testC)
$("#testBtn4").click(testE)
// $("#testBtn5").click()
// $("#testBtn6").click()
