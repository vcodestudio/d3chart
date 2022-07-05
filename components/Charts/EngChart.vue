<template>
  <div ref="root" class="root">
    <div>
      <slot></slot>
    </div>
    <div v-if="d !== 2" class="total">
      Total of {{total}}
    </div>
    <div v-if="d == 2" class="tabs">
      <input type="radio" v-model="tab" v-for="(item,i) in tabs" :value="i" :key="`eng-${i}-sel`">
      <div v-for="(item,i) in tabs" :key="`eng-${i}`" @click="update(i)" :class="(tab == i)?'selected':''">
        {{item}}
      </div>
    </div>
    <svg :width="width" :height="height" ref="svg"></svg>
    <p class="number">Number of {{name}}</p>
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
    }
  },
  data() {
    return {
      color: "#E8A440",
      total: "0",
      tabs:[],
      tab:0,
    }
  },
  methods:{
    render() {
      const ywidth = 120
      const right = 220
      const gap = this.gap
      let data = Object.entries(this.data[0]);

      if(this.d == 2) {
        data = data.slice(1);
        const subg = this.data.columns[0];
        this.tabs = this.data.map(a=>a[subg]);
      }

      const y = d3
      .scaleBand()
      .domain(data.map(a=>a[0]))
      .range([0,this.height])
      .padding(.1)

      this.total = this.toLocale(d3.sum(data.map(a=>a[1])));

      const x = d3
      .scaleLinear()
      .domain([0,d3.max(data.map(a=>parseFloat(a[1])))])
      .range([0,this.width - right])

      //drawer

      const bars = this.svg
      .append("g")
      .selectAll("whatever")
      .data(data)
      .join("rect")
      .attr("x",ywidth)
      .attr("y",d=>y(d[0]))
      .attr("width",0)
      .attr("height",y.bandwidth())
      .attr("fill",this.color)

      const txts = this.svg
      .append("g")

      let txts_ = txts
      .selectAll("whatever")
      .data(data)
      .join("text")
      .attr("x",ywidth + gap)
      .attr("y",d=>y(d[0])+y.bandwidth()*.5)
      .attr("dominant-baseline","central")
      .text(d=>this.toLocale(d[1]))
      // .style("transform","translate(0,.5em)")

      const left = this.svg.append("g")
      .attr("class","axisY")
      .style("transform",`translate(${ywidth - gap}px,0)`)

      left.call(d3.axisLeft(y).tickSize(0));
      const vobj = this;

      this.update = (idx)=>{
          this.tab = idx;
          let data = Object.entries(this.data[idx])
          if(this.d == 2) data = data.slice(1)
          x
          .domain([0,d3.max(data.map(a=>parseFloat(a[1])))])
          .range([0,this.width - right])

          y.domain(data.map(a=>a[0]))
          left.call(d3.axisLeft(y).tickSize(0));
          bars
          .data(data)
          .transition().duration(300).ease(d3.easeQuadOut)
          .attr("x",ywidth)
          .attr("y",d=>y(d[0]))
          .attr("width",d=>x(d[1]))
          .attr("height",y.bandwidth())
          txts
          .selectAll("text")
          .data(data)
          .transition().duration(300).ease(d3.easeQuadOut)
          .attr("x",d=>x(d[1]) + ywidth + gap)
          .attr("y",d=>y(d[0])+y.bandwidth()*.5)
          .attr("dominant-baseline","central")
          .text(d=>this.toLocale(d[1]))
          // this.animate();
      };

      this.comp.onIntersection(()=>{
        bars
        .transition().duration(300).ease(d3.easeQuadOut)
        .delay((d,i)=>500 + 100*i).attr("width",d=>x(d[1]));
        txts_
        .transition().duration(300).ease(d3.easeQuadOut)
        .delay((d,i)=>500 + 100*i).attr("x",d=>x(d[1]) + ywidth + gap);
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
