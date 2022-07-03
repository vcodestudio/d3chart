<template>
  <div id="test">

  </div>
</template>

<script>
import * as d3 from "d3";
export default {
    data() {
        return {
            x:[30,30,45,20,10,500,300,200,100],
            y:["banana","apple","can","pensil"]
        }
    },
    mounted() {
        const width = window.innerWidth, height = window.innerHeight;
        const svg = d3.select("#test")
        .append("svg")
        .attr('width',width)
        .attr('height',height);

        const vobj = this;
        let vals = this.y.map((d,i)=>{return {name:d,val:this.x[i]}});

        const x = d3.scaleBand()
                .domain(vals)
                .range([0,width])
                .padding(.3)
                .align(.5)

        const bar = svg
        .append('g')
        .selectAll("bar")
        .data(vals)
        .join("rect")
        .attr("x",d=>x(d))
        .attr("y",0)
        .attr("width",x.bandwidth())
        .attr("height",0)
        .attr("fill","#fdc900")

        const texts = svg.append('g')
        .selectAll('texts')
        .data(vals)
        .join('text')
        .attr('x',d=>x(d))
        .attr('y',d=>0)
        .style('width',x.bandwidth())
        .style('text-align','center')
        .text(d=>d.name)

        const line = svg
        .append('path')
        .datum(vals)
        .attr("d",d3.line()
        .x(d=>x(d)+.5*x.bandwidth())
        .y(d=>d.val)
        )
        .attr("stroke","#000")
        .attr("stroke-width",3)
        .attr("fill","none")

        const length = line.node().getTotalLength();

        line.attr('stroke-dasharray',`${length} ${length}`)
        .attr('stroke-dashoffset',length)

        const circle = svg
        .append('g')
        .selectAll('circles')
        .data(vals)
        .join('circle')
        .attr("cx",d=>x(d)+x.bandwidth()*.5)
        .attr("cy",d=>d.val)
        .attr("r","0rem")
        .attr("fill","#fff")
        .attr("stroke","#000")
        .attr("stroke-width",3)

        const text = svg.append("g")
        .style("transform",`translate(0,${height - 150}px)`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("text-anchor","middle");

        const trans = d3.transition()
        .ease(d3.easeQuadOut)
        .duration(1000)

        line.transition(trans)
        .delay(1000)
        .attr('stroke-dashoffset',0);

        circle.transition(trans)
        .delay((d,i)=>1000+i*200)
        .attr("r","1rem")

        bar.transition(trans)
        .delay((d,i)=>1000+i*200)
        .attr("height",(d,i)=>d.val);

        texts.transition(trans)
        .delay((d,i)=>1000+i*200)
        .attr("y",d=>d.val+15)

        setInterval(()=>{
            vobj.x = vobj.x.map(d=>d+10);
        },1000)
    }
}
</script>

<style>

</style>