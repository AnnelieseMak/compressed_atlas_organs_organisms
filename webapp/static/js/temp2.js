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
    // console.log(`tissue: ${tissues}\nspecies: ${species}`)

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

    const [data, featNames] = await getData(tissues, species, searchInput)
    // console.log(`data:\n${JSON.stringify(data)}`)
    // console.log(`data:\n${data}`)

    console.log(translations)

    
    // const firstSpecies = data[Object.keys(data)[0]]
    // const firstTissue = firstSpecies[Object.keys(firstSpecies)[0]]
    // const featNames = firstTissue.features[0]
    
    const allCellTypes = getAllCellTypes(data)
    console.log(allCellTypes)
    
    const yLabel = []
    for (let i = 0; i < Object.values(translations.translation)[0].length; i++) {
        const label = []
        for (const [keySpecies, valueSpecies] of Object.entries(translations.translation)) {
            if (valueSpecies[i] != null) {
                label.push(valueSpecies[i])
            }
        }
        yLabel.push(label.join(" || "))
    }
    
    console.log(yLabel)
    
    const traceData = []
    let maxVal = 0
    let traceOrder = []
    for (const [idx, cellType] of allCellTypes.entries()) {
        const [CTvals, maxV, tissueList, cellInfo] = getCellType_Tissue(data, cellType)
        
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

        const trace = {
            x: [
                Array(tissueList.length).fill(cellType),
                tissueList
            ],
            // y: featNames,
            y: yLabel,
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
            customdata: cellInfo,
            hovertemplate: '<b>Celltype:</b> %{x[0]}<br><b>Species:</b> %{customdata.species}<br><b>Tissue:</b> %{customdata.tissue}<br><b>Gene:</b> %{customdata.gene}<br><b>Expression:</b> %{z}',
            visible: traceVis
        }

        maxVal = Math.max(maxVal, maxV)
        
        traceData.push(trace)
        traceOrder.push(cellType)
    }

    axisOrders.current.x = axisOrders.normal.x = traceOrder
    axisOrders.current.y = axisOrders.normal.y = yLabel

    // sets zmax to overall max for shared scale
    for (const trace of traceData) {
        trace.zmax = maxVal
    }

    if (traceData.length > 1 && yLabel.length > 1) {
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

    allCellTypes = [...new Set(allCellTypes)]

    return allCellTypes
}

const getCellType_Tissue = (data, celltype) => {
    const translationDict = translations.translation
    const featuresDict = translations.features

    const colLength = Object.values(translationDict)[0].length
    const CTcols = [...Array(colLength)].map(e => Array(1));
    const cellInfo = [...Array(colLength)].map(e => Array(1));
    let colNo = 0
    let tissueList = []

    for (const [keySpecies, valueSpecies] of Object.entries(data)) {
        const speciesFeatures = featuresDict[keySpecies]
        const speciesTranslation = translationDict[keySpecies]
        for (const [keyTissue, valueTissue] of Object.entries(valueSpecies)) {

            const tissueCT = valueTissue.celltypes
            const CTIdx = tissueCT.indexOf(celltype)

            if (CTIdx == -1) {
                continue
            }

            const tissueData = valueTissue.data[0]

            for (const [idx, feature] of speciesTranslation.entries()) {
                let cellValue = null
                if (feature != null) {
                    const featurePos = speciesFeatures.indexOf(feature)
                    cellValue = tissueData[featurePos][CTIdx]
                }

                const infoDict = {
                    'species': keySpecies[0].toUpperCase() + keySpecies.slice(1),
                    'tissue': keyTissue,
                    'gene': feature != null ? feature : 'None',
                }
                cellInfo[idx][colNo] = infoDict
                CTcols[idx][colNo] = cellValue
            }
            const label = `${keySpecies}_${keyTissue}`
            tissueList.push(label)
            colNo++
        }
    }

    return [CTcols, Math.max(...CTcols.flat()), tissueList, cellInfo]
}

// const getCellType_Tissue = (data, cellType, featuresCount) => {
//     // console.log('\t\t\t\t\t\t\t\tFUNCTION: getCellType_Tissue')
//     // console.log(data)
//     const CTcols = [...Array(featuresCount)].map(e => Array(1));
//     let tissueList = []
//     let colNo = 0
//     const cellInfo = [...Array(featuresCount)].map(e => Array(1));

//     for (const [keySpecies, valueSpecies] of Object.entries(data)) {
//         // console.log(keySpecies)
//         for (const [keyTissue, valueTissue] of Object.entries(valueSpecies)) {
//             const tissueCT = valueTissue.celltypes
//             const CTidx = tissueCT.indexOf(cellType)

//             if (CTidx != -1) {
//                 const tissueData = valueTissue.data[0]
//                 const tissueFeatures = valueTissue.features[0]
//                 for (let i = 0; i < featuresCount; i++) {
//                     CTcols[i][colNo] = tissueData[i][CTidx]
//                     const infoDict = {
//                         'species': keySpecies[0].toUpperCase() + keySpecies.slice(1),
//                         'tissue': keyTissue,
//                         'gene': tissueFeatures[i],
//                     }                    
//                     cellInfo[i][colNo] = infoDict
//                 }
//                 const label = `${keySpecies}_${keyTissue}`
//                 tissueList.push(label)
//                 colNo++
//             }
//         }
//     }

//     // {species, tissue, gene}
//     // console.log(cellInfo)

//     return [CTcols, Math.max(...CTcols.flat()), tissueList, cellInfo]
// }

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

    const [yAxis, zVal, cellInfoVals] = configureYAxis(view)
    const xAxis = configureXAxis(view)

    Plotly.restyle('plotDiv2', {y: yAxis, z: zVal, customdata: cellInfoVals}, [...Array(zVal.length).keys()])
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
    const cellInfoData = []
    for (const zVal of plotTraces) {
        cellInfoData.push(zVal.customdata)
        zValues.push(zVal.z)
    }

    let oldOrder = view == 'normal' ? axisOrders.hierarchical.y : axisOrders.normal.y
    let newOrder = view == 'normal' ? axisOrders.normal.y : axisOrders.hierarchical.y

    const yValues = Array(zValues.length).fill(newOrder)

    for (const [idx, z] of zValues.entries()) {
        const newZOrder = []
        const cellInfoOrder = []
        for (const yName of newOrder) {
            newZOrder.push(z[oldOrder.indexOf(yName)])
            cellInfoOrder.push(cellInfoData[idx][oldOrder.indexOf(yName)])
        }
        zValues[idx] = newZOrder
        cellInfoData[idx] = cellInfoOrder
    }
    axisOrders.current.y = newOrder

    return [yValues, zValues, cellInfoData]
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
    ele.classList.toggle('active')
}

const updateNumMatchedOptions = (ele) => {
    const species = getCheckedboxNames('.specOpt:checked')
    const tissues = getCheckedboxNames('.tisOpt:checked')

    const speciesCount = species.length == 0 ? 1 : species.length
    const tissuesCount = tissues.length == 0 ? 1 : tissues.length
    const newMatched = speciesCount * tissuesCount

    const optionParent = document.getElementById('dropContent')
    const curChildCount = optionParent.childElementCount - 1

    const countDiff = Math.abs(curChildCount-newMatched)

    if (curChildCount > newMatched) {
        for (let i = 0; i < countDiff; i++) {
            removeNumMatchedOption()
        }
    } else {
        for (let i = 0; i < countDiff; i++) {
            addNumMatchedOption()
        }
    }
    
    // if (!ele.checked) {
    //     removeNumMatchedOption()
    // } else {
    //     addNumMatchedOption()
    // }

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
    // searchBar.value = featNames.join(", ")
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


    translations = await getTranslation(speciesList, feats)
    // console.log(translations)

    for (const species of speciesList) {
        for (const tissue of tissues) {
            const feature_names = translations.features[species].toString()
            const reqData = {
                feature_names,
                species,
                tissue
            }
            const retData = await apiCall(reqData, '/data/by_celltype')
            data[species][tissue] = retData
        }
    }

    console.log(data)
    return [data, feats]
    ////////////////////////////////////////////////////////////////////////////////

    // // get data for first species
    // const refSpecies = speciesList[0]
    // let refSpeciesFeatures
    // for (const tissue of tissues) {
    //     const reqData = {
    //         feature_names: feats,
    //         species: refSpecies,
    //         tissue
    //     }
    //     const retVal = await apiCall(reqData, '/data/by_celltype')
    //     // console.log(retVal)
    //     data[refSpecies][tissue] = retVal

    //     if (!refSpeciesFeatures) {
    //         refSpeciesFeatures = retVal.features[0]
    //     }
    // }
    // // console.log(speciesList)
    
    // // use corrected features list to translate to other species (if any)
    // // console.log(refSpeciesFeatures)
    // const translateTo = speciesList.slice(1)
    // translations = await getTranslation(refSpecies, refSpeciesFeatures, translateTo)
    // // console.log(translations)

    // for (let i = 1; i < speciesList.length; i++) {
    //     for (const tissue of tissues) {
    //         let feature_names = translations[speciesList[i]].toString()
    //         console.log(feature_names)
    //         const reqData = {
    //             feature_names,
    //             species: speciesList[i],
    //             tissue
    //         }
    //         const retVal = await apiCall(reqData, '/data/by_celltype')
    //         data[speciesList[i]][tissue] = retVal
    //     }
    // }

    ////////////////////////////////////////////////////////////////////////////////

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

const getTranslation = async (species, features) => {
    features = features.split(/,[\s]?/)
    const reqData = {
        species,
        features
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
$(".specOpt").click(function() {updateNumMatchedOptions(this)})


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
    // generatePlot()
});


$("#filterMenuBtn").click(toggleFilters)

/*****************************************************************************
 *                             TEST INTERACTIONS
 *****************************************************************************/

const testFunc = async () => {
    const optionParent = document.getElementById('dropContent')
    console.log(optionParent)
    const childCount = optionParent.childElementCount
    console.log(childCount)
}

const testFunc2 = async () => {
    const reqData = {
        species: ['human', 'mouse'],
        // species: ['mouse'],
        // both: actc1, actn2  |  diff: ins  |  only in mouse: zim1
        features: ['actc1', 'ins', 'Zim1', 'actn2']
        // features: ['actc1', 'actn2']
    }

    const tissueList = ['Lung']

    const [translation, features] = await apiCall(JSON.stringify(reqData), '/data/getHomolog')

    const yLabel = []
    for (let i = 0; i < Object.values(translation)[0].length; i++) {
        const label = []
        for (const [keySpecies, valueSpecies] of Object.entries(translation)) {
            if (valueSpecies[i] != null) {
                label.push(valueSpecies[i])
            }
        }

        yLabel.push(label.join(" || "))
    }

    let data = {}
    for (const species of reqData.species) {
        data[species] = {}
    }

    for (const species of reqData.species) {
        for (const tissue of tissueList) {
            const feature_names = features[species].toString()
            const reqData2 = {
                feature_names,
                species,
                tissue
            }
            const retData = await apiCall(reqData2, '/data/by_celltype')
            data[species][tissue] = retData
        }
    }

    const allCelltypes = getAllCellTypes(data)
    console.log(allCelltypes)

    // console.log(data)
    
    const traceData = []
    for (const [idx, celltype] of allCelltypes.entries()) {
        const [CTvals, maxV, tList, cellInfo] = testGetCelltypeTissue(data, celltype, translation, features)
        // console.log(cellInfo)

        const trace = {
            x: [
                Array(tList.length).fill(celltype),
                tList
            ],
            y: yLabel,
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
            customdata: cellInfo,
            hovertemplate: '<b>Celltype:</b> %{x[0]}<br><b>Species:</b> %{customdata.species}<br><b>Tissue:</b> %{customdata.tissue}<br><b>Gene:</b> %{customdata.gene}<br><b>Expression:</b> %{z}',
            // visible: traceVis
        }

        traceData.push(trace)
    }

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
    };

    $('#plotDiv2').empty()
    $('#plotDiv2').removeClass('placeholderDiv')
    Plotly.newPlot('plotDiv2', traceData, layout);
}

const testGetCelltypeTissue = (data, celltype, translation, dataFeatures) => {
    // console.log(celltype)

    const colLength = Object.values(translation)[0].length
    const CTcols = [...Array(colLength)].map(e => Array(1));
    const cellInfo = [...Array(colLength)].map(e => Array(1));
    let colNo = 0
    let tissueList = []

    for (const [keySpecies, valueSpecies] of Object.entries(data)) {
        // console.log(`\t${keySpecies}`)
        const speciesFeatures = dataFeatures[keySpecies]
        const speciesTranslation = translation[keySpecies]
        // console.log(speciesTranslation)
        for (const [keyTissue, valueTissue] of Object.entries(valueSpecies)) {
            // console.log(`\t\t${keyTissue}`)

            const tissueCT = valueTissue.celltypes
            const CTIdx = tissueCT.indexOf(celltype)

            if (CTIdx == -1) {
                continue
            }

            const tissueData = valueTissue.data[0]
            // const tissueFeatures = valueTissue.features[0]
            // console.log(tissueData)

            for (const [idx, feature] of speciesTranslation.entries()) {
                // console.log(idx, feature)
                let cellValue = null
                if (feature != null) {
                    const featurePos = speciesFeatures.indexOf(feature)
                    // console.log(`\tfeaturePos: ${featurePos}\n\thas count: ${tissueData[featurePos][CTIdx]}`)
                    cellValue = tissueData[featurePos][CTIdx]
                }

                const infoDict = {
                    'species': keySpecies[0].toUpperCase() + keySpecies.slice(1),
                    'tissue': keyTissue,
                    'gene': feature != null ? feature : 'None',
                }
                cellInfo[idx][colNo] = infoDict
                CTcols[idx][colNo] = cellValue
            }
            const label = `${keySpecies}_${keyTissue}`
            tissueList.push(label)
            colNo++
        }
    }
    // console.log('\n')
    // console.log(CTcols)

    return [CTcols, Math.max(...CTcols.flat()), tissueList, cellInfo]
}

$("#testBtn").click(testFunc)
$("#testBtn2").click(testFunc)
