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
    <TopColors :data="subgroups.map((a,i)=>({color:color[i],name:a}))"/>
  </div>
</template>

<script>
import * as d3 from "d3";
import chart_mixin from "~/assets/chartTemplate/mixin";
import TopColors from '../d3Comps/TopColors.vue';

export default {
  mixins:[chart_mixin],
  components:{TopColors},
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
    },
  },
  data() {
    return {
      total: "0",
      tabs:[],
      tab:0,
      subgroups:[]
    }
  },
  methods:{
    render() { //애니메이션
      const margin = [120,13]
      const gap = this.gap

      const subgroups = this.data.columns.slice(this.d-1);
      const grp = this.data.columns[this.d-2];
      const groups = d3.map(this.data,d=>d[grp]);

      let data = this.data;
      if(this.d == 3) {
          const tgrp = data.columns[0];
          const tabs = [...new Set(data.map(a=>a[tgrp]))];
          this.tabs = tabs;
      }

      data = this.dataSet(this.data,subgroups);

      this.subgroups = subgroups

      const x = d3.scaleLinear()
      .domain([0,100])
      .range([margin[0],this.width])

      const y = d3.scaleBand()
      .domain(groups)
      .range([0,this.height - margin[1]])
      .padding(.1)

      const Left = this.svg.append("g")
      .style("transform",`translate(${margin[0] - gap}px,0)`)
      const axisLeft = Left.call(d3.axisLeft(y).tickSize(0));

      let stack = d3.stack()
      .keys(subgroups)
      (data)

      const color = d3.scaleOrdinal()
      .domain(subgroups)
      .range(this.color)

      // groups 미디어..
      // subg 매우..
      console.log("stack",stack)
      const bar = this.svg.append("g")

      const bar_ = bar
      .selectAll("g")
      .data(stack)
      .join("g")
        .selectAll("rect")
        .data(d=>d.map(a=>({key:d.key,index:d.index,value:a})))
        .join("rect")
          .attr("fill",(d,i)=>color(d.key))
          .attr("x",(d,i)=>x(d.value[0]))
          .attr("y",(d,i)=>y(groups[i]))
          .attr("width",d=>x(d.value[1]) - x(d.value[0]))
          .attr("height",y.bandwidth())


      this.update = (idx)=>{
          this.tab = idx;

          let data = this.dataSet(this.data,subgroups);
          
          let stack = d3.stack()
          .keys(subgroups)
          (data)

          x
          .range([margin[0],this.width])
          
          const bwrap = bar.selectAll("g")
          .data(stack)
          .selectAll("rect")
        
            bwrap.data(d=>d.map(a=>({key:d.key,index:d.index,value:a})))
            .transition().duration(300).ease(d3.easeQuadOut).delay((d,i)=>120*i)
              .attr("x",(d,i)=>x(d.value[0]))
              .attr("width",d=>x(d.value[1]) - x(d.value[0]))
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

    },
    dataSet(data,subgroups) {
        if(this.d == 3) {
          const tgrp = data.columns[0];
          data = data.filter(a=>a[tgrp] == this.tabs[this.tab])
        }
        data = data.map(a=>{
          subgroups.forEach((b)=>{
            a[b] = parseFloat(a[b]);
          })
          return a;
        });

        //Normalize
        data.forEach(function(d){
          // Compute the total
          let tot = 0
          for (let i in subgroups){ let n=subgroups[i] ; tot += +d[n] }
          // Now normalize
          for (let i in subgroups){ let n=subgroups[i] ; d[n] = d[n] / tot * 100}
        })

        return data;
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
