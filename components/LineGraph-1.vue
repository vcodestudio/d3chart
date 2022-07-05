<template>
  <div ref="root" class="root">
    <div>
      <slot></slot>
    </div>
    <TopColors :data="tabs.map((a,i)=>({color:color[i],name:a}))"/>
    <svg :width="width" :height="height" ref="svg"></svg>
  </div>
</template>

<script>
import * as d3 from "d3";
import chart_mixin from "~/assets/chartTemplate/mixin";
import TopColors from './d3Comps/TopColors.vue';

export default {
  mixins:[chart_mixin],
  components:{TopColors},
  props:{
    name:{
      default:"Media"
    },
    color:{
      default() {
        return ["#E8A440","#CC322C","#0514D5","#439463"]
      }
    },
    line:{
      default:true
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
    render() { //최대값 구하기 + 사이즈 조정 대응
      const ywidth = 120
      const cap = 220
      const gap = this.gap

      const subgroups = this.data.columns.slice(1);
      const grp = this.data.columns[0];
      const groups = d3.map(this.data,d=>d[grp]);

      let data = this.data;

      this.tabs = subgroups

      const x = d3
      .scaleBand()
      .domain(groups)
      .range([0,this.width])
      .padding([.3])
      .paddingOuter(0)

      const dataset = subgroups.map((a)=>{
        let datamap = data.map(b=>parseFloat(b[a]));
        return {key:a,value:datamap}
      });

      const allValues = dataset.map(a=>a.value).reduce((a,b)=>a.concat(b));

      const y = d3.scaleLinear()
      .domain([0,d3.max(allValues)])
      .range([this.height - ywidth,30]);

      const color = d3.scaleOrdinal()
      .domain(subgroups)
      .range(this.color)

      const lines = this.svg.append("g")
      .selectAll("path")

      const lines_ = lines
      .data(dataset)
      .join("path")
      .datum(d=>groups.map((a,i)=>({name:a,value:d.value[i]})))
        .attr("name",d=>d.key)
        .attr("d",d3.line().x(d=>x(d.name)+x.bandwidth()*.5).y(d=>y(d.value)))
        .attr("stroke",(d,i)=>color(subgroups[i]))
        .attr("stroke-width",30)
        .attr("fill","none")
        .style("mix-blend-mode","multiply")

      const Bottom = this.svg.append("g")
      .attr("class","axisY slope")
      .style("transform",`translate(0,${this.height - ywidth + gap}px)`)

      const axis = Bottom.call(d3.axisBottom(x).tickSize(0))
      axis.selectAll("text").attr("text-anchor","center").style("transform",`translate(0,${ywidth*.25}px) rotate(-30deg)`)
      axis.select(".domain").attr("style",`opacity:1;transform:translate(0,-${gap}px)`).attr("stroke-width","2px")

      this.update = (idx)=>{

      };

      this.comp.onIntersection(()=>{

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
