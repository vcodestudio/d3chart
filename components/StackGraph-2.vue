<template>
  <div ref="root" class="root">
    <p class="title">{{title}}</p>
    <div v-if="d == 3" class="tabs">
      <input type="radio" v-model="tab" v-for="(item,i) in tabs" :value="i" :key="`eng-${i}-sel`">
      <div v-for="(item,i) in tabs" :key="`eng-${i}`" @click="update(i)" :class="(tab == i)?'selected':''">
        {{item}}
      </div>
    </div>
    <p class="desc">{{desc}}</p>
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
      default() {
        return ["#80140F","#CC322C","#CDD7E8","#9DB3E0","#636696"]
      }
    },
    line:{
      default:true
    },
    title:{
      default:""
    },
    desc:{
      default:""
    },
    d:{
      default:2
    }
  },
  data() {
    return {
      total: "0",
      tabs:[],
      tab:0,
    }
  },
  methods:{
    render() { //최대값 구하기 + 사이즈 조정 대응
      const margin = [120,120];
      const cap = 220
      const gap = this.gap

      const subgroups = this.data.columns.slice(this.d-1);
      const grp = this.data.columns[this.d-2];
      const groups = d3.map(this.data,d=>d[grp]);

      let data = this.data;
      if(this.d == 3) {
        const tgrp = data.columns[0];
        const tabs = [...new Set(data.map(a=>a[tgrp]))];
        this.tabs = tabs;
        data = data.filter(a=>a[tgrp] == tabs[this.tab])
      }

      const y = d3.scaleBand()
      .domain(groups)
      .range([0,this.height - margin[1]])

      const Left = this.svg.append("g")
      .style("transform",`translate(${margin[0] - gap}px,0)`)
      const axisLeft = Left.call(d3.axisLeft(y).tickSize(0));

      const stack = d3.stack()
      .keys(groups)
      (data)

      console.log("stack",data,stack);

      const bar = this.svg.append("g")
      .data(stack)
      .enter().append("g")
        .attr("name",d=>d)


      this.update = (idx)=>{
          // this.tab = idx;
          // let data = Object.entries(this.data[idx])
          // if(this.d == 2) data = data.slice(1)

          // y
          // .domain([0,100])

          // x
          // .domain(groups)
          // .range([0,this.width])

          // xsub
          // .domain(subgroups)
          // .range([0,x.bandwidth()])

          // Bottom.transition().duration(300).ease(d3.easeQuadOut).call(d3.axisBottom(x).tickSize(0));

          // bars_
          // .selectAll("rect")
          //   .attr("x",d=>xsub(d.key))
          //   .attr("width",xsub.bandwidth())
      };

      this.comp.onIntersection(()=>{
        // bars
        // .data(data)
        // .enter()
        // .selectAll("rect")
        //   .transition().duration(600).ease(d3.easeQuadOut)
        //   .delay((d,i)=>i*100)
        //   .attr("y",d=>y(d.value))
        //   .attr("height",d=>this.height - ywidth - y(d.value))
      });

    }
  }
}
</script>

<style lang="less" scoped>
  .root {
    position: relative;
    .title {
      text-align: center;
      font-weight: 700;
    }
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
      margin-bottom: 1rem;
      align-items: center;
      justify-content: center;
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

    svg {
      .innerRect {
        color: #fff;
      }
    }
  }
</style>
