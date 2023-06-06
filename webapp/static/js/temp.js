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
    
    const tissues = getCheckedbox('.tisOpt:checked')
    // const species = getCheckedbox('.specOpt:checked')
    const species = "mouse"
    console.log(`tissue: ${tissues}\nspecies: ${species}`)

    const data = await getData(tissues, species)
    // console.log(`data:\n${JSON.stringify(data)}`)

    const t1d = data[tissues[0]]
    const t1dFeat = t1d.features
    const t1dCt = t1d.celltypes
    const t1dVal = t1d.data[0]
    console.log(t1dFeat)
    console.log(t1dCt)
    console.log(t1dVal)

    let traceData = []

    for (const [idx, celltype] of t1dCt.entries()) {
        // console.log(idx, celltype)
        // const testVal = Array(2).fill(celltype)
        // console.log(testVal)
        // console.log(t1dVal[])
        console.log(celltype)
        const colVal = getColumn(t1dVal, idx)
        // console.log(colVal)
        // const trace = {
        //     x: [
        //         Array(1).fill(celltype),
        //         [tissues[0]]
        //     ],
        //     y: t1dFeat,
        //     z: t1dVal,
        //     type: 'heatmap',
        //     // name: ''
        // }

        // traceData.push(trace)
    }

    console.log(traceData)

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
      
      Plotly.newPlot('plotDiv', traceData, layout);

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

const getColumn = (data, col) => {
    console.log(`data; ${data}`)
    console.log(`col: ${col}`)
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

// const getData = async () => {
//     console.log('getting data')

//     const reqData = {
//         feature_names: "Actc1,Actn2,Myl2,Myh7,Col1a1,Col2a1,Pdgfrb,Pecam1,Gja5,Vwf,Ptprc,Ms4a1,Gzma,Cd3d,Cd68,Epcam",
//         species: 'mouse',
//         tissue: 'Lung'
//     }

//     apiCall(reqData)

    // const tissues = ["Lung", "Heart"]
    // let tissueData = {}

    // for (let t = 0; t < tissues.length; t++) {

    //     let res = await dCall(tissues[t])
    //     console.log('ret res: ', res)
    //     tissueData[tissues[t]] = res
    //     console.log(`added: ${JSON.stringify(tissueData)}`)
        
    // }

    // console.log(`all data: ${JSON.stringify(tissueData)}`)
    // console.log(`lung data: ${tissueData.Lung}`)
    // console.log(`heart data: ${tissueData.Heart}`)
// }

// const dCall = (tissue) => {
//     let requestData = {
//             feature_names: "Actc1,Actn2,Myl2,Myh7,Col1a1,Col2a1,Pdgfrb,Pecam1,Gja5,Vwf,Ptprc,Ms4a1,Gzma,Cd3d,Cd68,Epcam",
//             species: species,
//             // tissue: JSON.stringify(tissues)
//             tissue: tissue
//         }
    
//     return new Promise(function(resolve, reject) {
//         $.ajax({
//         type:'GET',
//         url:'/data/by_celltype',
//         data: $.param(requestData),
//         success: function(result) {
//             console.log(result)
//             resolve(result)
//         },
//     })})
// }

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

// const apiCall = (body) => {
//     return new Promise((resolve, reject) => {
//         const init = {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify(body)
//         }

//         fetch('../fetchCalls.php', init)
//             .then(response => response.json())
//             .then(data => {
//                 resolve(data);
//             })
//             // .catch((error) => {
//             //     console.log('something went wrong :(\n' ,error);
//             // })
//     })
// }

// // login
// const practitionerLogin = (username, password) => {
//     return apiCall({
//         action: 'login',
//         username,
//         password
//     })
// }

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