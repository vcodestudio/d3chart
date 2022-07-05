<template>
  <div ref="root" class="root">
    <div>
      <slot></slot>
    </div>
    <div v-if="d == 2" class="tabs">
      <input type="radio" v-model="tab" v-for="(item,i) in tabs" :value="i" :key="`eng-${i}-sel`">
      <div v-for="(item,i) in tabs" :key="`eng-${i}`" @click="update(i)" :class="(tab == i)?'selected':''">
        {{item}}
      </div>
    </div>
    <svg :width="width" :height="height" ref="svg"></svg>
  </div>
</template>

<script>
import * as d3 from "d3";
import chart_mixin from "~/assets/chartTemplate/mixin";

export default {
  mixins:[chart_mixin],
  props:{
    name:{
      default:"Media"
    },
    color:{
      default:"#0514D5"
    },
    line:{
      default:false
    },
  },
  data() {
    return {
      total: "0",
      tabs:[],
      tab:0,
    }
  },
  methods:{
    render() {
      const ywidth = 120
      const cap = 220
      const gap = this.gap
      let data = Object.entries(this.data[0]);

      if(this.d == 2) {
        data = data.slice(1);
        const subg = this.data.columns[0];
        this.tabs = this.data.map(a=>a[subg]);
      }

      const x = d3
      .scaleBand()
      .domain(data.map(a=>a[0]))
      .range([0,this.width])
      .padding(.1)

      this.total = this.toLocale(d3.sum(data.map(a=>a[1])));

      const y = d3
      .scaleLinear()
      .domain([0,d3.max(data.map(a=>parseFloat(a[1])))])
      .range([this.height - ywidth,0])

      //drawer

      const bars = this.svg
      .append("g")
      .selectAll("whatever")
      .data(data)
      .join("rect")
      .attr("x",d=>x(d[0]))
      .attr("y",this.height - ywidth)//d=>y(d[1])
      .attr("width",x.bandwidth())
      .attr("height",0)
      .attr("fill",this.color)

      const Bottom = this.svg.append("g")
      .attr("class","axisY")
      .style("transform",`translate(0,${this.height - ywidth + gap}px)`)

      const axis = Bottom.call(d3.axisBottom(x).tickSize(0));
      if(this.line)
        axis.select(".domain").attr("style",`opacity:1;transform:translate(0,-${gap}px)`).attr("stroke-width","2px")

      this.update = (idx)=>{
          this.tab = idx;
          let data = Object.entries(this.data[idx])
          if(this.d == 2) data = data.slice(1)

          y
          .domain([0,d3.max(data.map(a=>parseFloat(a[1])))])

          x
          .domain(data.map(a=>a[0]))
          .range([0,this.width])

          Bottom.transition().duration(300).ease(d3.easeQuadOut).call(d3.axisBottom(x).tickSize(0));
          bars
          .data(data)
          .transition().duration(300).ease(d3.easeQuadOut)
          .attr("x",d=>x(d[0]))
          .attr("width",x.bandwidth())
          .attr("height",d=>((this.height - ywidth)-y(d[1])))
          .attr("y",d=>y(d[1]))
      };

      this.comp.onIntersection(()=>{
        bars
        .transition().duration(300).ease(d3.easeQuadOut)
        .delay((d,i)=>500 + 100*i)
        .attr("height",d=>((this.height - ywidth)-y(d[1])))
        .attr("y",d=>y(d[1]))
      });

    }
  }
}
</script>

<style lang="less" scoped>
  .root {
    position: relative;
    .total {
      position: absolute;
      right: 0;
      top: 0;
    }
    .title {
            text-align: center;
      font-weight: 700;
    }
    .number {
      text-align: right;
    }
    .tabs {
      display: flex;
      & > div {
        border: 1px solid #000;
        text-align: center;
        padding: .5em;
        line-height: 1em;
        border-right:0;
        &.selected {
          background: #000;
          color: #fff;
        }
        &:last-child {
          border-right: 1px solid #000;
        }
      }
    }
    input[type=radio] {
      display: none;
    }
  }
</style>
