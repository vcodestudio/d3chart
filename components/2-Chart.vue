<template>
  <div ref="chart">
    <p ref="title" v-if="title">
        {{title}}
    </p>
    <TopColors :data="data.length?Object.entries(data[0]).map((a,i)=>{return {color:color[i],name:a[0]};}):[]"/>
    <svg :width="width" :height="height">
        <g name="left"></g>
        <g name="body">
            <!--content-->
        </g>
        <g name="bottom"></g>
    </svg>
  </div>
</template>

<script>
import * as d3 from "d3";
import D3Comp from "../assets/chartTemplate/comp";
import TopColors from "./d3Comps/TopColors.vue";
import ChartMixin from "../assets/chartTemplate/chart_mixin";

export default {
    mixins:[ChartMixin],
    methods: {
        render() {
        const svg = d3.select(this.$refs.chart)
                    .select("svg");
        const body = svg.select("g[name=body]");
        const x = d3.scaleBand()
            .domain(this.data.map(d => d.name))
            .range([this.padding[1], this.width - this.padding[1]])
            .padding(0.3);
        const ydt = this.data.map(d => d.bval).sort((a, b) => a - b);
        const y = d3.scaleLinear()
            .domain([0, ydt[ydt.length - 1]])
            .range([this.innerHeight, this.padding[0]]);
        const yp = d3.scaleLinear()
            .domain([0, 100])
            .range([this.innerHeight, this.padding[0]]);
        const comp = new D3Comp({
            container: this.$refs.chart,
            style: "slope",
            svg,
            x,
            padding:this.padding,
            y,
        });
        // const xtxt = comp.Band();
        // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
        const radius = Math.min(this.width, this.height) / 2 - this.padding[0];
        // append the svg object to the div called 'my_dataviz'
        body.attr("transform", `translate(${this.width / 2}, ${this.height / 2})`);
        // Create dummy data
        // set the color scale
        const color = d3.scaleOrdinal()
            .range(this.color);
        // Compute the position of each group on the pie:
        const pie = d3.pie()
            .value(function (d) { return d[1]; });
        const data_ready = pie(Object.entries(this.data[0]));
        // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
        const cs = body
            .selectAll("whatever")
            .data(data_ready)
            .join("path")
            .attr("d", d3.arc()
            .innerRadius(0)
            .outerRadius(radius))
            .attr("fill", function (d) { return (color(d.data[1])); });
        // comp.createToolTip(cs);
        //animation
        comp.setAnimation(function (ref) {
        });
        }
    },
    components: { TopColors }
}
</script>

<style lang="less">
@import url("../assets/chartTemplate/global.less");
    .selector {
        width:100%;
        display: flex;
        gap: 1rem;
        justify-content: center;
        align-items: center;
        padding: .5em 0;
        .item {
            height: 1em;
            line-height: 1em;
            display: flex;
            gap:.5rem;
        }
    }
</style>