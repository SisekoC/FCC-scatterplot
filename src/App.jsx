import "./App.css"

let url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json"
let req = new XMLHttpRequest()

let values = []

let xScale
let yScale

let width = 800
let height = 600
let padding = 40

let svg = d3.select("svg")

let tooltip = d3.select("#tooltip") // 15. set the tooltip after when have created anad styled it in the html file and styles file.

let drawCanvas = () => {
    svg.attr("width", width)
    svg.attr("height", height)
}

// 2. since Year in our data is represented as a number, we will use scaleLinear
let generateScales = () => {
    xScale = d3.scaleLinear()
                .domain([d3.min(values, (item) => { // 10. set the domain for the min and max of the x-axis. in this case, it's the year
                    return item["Year"]
                }) - 1, d3.max(values, (item) => {
                    return item["Year"]             // 14. subtract and add 1 to min and max to correctly align the point in the graph.
                }) + 1])
                .range([padding, width - padding])

    // 5. generate yAxis
    yScale = d3.scaleTime()
                .domain([d3.min(values, (item) => {
                    return new Date(item["Seconds"] * 1000)
                }), d3.max(values, (item) => {
                    return new Date(item["Seconds"] * 1000)
                })])
                .range([padding, height - padding])
}


let drawPoints = () => {
    // 8. this is where we generate the shape of our graph i.e. points for scatterplot
    svg.selectAll("circle")
        .data(values)
        .enter()
        .append("circle")
        .attr("class", "dot")
        .attr("r", "5")
        .attr("data-xvalue", (item) => {
            return item["Year"]                     // 9. using headings from data that store the data we want
        })
        .attr("data-yvalue", (item) => {
            return new Date(item["Seconds"] * 1000)
        })
        .attr("cx", (item) => {
            return xScale(item["Year"])             //12. "cx" correctly aligns our data points in our graph.
        })
        .attr("cy", (item) => {
            return yScale(new Date(item["Seconds"] * 1000))
        })
        .attr("fill", (item) => {                   //14. changing the colours of the dots using the doping item from the data
            if(item["Doping"] !== '') {
                return "red"
            } else {
                return "cyan"
            }
        })
        .on("mouseover", (item) => {
            tooltip.transition()                                //16. we set our mouse when hover over a point
                    .style("visibility", "visible")

            if(item["Doping"] != "") {
                tooltip.text(item["Year"] + " - " + item["Name"] + " - " + item["Time"] + " - " + item["Doping"])
            } else {
                tooltip.text(item["Year"] + " - " + item["Name"] + " - " + item["Time"] + " - " + "No Allegations")
            }

            tooltip.attr("data-year", item["Year"])
        })
        .on("mouseout", (item) => {
            tooltip.transition()
                    .style("visiblity", "hidden")
        })

           
}     

let generateAxes = () => {
    let xAxis = d3.axisBottom(xScale)
                    .tickFormat(d3.format("d")) // 11. to remove the commas in the numbers because they will give us problems later. we convert everything to decimal

    let yAxis = d3.axisLeft(yScale)
                    .tickFormat(d3.timeFormat("%M:%S")) // 13. use timeFormat() since it is time.

    svg.append("g")
        .call(xAxis)
        .attr("id", "x-axis") // 3. from let xAxis to here, we generated axis
        .attr("transform", "translate(0, " + (height - padding) +")") // 4. this line positions our xAxis

    svg.append("g")
        .call(yAxis)
        .attr("id", "y-axis") //6. from let yAxis to here, we generated axis
        .attr("transform", "translate(" + padding + ", 0)") // 7. this line positions our xAxis
}

req.open("GET", url, true)
req.onload = () => {
    values = JSON.parse(req.responseText)
    console.log(values)
    // 1. set order of how this data will be generated
    drawCanvas()
    generateScales()
    drawPoints()
    generateAxes()
}
req.send()