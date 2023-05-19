import Plotly from 'plotly.js-dist';
import * as d3 from 'd3'

function layout(showAxes) {
    return {
        showlegend: false,
        margin: {
            l: 0,
            r: 0,
            b: 0,
            t: 0
        },
        hovermode: showAxes,
        scene: {
            xaxis: {title: {text: 'Green-to-Red'}, visible: showAxes},
            yaxis: {title: {text: 'Blue-to-Yellow'}, visible: showAxes},
            zaxis: {title: {text: 'Lightness'}, visible: showAxes}
        },
        //paper_bgcolor: backgroundColor,
    }
};

function array2rgb(rgbArray) {
    let scaledArray = rgbArray
    //rgbArray.map(rgb=> 255*rgb)
    let [r, g, b] = scaledArray
    return `rgb(${r}, ${g}, ${b})`
}

export function make3dPlot(paintingJson, plotContainerId, showAxes=false) {
    d3.json(paintingJson)
    .then(data => data[0])
    .then(
        data => {
            let x = [], y = [], z = [], 
            text = [], //this will be used in the hover labels
            color=[]

            let lab = data['image_lab']
            let rgb = data['image_rgb']
            lab.forEach(row => {
                row.forEach(coord => {
                    let [l, a, b] = coord
                    x.push(a)
                    y.push(b)
                    z.push(l)
                    let isRed = (a > 0)
                    let isYellow = (b > 0)
                    let aLabel = (isRed? 'Redness' : 'Greenness')
                    let aValue = Math.abs(a.toFixed(1))
                    let bLabel = (isYellow? 'Yellowness' : 'Blueness')
                    let bValue = Math.abs(b.toFixed(1))
                    let lLabel = 'Lightness'
                    text.push(
                        `${lLabel}: ${l.toFixed(1)}<br>` +
                        `${aLabel}: ${aValue}<br>` +
                        `${bLabel}: ${bValue}<br>`
                    )                    
                })
            })
            rgb.forEach(row => {
                row.forEach(
                    coord => {
                        color.push(array2rgb(coord))
                    }
                )
            })
            let dataForPlot = [{
                x, y, z, 
                text, 
                marker: { color }, 
                type: 'scatter3d', 
                mode:'markers',
                hovertemplate: "%{text}" + 
                "<extra></extra>" //this removes the default trace 0 part of the hover label
            }]
            //data = data.filter((entry, index) => index % 50 == 0)
            Plotly.newPlot(plotContainerId, dataForPlot, layout(showAxes))
        }
    )
    .catch(error => console.log(error))

}
