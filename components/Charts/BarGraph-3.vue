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
import TopColors from '~/components/d3Comps/TopColors.vue';

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
      let data = this.data;

      const subgroups = this.data.columns.slice(1);
      const grp = this.data.columns[0];
      const groups = d3.map(this.data,d=>d[grp]);

      this.tabs = subgroups

      const x = d3
      .scaleBand()
      .domain(groups)
      .range([0,this.width])
      .padding(.1)

      const y = d3.scaleLinear()
      .domain([0,100])
      .range([this.height - ywidth,0]);

      //drawer
      const xsub = d3.scaleBand()
      .domain(subgroups)
      .range([0,x.bandwidth()])
      .padding(.05)

      const color = d3.scaleOrdinal()
      .domain(subgroups)
      .range(this.color)

      const bars = this.svg.append("g")
      .selectAll("g")

      const bars_ = bars.data(data)
      .enter()
      .append("g")
        .style("transform",d=>`translate(${x(d[grp])}px,0)`)
      .selectAll("rect")
      .data(d=>(subgroups.map(key=>({key:key,value:d[key]}))))
      .join("rect")

        bars_.attr("x",d=>xsub(d.key))
        .attr("y",this.height - ywidth)
        .attr("width",xsub.bandwidth())
        .attr("height",0)
        .attr("fill",d=>color(d.key));

      const Bottom = this.svg.append("g")
      .attr("class","axisY slope")
      .style("transform",`translate(0,${this.height - ywidth + gap}px)`)

      const axis = Bottom.call(d3.axisBottom(x).tickSize(0))
      axis.selectAll("text").attr("text-anchor","center").style("transform",`translate(0,${ywidth*.25}px) rotate(-30deg)`)
      axis.select(".domain").attr("style",`opacity:1;transform:translate(0,-${gap}px)`).attr("stroke-width","2px")

      this.update = (idx)=>{
          this.tab = idx;
          let data = Object.entries(this.data[idx])
          if(this.d == 2) data = data.slice(1)

          y
          .domain([0,100])

          x
          .domain(groups)
          .range([0,this.width])

          xsub
          .domain(subgroups)
          .range([0,x.bandwidth()])

          Bottom.transition().duration(300).ease(d3.easeQuadOut).call(d3.axisBottom(x).tickSize(0));

          bars_
          .selectAll("rect")
            .attr("x",d=>xsub(d.key))
            .attr("width",xsub.bandwidth())
      };

      this.comp.onIntersection(()=>{
        bars
        .data(data)
        .enter()
        .selectAll("rect")
          .transition().duration(600).ease(d3.easeQuadOut)
          .delay((d,i)=>i*100)
          .attr("y",d=>y(d.value))
          .attr("height",d=>this.height - ywidth - y(d.value))
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
