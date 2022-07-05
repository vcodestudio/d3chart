<template>
  <div id="chart">
    <p>
        {{title}}
    </p>
  </div>
</template>

<script>
import * as d3 from "d3";
import D3Comp from "../assets/chartTemplate/comp";

export default {
    props:{
        title:{
            type:String,
            default:""
        },
        padding:{
            type:String,
            default:"",
        },
        color:{
            type:Function,
            default() {
                return {
                    
                }
            }
        },
        width:{
            type:Number,
            default:0
        },
        height:{
            type:Number,
            default:0
        },
        data:{
            type:Array,
            default:[
                {name:"a",value:10,v1:10,v2:40},
                {name:"b",value:15,v1:30,v2:30},
                {name:"c",value:12,v1:40,v2:37},
                {name:"d",value:11,v1:15,v2:33},
                {name:"e",value:13,v1:90,v2:43},
                {name:"f",value:30,v1:31,v2:12},
            ]
        }
    },
    data() {
        return {}
    },
mounted() {
    const width = parseInt(this.width),
            height = parseInt(this.height);
    let pad = this.padding.split(" ")?.map(a=>parseInt(a)) ?? [0,0];
    const innerWidth = width - pad[1],
            innerHeight = height - pad[0];

    this.innerWidth = innerWidth;
    this.innerHeight = innerHeight;

    const svg = d3.select("#chart")
    .append("svg")
    .attr("width",width)
    .attr("height",height)

        const x = d3.scaleBand()
        .domain(this.data.map(d=>d.name))
        .range([pad[1],width-pad[1]])
        .padding(.3);

    const ydt = this.data.map(d=>d.value).sort((a,b)=>a-b);
    const y = d3.scaleLinear()
    .domain([0,ydt[ydt.length - 1]])
    .range([innerHeight,pad[0]])

    const yp = d3.scaleLinear()
    .domain([0,100])
    .range([innerHeight,pad[0]])
    
    // const ytxt = svg.append("g")
    // .style("transform",`translate(${pad[1]}px,0)`)
    // .call(d3.axisLeft(y));

    const bar = this.drawBar({
        container:svg.append("g"),
        data:this.data,
        color:"#4796D4",
        x,y
    });

    //lineBar
    const bar2 = this.drawLine({
        container:svg.append("g"),
        data:this.data.map(d=>{return {name:d.name,value:d.v1}}),
        color:"#439463",
        x,
        y:yp
    });
    const bar3 = this.drawLine({
        container:svg.append("g"),
        data:this.data.map(d=>{return {name:d.name,value:d.v2}}),
        color:"red",
        x,
        y:yp
    });
    const bar4 = this.drawLine({
        container:svg.append("g"),
        data:this.data.map(d=>{return {name:d.name,value:d.v1+5}}),
        color:"blue",
        x,
        y:yp
    });

        const xtxt = new D3Comp({
            style:'slope',
            svg,pad,x
        }).render();


    //animation
    const trans = d3.transition().duration(1000).ease(d3.easeQuadOut);

    [bar2,bar3,bar4].forEach((obj,i)=>{
        obj.transition(trans).delay(i*300).attr("stroke-dashoffset",0)
    })

    bar.selectAll("rect").transition(trans).delay((d,i)=>100*i).attr("height",d=>innerHeight - y(d.value)).attr("y",d=>y(d.value));
    bar.selectAll("text").transition(trans).delay((d,i)=>100*i).attr("y",d=>y(d.value));
    

},
methods:{
    drawBar(inp = {container,data,color,x,y}) {

        const bar = inp.container.selectAll("bars")
        .data(inp.data)
        .join("rect")
        .attr("x",d=>inp.x(d.name))
        .attr("y",this.innerHeight)
        .attr("width",inp.x.bandwidth())
        .attr("height",0)
        .attr("fill",inp.color)

        const bartxt = inp.container
        .selectAll("bartxts")
        .data(inp.data)
        .join("text")
        .attr("x",d=>inp.x(d.name) + .5*inp.x.bandwidth())
        .attr("y",this.innerHeight)
        .attr("width",inp.x.bandwidth())
        .text(d=>d.value)
        .style("transform","translate(0,1.5em)")
        .attr("text-anchor","middle")
        .attr("fill","#fff")

        return inp.container;
    },
    drawLine(inp = {
        container:null,
        data:null,
        color:null,
        x:null,
        y:null,
    }) {
        const cont = inp.container,
        data = inp.data,
        color = inp.color

        const bar2_path = cont.append("path")
        .datum(data)
        .attr("d",d3.line().x(d=>inp.x(d.name)+inp.x.bandwidth()*.5).y(d=>inp.y(d.value)))
        .attr("stroke",color)
        .attr("stroke-width",30)
        .attr("fill","none")
        .style("mix-blend-mode","multiply")

        const b2l = bar2_path.node().getTotalLength();

        bar2_path
        .attr("stroke-dasharray",[b2l,b2l].join(" "))
        .attr("stroke-dashoffset",b2l);

        inp.container.append("text")
        .data([data[data.length-1]])
        .attr("x",d=>inp.x(d.name)+inp.x.bandwidth() + 10)
        .attr("y",d=>inp.y(d.value))
        .text(d=>d.value+"%")

        return bar2_path;
    }
}
}
</script>

<style lang="less">

</style>