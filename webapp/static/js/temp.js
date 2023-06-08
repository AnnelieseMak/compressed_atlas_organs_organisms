let plotData = {}

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
      
      var data = [trace1, trace2];
      console.log(data)

      var layout = {
        showlegend: false,
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
      
      Plotly.newPlot('plotDiv', data, layout);
}

const generatePlot = async () => {
    console.log('generate plot')
    
    const species = "mouse"
    // const species = getCheckedbox('.specOpt:checked')
    const tissues = getCheckedbox('.tisOpt:checked')
    console.log(`tissue: ${tissues}\nspecies: ${species}`)

    // tissues.push('Colon')      // , 'Bone Marrow', 'Kidney','Pancreas', 'Tongue'

    const data = await getData(tissues, species)
    // console.log(`data:\n${JSON.stringify(data)}`)
    // console.log(`data:\n${data}`)

    const lungD = data.Lung
    const feats = lungD.features[0]
    // const heartD = data.Heart
    // const colonD = data.Colon

    const allCellTypes = getAllCellTypes(data)
    // console.log(allCellTypes)

    let traceData = []
    let maxVal = 0
    for (const cellType of allCellTypes) {
        const [CTvals, mv] = getCellType_Tissue(data, cellType, tissues.length)
        maxVal = Math.max(maxVal, mv)
        const trace = {
            x: [
                Array(tissues.length).fill(cellType),
                tissues
            ],
            y: feats,
            z: CTvals,
            zmin: 0,
            colorscale: 'Reds',
            type: 'heatmap',
            name: ''
        }

        traceData.push(trace)
    }

    for (const trace of traceData) {
        trace.zmax = maxVal
    }

    var layout = {
        showlegend: false,
        autosize: true,
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
      
    Plotly.newPlot('plotDiv', traceData, layout);

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

// return unique celltypes
const getAllCellTypes = (data) => {
    let allCellTypes = []

    for (const [key, value] of Object.entries(data)) {
        allCellTypes.push(...value.celltypes)
    }

    allCellTypes = [...new Set(allCellTypes)]

    return allCellTypes
}

const getCellType_Tissue = (data, cellType, tissueCount) => {
    console.log('\t\t\t\t\t\t\t\tFUNCTION: getCellType_Tissue')
    // console.log(`cellType: ${cellType}`)
    const featuresCount = 16
    const CTcols = [...Array(featuresCount)].map(e => Array(tissueCount).fill(null));
    
    for (const [idx, [key, value]] of Object.entries(data).entries()) {
        // console.log(idx, key, value)
        const tissueCT = value.celltypes
        const CTval = tissueCT.indexOf(cellType)

        if (CTval != -1) {
            const tissueData = value.data[0]
            // console.log(`tissueData: ${JSON.stringify(tissueData)}`)
            // console.log(`${key} data at ${CTval}: ${tissueData[0][CTval]}`)
            for (let i = 0; i < featuresCount; i++) {
                // console.log(`[${i}][${CTval}]: ${tissueData[i][CTval]}`)
                CTcols[i][idx] = tissueData[i][CTval]
            }
        }
    }

    // console.log(CTcols.flat())

    return [CTcols, Math.max(...CTcols.flat())]
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