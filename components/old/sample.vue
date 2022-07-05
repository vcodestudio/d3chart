<template>
    <div id="barchart">
        
    </div>
</template>

<script>
import * as d3 from "d3";
export default {
    mounted(){
        const margin = {top: 30, right: 30, bottom: 70, left: 60},
        width = window.innerWidth - margin.left - margin.right,
        height = window.innerHeight - margin.top - margin.bottom;

        //canvas
        const svg = d3.select("#barchart")
        .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        //fetch
        d3.csv("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/7_OneCatOneNum_header.csv").
        then( function(data) {

            //draw
            const x = d3.scaleBand()
            .range([ 0, width ])
            .domain(data.map(d => d.Country))
            .padding(0.2);
            
            svg.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(d3.axisBottom(x))
            .selectAll("text")
            .style("text-anchor", "middle");

        // Add Y axis
        const y = d3.scaleLinear()
        .domain([0, 13000])
        .range([ height, 0]);
        
        svg.append("g")
        .call(d3.axisLeft(y));

        // Bars
        svg.selectAll("mybar")
        .data(data)
        .join("rect")
            .attr("x", d => x(d.Country))
            .attr("y", d => y(d.Value))
            .attr("width", x.bandwidth())
            .attr("height", d => height - y(d.Value))
            .attr("fill", "#69b3a2")
        })

    }
}
</script>