<template>
  <div ref="root">
    <TopColors :data="data.length?Object.entries(data[0]).map((a,i)=>({color:color[i],name:a[0]})):[]"/>
    <svg :width="width" :height="height" ref="svg">

    </svg>
  </div>
</template>

<script>
import * as d3 from "d3";
import TopColors from "./d3Comps/TopColors.vue";
import ChartMixin from "~/assets/chartTemplate/chart_mixin";

export default {
    mixins:[ChartMixin],
    methods: {
        render() {

        const body = this.svg.append("g");
        const radius = Math.min(this.width, this.height) / 2 - this.padding[0];
        body.attr("transform", `translate(${this.width / 2}, ${this.height / 2})`);
        const color = d3.scaleOrdinal()
            .range(this.color);
        const pie = d3.pie()
            .value(function (d) { return d[1]; });
        const data_ready = pie(Object.entries(this.data[0]));
        const x = d3.scaleBand()
                  .domain(Object.entries(this.data[0]).map(a=>a[0]))
                  .range([this.padding[0],this.width - this.padding[0]])
                  .padding(.3);

        const xtxt = this.comp.bandX(x);

        const cs = body
            .selectAll("whatever")
            .data(data_ready)
            .join("path")
            .attr("d", d3.arc()
            .innerRadius(0)
            .outerRadius(radius))
            .attr("fill", function (d) { return (color(d.data[1])); });

        this.comp.setAnimation((ref)=>{
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
