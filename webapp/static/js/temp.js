let plotData = {}

// function makePlot() {
//     const plotDiv = document.getElementById("plotDiv");

//     var xAxis = ['ct1', 'ct2','ct3', 'ct4','ct5']
//     var yAxis = ['g1', 'g2', 'g3', 'g4', 'g5']
//     var zAxis = [1, 2, 3, 4, 5]


//     var data = [{
//         x: xAxis,
//         y: yAxis,
//         z: zAxis,
//         type: 'heatmap',
//         colorscale: 'red',
//         // showscale: false
//     }];

//     var layout = {
//         title: "test heatmap",
//         xaxis: {
//             title: "CELL TYPES"
//         },
//         yaxis: {
//             title: "GENES"
//         }
//     }

//     // var layout = {
//     //     title: 'Sales Growth',
//     //     xaxis: {
//     //         title: 'Year',
//     //         showgrid: false,
//     //         zeroline: false
//     //     },
//     //     yaxis: {
//     //         title: 'Percent',
//     //         showline: false
//     //     }
//     // };

//     var data2 = [{
//         values: [19, 26, 55],
//         labels: ['Residential', 'Non-Residential', 'Utility'],
//         type: 'pie'
//     }];

//     var dd = [data, data2]

//     Plotly.newPlot(plotDiv, dd, layout);
//     // let [val1, val2] = axisVals();
//     // console.log(val1, val2)
//     // let [xAxis, yAxis] = setAxis("original");
//     // console.log(xAxis)
//     // console.log(yAxis)
// }


const makePlot = () => {
    console.log(plotData)
}

function setAxis(order) {
    const data = plotData['result']
    console.log(data)
    let xAxis, yAxis;
    if (order == "original") {
        xAxis = data.celltypes
        yAxis = data.features
    }

    return [xAxis, yAxis];
}

function toggleChart() {
    console.log('toggling')
    const plotDiv = document.getElementById('plotDiv');

    // var data = [{
    //     values: [19, 26, 55],
    //     labels: ['Residential', 'Non-Residential', 'Utility'],
    //     type: 'pie'
    // }];
      
    // var layout = {
    //     height: 400,
    //     width: 500
    // };

    // Plotly.addTraces(plotDiv, )

}   

const goBtn = () => {
    console.log("go btn")
    let speciesCB = document.getElementsByClassName("speciesCB")
    let speciesChecked = []
    for (let i = 0; i < speciesCB.length; i++) {
        console.log(speciesCB[i].checked)
        if (speciesCB[i].checked) {
            speciesChecked.push(speciesCB[i].name)
        }
    }

    console.log(speciesChecked)

    let requestData = {
        species: speciesChecked
    }

    console.log(requestData)

    $.ajax({
        type: 'GET',
        url:'/data/celltype_many',
        data: $.param(requestData),
        success: function(result) {

            console.log('results: ', result)
        },
        error: function (e) {
            console.log(e);
            alert('Error: Could not find some feature names.')
        },
    });
}

const plotBasic = () => {
    console.log('plot basic')
    const plotDiv = document.getElementById('plotDiv')

    var trace1 = [
        {
            x: [
                ['LABEL 1, LABEL 1, LABEL 1'],
                ['SUB 1-1, SUB 1-2, SUB 1-3']
            ],
            y: ['x-name, y-name, z-name'],
            z: [[0.123, 0.776, 0.987],[0.123, 0.340, 0.752],[0.81, 0.5, 0.987]],
            type: 'heatmap'
        }
    ]

    var trace2 = [
        {
            x: [
                ['LABEL 2, LABEL 2, LABEL 2'],
                ['SUB 2-1, SUB 2-2, SUB 2-3']
            ],
            y: ['x-name, y-name, z-name'],
            z: [[0.123, 0.776, 0.987],[0.123, 0.340, 0.752],[0.81, 0.5, 0.987]],
            type: 'heatmap'
        }
    ]
    var data = [trace1, trace2]
    // var data = [
    //     {
    //         x: ['L1', 'L2', 'L3'],
    //         y: ['Y1', 'Y2',' Y3'],
    //         z: [[0.123, 0.776, 0.987],[0.123, 0.340, 0.752],[0.81, 0.5, 0.987]],
    //         type: 'heatmap'
    //     }
    // ]

    var layout = {
        showlegend: false,
        xaxis: {
          tickson: "boundaries",
          ticklen: 15,
          showdividers: true,
          dividercolor: 'grey',
          dividerwidth: 2
        }
      };

    
    Plotly.newPlot(plotDiv, data, layout)
}

// ajax
function AssembleAjaxRequest() {
    console.log('ajax request');

    // let featureNames;
    // if (featurestring !== "") {
    //     featureNames = featurestring;
    // } else {
    //     featureNames = $('#searchFeatures').val();
    // }
    
    let requestData = {
        // feature_names: "Actc1,Actn2,Myl2,Myh7,Col1a1,Col2a1,Pdgfrb,Pecam1,Gja5,Vwf,Ptprc,Ms4a1,Gzma,Cd3d,Cd68,Epcam",
        species: species,
    }

    console.log('request data: ', requestData)

    $.ajax({
        type: 'GET',
        url:'/data/celltype_many',
        data: $.param(requestData),
        success: function(result) {

            console.log('results: ', result)
            // Store global variable
            // plotData = {
            //     'result': result,
            // };

            // makePlot();
        },
        error: function (e) {
            console.log(e);
            alert('Error: Could not find some feature names.')
        },
    });
}

const test = () => {
    
    var trace1 = {
        x: [
          ['CELL TYPE 1','CELL TYPE 1','CELL TYPE 1'],
        //   ['SF Zoo','SF Zoo','SF Zoo'],
          ['giraffes', 'orangutans', 'monkeys']
        ],
        y: ['y1', 'y2', 'y3'],
        z: [[0,1,2], [3,4,5], [6,7,8]],
        name: '',
        // type: 'bar'
        type: 'heatmap'
      };
      
      var trace2 = {
        x: [
          ['LA Zoo','LA Zoo','LA Zoo'],
          ['giraffes', 'orangutans', 'monkeys']
        ],
        y: ['y1', 'y2', 'y3'],
        z: [[0,1,2], [3,null,5], [6,7,8]],
        name: '',
        // type: 'bar'
        type: 'heatmap'
      };
      
      var data = [trace1, trace2];
      var layout = {
        showlegend: false,
        xaxis: {
          tickson: "boundaries",
          ticklen: 15,
          showdividers: true,
          dividercolor: 'grey',
          dividerwidth: 2
        }
      };
      
      Plotly.newPlot('plotDiv', data, layout);
    //   Plotly.newPlot('plotDiv', data);
}

const getData = async () => {
    console.log('getting data')

    const tissues = ["Lung", "Heart"]
    let tissueData = {}

    for (let t = 0; t < tissues.length; t++) {

        let res = await dCall(tissues[t])
        console.log('ret res: ', res)
        tissueData[tissues[t]] = res
        console.log(`added: ${JSON.stringify(tissueData)}`)
        
    }

    console.log(`all data: ${tissueData}`)
    console.log(`lung data: ${tissueData.Lung}`)
    console.log(`heart data: ${tissueData.Heart}`)
}

const dCall = (tissue) => {
    let requestData = {
            feature_names: "Actc1,Actn2,Myl2,Myh7,Col1a1,Col2a1,Pdgfrb,Pecam1,Gja5,Vwf,Ptprc,Ms4a1,Gzma,Cd3d,Cd68,Epcam",
            species: species,
            // tissue: JSON.stringify(tissues)
            tissue: tissue
        }
    
    return new Promise(function(resolve, reject) {
        $.ajax({
        type:'GET',
        // url:'/data/celltype_many',
        url:'/data/by_celltype',
        data: $.param(requestData),
        success: function(result) {
            // console.log(tissues[t], " result: ", result)
            // tissueData[tissues[t]] = result
            // console.log(tissueData)
            console.log(result)
            resolve(result)
        },
        // error: function (e) {
        //   alert('Error: Could not find orthologs for '+featureNames+'.')
        // }
    })})
}


// temp button
$("#tempButton").click(toggleChart);

// go button
$("#goBtn").click(goBtn);

//temp plot button
// $("#plotBtn").click(plotBasic)
$("#plotBtn").click(test)

// get data button
$("#getDataBtn").click(getData)

// on page load
$(document).ready(function() {
    console.log('page load');
    AssembleAjaxRequest();
});