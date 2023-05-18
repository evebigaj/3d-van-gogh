import Plotly from 'plotly.js-dist';
import * as d3 from 'd3'

let  layout = {
    showlegend: false,
    margin: {
        l: 0,
        r: 0,
        b: 0,
        t: 0
    },
    hovermode: false,
    scene: {
        xaxis: {title: {text: 'Redness'}, visible: false},
        yaxis: {title: {text: 'Yellowness'}, visible: false},
        zaxis: {title: {text: 'Lightness'}, visible: false}
    },
    //paper_bgcolor: backgroundColor,
};

function array2rgb(rgbArray) {
    let scaledArray = rgbArray
    //rgbArray.map(rgb=> 255*rgb)
    let [r, g, b] = scaledArray
    return `rgb(${r}, ${g}, ${b})`
}

export function make3dPlot(paintingJson, plotContainerId) {
    d3.json(paintingJson)
    .then(data => data[0])
    .then(
        data => {
            let x = [], y = [], z = [], color=[]

            let lab = data['image_lab']
            let rgb = data['image_rgb']
            lab.forEach(row => {
                row.forEach(coord => {
                    let [l, a, b] = coord
                    x.push(a)
                    y.push(b)
                    z.push(l)
                })
            })
            rgb.forEach(row => {
                row.forEach(
                    coord => {
                        color.push(array2rgb(coord))
                    }
                )
            })
            let dataForPlot = [{x, y, z, marker: { color }, type: 'scatter3d', mode:'markers'}]
            //console.log(data)
            //data = data.filter((entry, index) => index % 50 == 0)
            Plotly.newPlot(plotContainerId, dataForPlot, layout)
        }
    )
    .catch(error => console.log(error))

}
