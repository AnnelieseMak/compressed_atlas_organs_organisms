let plotData = {}

let testList = []

const plotTemplate = () => {
    console.log('plot template')
    var trace1 = {
        x: [
          ['SF Zoo','SF Zoo','SF Zoo'],
          ['giraffes', 'orangutans', 'monkeys']
        ],
        y: ['y1', 'y2', 'y3'],
        z: [[10,11,112], [13,14,15], [16,17,18]],
        name: '',
        type: 'heatmap'
      };
      
      var trace2 = {
        x: [
          ['LA Zoo','LA Zoo','LA Zoo'],
          ['g', 'o', 'm']
        ],
        y: ['y1', 'y2', 'y3'],
        z: [[0,1,2], [3,null,5], [6,7,8]],
        name: '',
        type: 'heatmap'
      };

      var trace3 = {
        x: [
          ['AU Zoo','AU Zoo','AU Zoo'],
          ['a', 'b', 'c']
        ],
        y: ['y1', 'y2', 'y3'],
        z: [[0,1,2], [3,7,5], [6,null,8]],
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
        },
        yaxis: {
            autorange: "reversed",
        }
      };
      testList = ['SF Zoo', 'LA Zoo', 'AU Zoo']
      
      Plotly.newPlot('plotDiv', data, layout);

    const xTicks = document.getElementsByClassName('xtick2')
    for (let i = 0; i < xTicks.length; i++) {
        console.log(xTicks[i])
        const tickLabel = xTicks[i].children[0].innerHTML
        xTicks[i].onclick = function(){myFunction(tickLabel)}
    }

}

const myFunction = (tickLabel) => {
    if (testList.length == 1) {
        return
    }

    console.log(`clicked: ${tickLabel}`)
    const labelIdx = testList.indexOf(tickLabel)
    console.log(testList, labelIdx)
    testList.splice(labelIdx, 1)
    console.log(testList)

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
    newCT.onclick = function(){myFunction2(newCT)}

    ctListEl.appendChild(newCT)


    var trace1 = {
        x: [
          ['SF Zoo','SF Zoo','SF Zoo'],
          ['giraffes', 'orangutans', 'monkeys']
        ],
        y: ['y1', 'y2', 'y3'],
        z: [[10,11,112], [13,14,15], [16,17,18]],
        name: '',
        type: 'heatmap'
      };
      
      var trace2 = {
        x: [
          ['LA Zoo','LA Zoo','LA Zoo'],
          ['g', 'o', 'm']
        ],
        y: ['y1', 'y2', 'y3'],
        z: [[0,1,2], [3,null,5], [6,7,8]],
        name: '',
        type: 'heatmap'
      };

      var trace3 = {
        x: [
          ['AU Zoo','AU Zoo','AU Zoo'],
          ['a', 'b', 'c']
        ],
        y: ['y1', 'y2', 'y3'],
        z: [[0,1,2], [3,7,5], [6,null,8]],
        name: '',
        type: 'heatmap'
      };
      
    //   var data = [trace1, trace2];
    const data = []
    if (testList.includes('SF Zoo')) {
        data.push(trace1)
    }
    if (testList.includes('LA Zoo')) {
        data.push(trace2)
    }
    if (testList.includes('AU Zoo')) {
        data.push(trace3)
    }

    var layout = {
        showlegend: false,
        xaxis: {
          tickson: "boundaries",
          ticklen: 15,
          showdividers: true,
          dividercolor: 'grey',
          dividerwidth: 2,
        },
        yaxis: {
            autorange: "reversed",
        }
      };

    Plotly.newPlot('plotDiv', data, layout);

    const xTicks = document.getElementsByClassName('xtick2')
    for (let i = 0; i < xTicks.length; i++) {
        console.log(xTicks[i])
        const tickLabel = xTicks[i].children[0].innerHTML
        xTicks[i].onclick = function(){myFunction(tickLabel)}
    }

}

const myFunction2 = (labelElement) => {
    console.log('add to plot')
    // console.log(labelElement)
    
    const ctListParent = document.getElementById('celltypeList')
    testList.push(labelElement.innerHTML)
    labelElement.remove()

    if (ctListParent.childElementCount == 1) {
        ctListParent.style.display = "none"
    }

    var trace1 = {
        x: [
          ['SF Zoo','SF Zoo','SF Zoo'],
          ['giraffes', 'orangutans', 'monkeys']
        ],
        y: ['y1', 'y2', 'y3'],
        z: [[10,11,112], [13,14,15], [16,17,18]],
        name: '',
        type: 'heatmap'
      };
      
      var trace2 = {
        x: [
          ['LA Zoo','LA Zoo','LA Zoo'],
          ['g', 'o', 'm']
        ],
        y: ['y1', 'y2', 'y3'],
        z: [[0,1,2], [3,null,5], [6,7,8]],
        name: '',
        type: 'heatmap'
      };

      var trace3 = {
        x: [
          ['AU Zoo','AU Zoo','AU Zoo'],
          ['a', 'b', 'c']
        ],
        y: ['y1', 'y2', 'y3'],
        z: [[0,1,2], [3,7,5], [6,null,8]],
        name: '',
        type: 'heatmap'
      };
      
    //   var data = [trace1, trace2];
    const data = []
    if (testList.includes('SF Zoo')) {
        data.push(trace1)
    }
    if (testList.includes('LA Zoo')) {
        data.push(trace2)
    }
    if (testList.includes('AU Zoo')) {
        data.push(trace3)
    }

    var layout = {
        showlegend: false,
        xaxis: {
          tickson: "boundaries",
          ticklen: 15,
          showdividers: true,
          dividercolor: 'grey',
          dividerwidth: 2,
        },
        yaxis: {
            autorange: "reversed",
        }
      };

    Plotly.newPlot('plotDiv', data, layout);

    const xTicks = document.getElementsByClassName('xtick2')
    for (let i = 0; i < xTicks.length; i++) {
        console.log(xTicks[i])
        const tickLabel = xTicks[i].children[0].innerHTML
        xTicks[i].onclick = function(){myFunction(tickLabel)}
    }
}

/*****************************************************************************
 *                              USED METHODS
 *****************************************************************************/

const generatePlot = async () => {
    console.log('generate plot')
    
    const species = "mouse"
    // const species = getCheckedbox('.specOpt:checked')
    const tissues = getCheckedbox('.tisOpt:checked')
    console.log(`tissue: ${tissues}\nspecies: ${species}`)

    // tissues.push('Colon')      // , 'Bone Marrow', 'Kidney','Pancreas', 'Tongue'

    const matchOpt = document.getElementById('matchOpt').checked
    console.log(matchOpt)

    const data = await getData(tissues, species)
    // console.log(`data:\n${JSON.stringify(data)}`)
    // console.log(`data:\n${data}`)

    // const lungD = data.Lung
    const tempTis = data[tissues[0]]
    const feats = tempTis.features[0]
    // const heartD = data.Heart
    // const colonD = data.Colon

    const allCellTypes = getAllCellTypes(data)
    // console.log(allCellTypes)

    let traceData = []
    let maxVal = 0
    for (const cellType of allCellTypes) {
        const [CTvals, mv, tissueList, matchCols] = getCellType_Tissue(data, cellType)
        // console.log(CTvals, mv, tissueList, matchCols)

        maxVal = Math.max(maxVal, mv)
        const trace = {
            x: [
                Array(tissueList.length).fill(cellType),
                tissueList
            ],
            y: feats,
            z: CTvals,
            zmin: 0,
            colorscale: 'Reds',
            type: 'heatmap',
            name: '',
            xgap: 3,
            ygap: 3,
        }

        if (cellType == 'macrophage' || cellType == 'basophil' || cellType == 'monocyte') {
            console.log(`${cellType}`)
            console.log(trace)
        }
        // console.log(trace)
        
        if (matchOpt && !matchCols) {
            continue
        }

        traceData.push(trace)
    }

    // sets zmax to overall max for shared scale
    for (const trace of traceData) {
        trace.zmax = maxVal
    }

    // console.log(traceData[4])

    var layout = {
        showlegend: false,
        autosize: true,
        automargin: true,
        xaxis: {
            tickson: "boundaries",
            ticklen: 15,
            showdividers: true,
            dividercolor: 'grey',
            dividerwidth: 2
        },
        yaxis: {
            autorange: "reversed",
        }
    };

    // const testData = [traceData[3], traceData[4]]
    // Plotly.newPlot('plotDiv', testData, layout);

    Plotly.newPlot('plotDiv', traceData, layout);


    const xTicks = document.getElementsByClassName('xtick2')

    console.log(`xTicks`)
    console.log(xTicks)
    for (let i = 0; i < xTicks.length; i++) {
        const tickLabel = xTicks[i].children[0].innerHTML
        xTicks[i].onclick = function(){collapsePlot(tickLabel)}
    }


    
    // const xTicks = document.getElementsByClassName('xtick2')
    // console.log(xTicks)

    // for(let i = 0; i < xTicks.length; i++) {
    //     console.log(xTicks[i])
    //     xTicks[i].style.color = 'red'
    //     xTicks[i].onclick = function() {
    //         // console.log(`xTick: ${xTicks[i].textContent}`)
    //         console.log('clicked')
    //     }
    // }

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

}

const collapsePlot = (tickLabel) => {
    console.log(`collapse plot: ${tickLabel}`)
}

// return unique celltypes
const getAllCellTypes = (data) => {
    let allCellTypes = []

    for (const [key, value] of Object.entries(data)) {
        allCellTypes.push(...value.celltypes)
    }

    allCellTypes = [...new Set(allCellTypes)]

    return allCellTypes
}

/*********************
        GET CELL TYPE DATA OF EACH TISSUE, INCLUDES NULL COLUMNS 
*********************/
const getCellType_Tissue = (data, cellType) => {
    console.log('\t\t\t\t\t\t\t\tFUNCTION: getCellType_Tissue')
    // console.log(`cellType: ${cellType}`)
    const featuresCount = 16
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

    let matched = true
    // if (colNo != Object.keys(data).length) {
    if (colNo < 2) {
        matched = false
    }

    if (cellType == 'macrophage') {
        console.log(CTcols)
    }

    // console.log(CTcols.flat())

    return [CTcols, Math.max(...CTcols.flat()), tissueList, matched]
}

const getData = async (tissues, species) => {
    console.log(`tissue: ${tissues}\nspecies: ${species}`)
    let data = {}

    for (const tissue of tissues) {
        const reqData = {
            feature_names: "Actc1,Actn2,Myl2,Myh7,Col1a1,Col2a1,Pdgfrb,Pecam1,Gja5,Vwf,Ptprc,Ms4a1,Gzma,Cd3d,Cd68,Epcam",
            species: species,
            tissue
        }
        console.log(reqData)
        const retVal = await apiCall(reqData)
        data[tissue] = retVal
        console.log(data)
    }

    return data
}

const getCheckedbox = (loc) => {
    const checked = Array.from(document.querySelectorAll(loc))

    for (const [idx, el] of checked.entries()) {
        checked[idx] = el.value
    }
    return checked
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

/*****************************************************************************
 *                                INTERACTIONS
 *****************************************************************************/

//temp plot button
$("#plotBtn").click(plotTemplate)

// get data button
// $("#getDataBtn").click()

$("#pBtn").click(generatePlot)

// on page load
$(document).ready(function() {
    console.log('page load');
});