<template>
  <div ref="root">
    <TopColors :data="data.length?Object.entries(data[0]).map((a,i)=>({color:color[i],name:a[0]})):[]"/>
    <svg :width="width" :height="height" ref="svg">

    </svg>
  </div>
</template>

<script>
import * as d3 from "d3";
import TopColors from "~/components/d3Comps/TopColors.vue";
import chart_mixin from "~/assets/chartTemplate/mixin";

export default {
    mixins:[chart_mixin],
    data() {
      return {
        color:["#fdc900", "#ddd", "#7e7e7e", "#ffde99"]
      }
    },
    methods: {
        render() {

        const body = this.svg.append("g");
        const radius = Math.min(this.width, this.height) / 2;
        body.attr("transform", `translate(${this.width / 2}, ${this.height / 2})`);
        const color = d3.scaleOrdinal()
            .range(this.color);
        const pie = d3.pie()
            .value(d=>d[1]);
        const data_ready = pie(Object.entries(this.data[0]));

        const cs = body
            .selectAll("whatever")
            .data(data_ready)
            .join("path")
            .attr("d", d3.arc()
            .innerRadius(0)
            .outerRadius(radius))
            .attr("fill", function(d) { return (color(d.data[1])); });

        }
    },
    components: { TopColors }
}
</script>

<style lang="less">
@import url("~/assets/chartTemplate/global.less");
    .selector {
        width:100%;
        display: flex;
        gap: 1rem;
        justify-content: center;
        align-items: center;
        padding: .5em 0;
        margin-bottom: 1rem;
        .item {
            height: 1em;
            line-height: 1em;
            display: flex;
            gap:.5rem;
        }
    }
</style>
