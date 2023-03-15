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

function makePlot() {
    var data = [{
        type: "treemap",
        labels: ["Eve", "Cain", "Seth", "Enos", "Noam", "Abel", "Awan", "Enoch", "Azura"],
        parents: ["", "", "", "", "", "Cain", "Cain", "", "" ],
        values: [11, 12, 40, 14, 15, 5, 6, 7, 8],
        marker: {
            colorscale: 'Reds',
            showscale: true
        }
    }]

    var layout = [{
        xaxis: {
            title: 'celltype',
            showgrid: false,
            zeroline: false
        },
        yaxis: {
            title: 'genes',
            showgrid: false,
            zeroline: false
        },
    }]


  
    Plotly.newPlot('plotDiv', data, layout)
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
        feature_names: "Actc1,Actn2,Myl2,Myh7,Col1a1,Col2a1,Pdgfrb,Pecam1,Gja5,Vwf,Ptprc,Ms4a1,Gzma,Cd3d,Cd68,Epcam",
        species: species,
        tissue: tissue,
    }

    console.log(requestData)

    $.ajax({
        type: 'GET',
        url:'/data/by_celltype',
        data: $.param(requestData),
        success: function(result) {
            // Store global variable
            plotData = {
                'result': result,
            };

            makePlot();
        },
        error: function (e) {
            console.log(e);
            alert('Error: Could not find some feature names.')
        },
    });
}


// temp button
$("#tempButton").click(toggleChart);

// on page load
$(document).ready(function() {
    console.log('page load');
    AssembleAjaxRequest();
});