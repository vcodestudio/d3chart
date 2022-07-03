<template>
  <div id="chart">
    <p>
        {{title}}
    </p>
  </div>
</template>

<script>
import * as d3 from "d3";
export default {
    props:{
        width:{
            type:Number,
            default:0
        },
        height:{
            type:Number,
            default:0
        },
    },
    data() {
        return {
            title:"gkgg",
            padding:"50 50",
            color:{
                bar:"blue",
                line:["red","blue","yellow"]
            },
            texts:{
                lt:"lt",
                rt:"rt",
                line:["예","시","들"]
            },
            data:[
                {name:"2011",style:"rotate",bval:10,pval:[30,80]},
                {name:"2012",bval:15,pval:[10,70]},
                {name:"2013",bval:12,pval:[40,40]},
                {name:"2014",bval:11,pval:[20,30]},
                {name:"2015",bval:13,pval:[40,15]},
                {name:"2016",bval:30,pval:[60,12]},
                {name:"2017",bval:30,pval:[60,12]},
                {name:"2018",bval:30,pval:[60,12]},
                {name:"2019",bval:30,pval:[60,12]},
                {name:"2020",bval:30,pval:[60,12]},
                {name:"2021",bval:30,pval:[60,12]},
                {name:"2022",bval:30,pval:[60,12]},
            ]
        }
    },
mounted() {
    d3.csv("/sampledata.csv",res=>{
        console.log(res);
    });
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

    const ydt = this.data.map(d=>d.bval).sort((a,b)=>a-b);
    const y = d3.scaleLinear()
    .domain([0,ydt[ydt.length - 1]])
    .range([innerHeight,pad[0]])

    const yp = d3.scaleLinear()
    .domain([0,100])
    .range([innerHeight,pad[0]])
    
    // const ytxt = svg.append("g")
    // .style("transform",`translate(${pad[1]}px,0)`)
    // .call(d3.axisLeft(y));

    //bar
    const bar = this.drawBar({
        container:svg.append("g"),
        data:this.data,
        color:this.color.bar,
        x,y
    });

    //lineBar
    const lineBars = [];
    for(var i=0;i<this.data[0].pval.length;i++) {
        lineBars.push(
            this.drawLine({
            container:svg.append("g"),
            data:this.data.map(d=>{return {name:d.name,bval:d.pval[i]}}),
            color:this.color.line[i],
            x,
            y:yp,
            name:this.texts.line[i]
            })
        );
    }

        const xtxt = svg.append("g")
                    .attr("name","xtxt")
                    .style("transform",`translate(0,${height - pad[0]}px)`)
                    .call(d3.axisBottom(x))
                    .selectAll("text")
                    .style('transform',(d,i)=>`rotate(${this.data[i].style?45:0}deg)`)
                    .attr("text-anchor","middle")

    svg.selectAll("g[name=xtxt] path,g[name=xtxt] line").attr("stroke-width",0)
    svg.select("g[name=xtxt]")
    .append("path")
    .datum([[pad[1],0],[innerWidth,0]])
    .attr("d",d3.line().x(d=>d[0]).y(d=>d[1]))
    .attr("stroke","#000")
    .attr("stroke-width",3)

    //lt
    svg.append("text")
    .text(this.texts.lt)
    .attr("x",0)
    .attr("y","1em")
    .attr("text-anchor","middle")

    //rt
    svg.append("text")
    .text(this.texts.rt)
    .attr("x",innerWidth)
    .attr("y","1em")
    .attr("text-anchor","middle")

    //animation
    const trans = d3.transition().duration(1000).ease(d3.easeQuadOut);

    lineBars.forEach((obj,i)=>{
        obj.transition(trans).delay(i*300).attr("stroke-dashoffset",0)
    })

    bar.selectAll("rect").transition(trans).delay((d,i)=>100*i).attr("height",d=>innerHeight - y(d.bval)).attr("y",d=>y(d.bval));
    bar.selectAll("text").transition(trans).delay((d,i)=>100*i).attr("y",d=>y(d.bval));
    

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
        .text(d=>d.bval)
        .style("transform","translate(0,1.5em)")
        .attr("text-anchor","middle")
        .attr("fill","#fff")

        return inp.container;
    },
    drawLine(inp = {
        container:null,
        data:null,
        color:null,
        name:"",
        x:null,
        y:null,
    }) {
        const cont = inp.container,
        data = inp.data,
        color = inp.color

        const bar2_path = cont.append("path")
        .datum(data)
        .attr("d",d3.line().x(d=>inp.x(d.name)+inp.x.bandwidth()*.5).y(d=>inp.y(d.bval)))
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
        .attr("y",d=>inp.y(d.bval))
        .text(d=>d.bval+"%")

        inp.container.append("text")
        .data([data[0]])
        .attr("x",d=>0)
        .attr("y",d=>inp.y(d.bval))
        .text(inp.name);

        return bar2_path;
    }
}
}
</script>

<style lang="less">

</style>