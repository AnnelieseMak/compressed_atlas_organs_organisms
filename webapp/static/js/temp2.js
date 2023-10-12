let axisOrders = {
    current: {x: [], y: []},
    normal: {x: [], y: []},
    hierarchical: {x: [], y: []}
}

let translations

const generatePlot = async () => {
    removeClones('celltypeList2', 1)
    toggleCTList('close')
    
    // const species = "mouse"
    const species = getCheckedboxNames('.specOpt:checked')
    // console.log(species)
    const tissues = getCheckedboxNames('.tisOpt:checked')
    console.log(`tissue: ${tissues}\nspecies: ${species}`)

    const matchOpt = document.getElementById('dropBtnText').innerHTML
    // const matchOpt = 2

    const searchInput = $("#searchInput").val()
    // console.log(`searchInput: ${searchInput}`)

    const celltypeOptId = $(".celltypeSwitch.active").attr('id')
    let celltypeMatch
    if (celltypeOptId != "celltypeSwitchAll") {
        const inputVal = $("#celltypeSwitchInput").val()
        // TO DO: VALID CELLTYPE
        if (inputVal) {
            celltypeMatch = inputVal
        } else {
            $("#celltypeSwitchAll").trigger('click')
        }
    }

    const data = await getData(tissues, species, searchInput)
    // console.log(`data:\n${JSON.stringify(data)}`)
    // console.log(`data:\n${data}`)
    
    const firstSpecies = data[Object.keys(data)[0]]
    const firstTissue = firstSpecies[Object.keys(firstSpecies)[0]]
    const featNames = firstTissue.features[0]
    
    const allCellTypes = getAllCellTypes(data)
    console.log(allCellTypes)
    // const traceData = new Array(allCellTypes.length)
    
    let traceData = []
    let maxVal = 0
    let traceOrder = []

    console.log(translations)
    console.log(featNames)
    // const yLabel = []
    // for (let i = 0; i < featNames.length; i++) {
    //     // let label = ""
    //     const label = []
    //     for (const [keySpecies, valueSpecies] of Object.entries(translations)) {
    //         // label = label.concat(valueSpecies[i], ', ')
    //         console.log(valueSpecies[i])
    //         label.push(valueSpecies[i])
    //     }
    //     yLabel.push(label.join(", "))
    // }

    // console.log(yLabel)
    
    for (const [idx, cellType] of allCellTypes.entries()) {
        const [CTvals, maxV, tissueList, cellInfo] = getCellType_Tissue(data, cellType, featNames.length)
        // console.log(maxV)

        
        if (matchOpt > tissueList.length) {
            continue
        }
        
        let traceVis = true
        if (celltypeMatch) {
            const lowerCelltype = cellType.toLowerCase()
            const lowerMatch = celltypeMatch.toLowerCase()
            if (!lowerCelltype.includes(lowerMatch)) {
                traceVis = false
                addToCelltypeList(cellType)
            }
        }

        // console.log(tissueList)
        // const [species, tissue] = tissueList.split("_")
        // console.log(species, tissue)

        // return
        
        const trace = {
            x: [
                Array(tissueList.length).fill(cellType),
                tissueList
            ],
            y: featNames,
            // y: yLabel,
            z: CTvals,
            zmin: 0,
            // colorscale: 'Reds',
            colorscale: [
                ['0.0', 'rgb(230, 231, 232)'],
                ['1.0', 'rgb(53, 76, 115)']
            ],
            type: 'heatmap',
            name: '',
            xgap: 0.5,
            ygap: 0.5,
            // customdata: [['c1','c1.1'],['c2']],
            // hovertemplate: '<b>Celltype:</b> %{x[0]}<br><b>Species:</b> %{customdata}',
            // customdata: [[{'species': 'c1', 'other': '2'},{'species': 'c1.1', 'other': '1'}],[{'species': 'c2', 'other': '3'}]],
            // hovertemplate: '<b>Celltype:</b> %{x[0]}<br><b>Species:</b> %{customdata.species}<br><b>Gene:</b> %{customdata.other}',
            // hovertemplate: '<b>Celltype:</b> %{x[0]}<br><b>Species:</b> %{x[1]}<br><b>Gene:</b> %{y}<br><b>Expression:</b> %{z}',
            customdata: cellInfo,
            hovertemplate: '<b>Celltype:</b> %{x[0]}<br><b>Species:</b> %{customdata.species}<br><b>Tissue:</b> %{customdata.tissue}<br><b>Gene:</b> %{customdata.gene}<br><b>Expression:</b> %{z}',
            visible: traceVis
        }

        maxVal = Math.max(maxVal, maxV)
        
        traceData.push(trace)
        traceOrder.push(cellType)
    }

    axisOrders.current.x = axisOrders.normal.x = traceOrder
    axisOrders.current.y = axisOrders.normal.y = featNames

    // sets zmax to overall max for shared scale
    for (const trace of traceData) {
        trace.zmax = maxVal
    }

    if (traceData.length > 1 && featNames.length > 1) {
        await getHierarchyOrder(traceData)
    }

    const [annotation, shape] = getAnnotationShapes(traceData)

    var layout = {
        height: 800,
        showlegend: false,
        autosize: true,
        automargin: true,
        margin: {
            autoexpand: true,
            b: 200,
            t: 200
        },
        xaxis: {
            automargin: true,
            tickson: "boundaries",
            ticklen: 15,
            showdividers: true,
            dividercolor: 'grey',
            dividerwidth: 2,
            tickangle: -90,
            tickfont: {
                size: 10
            },
            // ticklabeloverflow: "hide past div",
        },
        yaxis: {
            autorange: "reversed",
            automargin: true,
        },
        // annotations: getAnnotations(traceData)
        annotations: annotation,
        shapes: shape,
    };

    $('#plotDiv2').empty()
    $('#plotDiv2').removeClass('placeholderDiv')
    Plotly.newPlot('plotDiv2', traceData, layout);

    const plotView = $(".viewSwitch.active").attr('id')
    if (plotView == "viewHier") {
        $("#viewHier").trigger('click')
    }

    makeClickable()
    updateFilters(featNames, matchOpt)
}

// layout annotations and shapes
const getAnnotationShapes = (traceData) => {
    traceData = traceData || $("#plotDiv2")[0].data
    let annotations = []
    let shapes = []
    let labelPos = 0

    for (const [idxTrace, trace] of traceData.entries()) {
        if (!trace.visible) {
            continue
        }

        annotations.push(getCelltypeAnnotation(labelPos, trace))

        const [retPos, retAnn, retShapes] = getSpecTisAnnotation(labelPos, trace)
        labelPos = retPos
        annotations = annotations.concat(retAnn)
        shapes = shapes.concat(retShapes)
        
        const nextTrace = traceData[idxTrace+1]
        if (nextTrace) {
            const celltypeLinePos = labelPos-0.5
            // celltype line division
            shapes.push({
                type: 'line',
                yref: 'paper',
                x0: celltypeLinePos,
                y0: 1.1,
                x1: celltypeLinePos,
                y1: 0,
                line: {
                    width: 1,
                }
            })
        }
    }
    
    return [annotations, shapes]
}

const getCelltypeAnnotation = (labelPos, trace) => {
    const celltype = trace.x[0][0]
    const tisAxis = trace.x[1]
    const celltypePos = labelPos+(tisAxis.length-1)/2
    return {
        x: celltypePos,
        y: 1.03,
        yref: 'paper',
        text: celltype,
        textangle: '-90',
        yanchor: 'bottom',
        showarrow: false,
        captureevents: true,
    }
}

const getSpecTisAnnotation = (labelPos, trace) => {
    const annotations = []
    const shapes = []
    const tisAxis = trace.x[1]
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
                y: -0.15,
                yref: 'paper',
                text: speciesType,
                showarrow: false,
                textangle: '-90',
                yanchor: 'top',
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
                    y1: 0,
                    line: {
                        width: 0.5,
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
            y: -0.01,
            yref: 'paper',
            text: tissueType,
            showarrow: false,
            textangle: '-90',
            yanchor: 'top',
        })
        labelPos++;
    }

    return [labelPos, annotations, shapes]
}

// return list of unique celltype names
const getAllCellTypes = (data) => {
    let allCellTypes = []

    for (const [keySpecies, valueSpecies] of Object.entries(data)) {
        for (const [keyTissue, valueTissue] of Object.entries(valueSpecies)) {
            console.log(keyTissue, valueTissue)
            allCellTypes.push(...valueTissue.celltypes)
        }
    }

    // for (const [key, value] of Object.entries(data)) {
    //     allCellTypes.push(...value.celltypes)
    // }

    allCellTypes = [...new Set(allCellTypes)]

    return allCellTypes
}

const getCellType_Tissue = (data, cellType, featuresCount) => {
    // console.log('\t\t\t\t\t\t\t\tFUNCTION: getCellType_Tissue')
    // console.log(data)
    const CTcols = [...Array(featuresCount)].map(e => Array(1));
    let tissueList = []
    let colNo = 0
    const cellInfo = [...Array(featuresCount)].map(e => Array(1));

    for (const [keySpecies, valueSpecies] of Object.entries(data)) {
        // console.log(keySpecies)
        for (const [keyTissue, valueTissue] of Object.entries(valueSpecies)) {
            const tissueCT = valueTissue.celltypes
            const CTidx = tissueCT.indexOf(cellType)

            if (CTidx != -1) {
                const tissueData = valueTissue.data[0]
                const tissueFeatures = valueTissue.features[0]
                for (let i = 0; i < featuresCount; i++) {
                    CTcols[i][colNo] = tissueData[i][CTidx]
                    const infoDict = {
                        'species': keySpecies[0].toUpperCase() + keySpecies.slice(1),
                        'tissue': keyTissue,
                        'gene': tissueFeatures[i],
                    }                    
                    cellInfo[i][colNo] = infoDict
                }
                const label = `${keySpecies}_${keyTissue}`
                tissueList.push(label)
                colNo++
            }
        }
    }

    // {species, tissue, gene}
    // console.log(cellInfo)

    return [CTcols, Math.max(...CTcols.flat()), tissueList, cellInfo]
}

/***************************************************
 *                  COLLAPSIBLE
 ***************************************************/

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
    const pData = $("#plotDiv2")[0].data

    let traceCount = 0
    for (const trace of pData) {
        if (trace.visible) {
            traceCount++
        }
    }

    if (traceCount == 1) {
        return
    }

    const axisOrder = axisOrders.current.x
    const tracePos = axisOrder.indexOf(annotationLabel)

    addToCelltypeList(annotationLabel)

    Plotly.restyle('plotDiv2', {visible: false}, tracePos)

    const [annotation, shape] = getAnnotationShapes()
    Plotly.relayout('plotDiv2', {annotations: annotation, shapes: shape})
    makeClickable()
}

const addToCelltypeList = (annotationLabel) => {
    toggleCTList('open')
    const CTList = document.getElementById('celltypeList2')
    const template = document.getElementById('celltypeName2-template')
    const newItem = template.cloneNode(true)
    newItem.removeAttribute('id')
    newItem.style.display = 'block'
    newItem.innerHTML = annotationLabel
    newItem.onclick = function() {showTrace(newItem, annotationLabel)}
    CTList.append(newItem)
}

const showTrace = (ele, annotationLabel) => {
    ele.remove()
    toggleCTList('close')
    const tracePos = axisOrders.current.x.indexOf(annotationLabel)
    Plotly.restyle('plotDiv2', {visible: true}, tracePos)

    const [annotation, shape] = getAnnotationShapes()
    Plotly.relayout('plotDiv2', {annotations: annotation, shapes: shape})
    makeClickable()
}

/***************************************************
 *                  HIERARCHY
 ***************************************************/

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
    
    const [annotation, shape] = getAnnotationShapes()
    Plotly.relayout('plotDiv2', {annotations: annotation, shapes: shape})
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

const toggleFilters = () => {
    console.log('toggle')
    const filter = document.getElementById('filterTabContent')
    filter.classList.toggle('active')
}

/*****************************************************************************
 *                                API CALLS
 *****************************************************************************/

const apiCall = (requestData, path) => {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: 'GET',
            url: path,
            data: requestData,
            success: function(result) {
                // console.log(result)
                resolve(result)
            }
        })
    })
}

const getData = async (tissues, speciesList, feats) => {    
    if (!speciesList.length) {
        speciesList = ["mouse"]
        // speciesList = ["mouse","human"]
    }

    if (!tissues.length) {
        tissues = ["Lung"]
        // tissues = ["Lung","Heart"]        
    }

    if (!feats) {
        feats = "Actc1,Actn2,Myl2,Myh7,Col1a1,Col2a1,Pdgfrb,Pecam1,Gja5,Vwf,Ptprc,Ms4a1,Gzma,Cd3d,Cd68,Epcam"
    }

    let data = {}
    for (const species of speciesList) {
        data[species] = {}
    }

    console.log(data)

    // get data for first species
    const refSpecies = speciesList[0]
    let refSpeciesFeatures
    for (const tissue of tissues) {
        const reqData = {
            feature_names: feats,
            species: refSpecies,
            tissue
        }
        const retVal = await apiCall(reqData, '/data/by_celltype')
        console.log(retVal)
        data[refSpecies][tissue] = retVal

        if (!refSpeciesFeatures) {
            refSpeciesFeatures = retVal.features[0]
        }
    }
    console.log(speciesList)
    
    // use corrected features list to translate to other species (if any)
    console.log(refSpeciesFeatures)
    const translateTo = speciesList.slice(1)
    translations = await getTranslation(refSpecies, refSpeciesFeatures, translateTo)
    console.log(translations)

    for (let i = 1; i < speciesList.length; i++) {
        for (const tissue of tissues) {
            let feature_names = translations[speciesList[i]].toString()
            console.log(feature_names)
            const reqData = {
                feature_names,
                species: speciesList[i],
                tissue
            }
            const retVal = await apiCall(reqData, '/data/by_celltype')
            data[speciesList[i]][tissue] = retVal
        }
    }

    // const featList = feats.split(",")
    // const translateTo = speciesList.slice(1)
    // const refSpecies = speciesList[0]
    // translations = await getTranslation(refSpecies, featList, translateTo)
    // console.log(translations)

    // for (const species of speciesList) {
    //     for (const tissue of tissues) {
    //         let feature_names = translations[species].toString()
    //         const reqData = {
    //             feature_names,
    //             species,
    //             tissue
    //         }
    //         // console.log(reqData)
    //         const retVal = await apiCall(reqData, '/data/by_celltype')
    //         data[species][tissue] = retVal
    //         // console.log(data)
    //     }
    // }

    console.log(data)
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

const getTranslation = async (refSpecies, refFeat, translateTo) => {
    if (!translateTo.length) {
        return {[refSpecies]: refFeat}
    }
    
    const reqData = {
        reference: {
            species: refSpecies,
            feature_names: refFeat,
        },
        translateTo
    }

    const ret = await apiCall(JSON.stringify(reqData), '/data/getHomolog')
    return ret
}

/*****************************************************************************
 *                                INTERACTIONS
 *****************************************************************************/

$(".pBtn").click(generatePlot)

// update number matched dropdown options
$(".tisOpt").click(function() {updateNumMatchedOptions(this)})

// all or one celltype
$("#celltypeSwitchAll").click(function() {
    $("#celltypeSwitchAll").addClass('active')
    $("#celltypeSwitchOne").removeClass('active')
})
$("#celltypeSwitchOne").click(function() {
    $("#celltypeSwitchOne").addClass('active')
    $("#celltypeSwitchAll").removeClass('active')
})

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
    generatePlot()
});


$("#filterMenuBtn").click(toggleFilters)

/*****************************************************************************
 *                             TEST INTERACTIONS
 *****************************************************************************/

const testFunc = async () => {
    console.log('testFunc')

    const reqData = {
        reference: {
            species: 'human',
            feature_names: ["Ins"],
        },
        translateTo: ['mouse']
    }

    // const reqData = {
    //     reference: {
    //         species: 'human',
    //         feature_names: ["ACTC1","ACTN2","MYL2","MYH7","COL1A1","COL2A1","PDGFRB","PECAM1","GJA5","VWF","PTPRC","MS4A1","GZMA","CD3D","CD68","EPCAM"],
    //     },
    //     translateTo: ['mouse']
    // }
    const ret = await apiCall(JSON.stringify(reqData), '/data/getHomolog')
    console.log(ret)
}

const testFunc2 = async () => {
    console.log('here')
    const tissue = ['Bone marrow']
    const species = ['human']
    const features = null
    const data = await getData(tissue, species, features)
    console.log(data)
}

$("#testBtn").click(testFunc)
$("#testBtn2").click(testFunc2)
