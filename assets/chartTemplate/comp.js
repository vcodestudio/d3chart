import * as d3 from "d3";
export default class D3Comp {
    observer = null;
    constructor(data) {
        this.container = data.container;
        this.svg = data.svg;
    }

    // BandX(axisX = null, style = "normal") {
    //     if(!axisX) return;

    //     const svg = this.svg;
    //     const pad = this.padding;
    //     const x = axisX;
    //     const width = svg.attr("width"), height = svg.attr("height");
    //     const xtxt = svg.append("g")
    //     .attr("name","xtxt")
    //     .style("transform",`translate(0,${height - pad[0]}px)`)

    //     const xxtxt = xtxt
    //     .call(d3.axisBottom(x))
    //     .selectAll("text")

    //     xxtxt.attr("text-anchor","middle")

    //     if(style == 'slope') {
    //         xxtxt
    //         .style('transform',(d,i)=>`translate(0,.5rem) rotate(${style == 'slope'?-30:0}deg)`)
    //     }

    //     svg.selectAll("g[name=xtxt] path,g[name=xtxt] line").attr("stroke-width",0)
    //     svg.select("g[name=xtxt]")
    //     .append("path")
    //     .datum([[0,0],[width,0]])
    //     .attr("d",d3.line().x(d=>d[0]).y(d=>d[1]))
    //     .attr("stroke","#000")
    //     .attr("stroke-width",3)

    //     return xtxt;
    // }

    // BandY(axisY = null) {

    // }

    createToolTip(target = null) {
          // ----------------
  // Create a tooltip
  // ----------------
  if(!this.container || !target) return;

  const tooltip = this.container
  .append("div")
  .style("opacity", 0)
  .attr("class", "tooltip")
  .style("background-color", "white")
  .style("border", "solid")
  .style("border-width", "1px")
  .style("border-radius", "5px")
  .style("padding", "10px")

  // Three function that change the tooltip when user hover / move / leave a cell
  const mouseover = function(event, d) {
    const subgroupName = d3.select(this.parentNode).datum().key;
    const subgroupValue = d.data[subgroupName];
    tooltip
        .html("subgroup: " + subgroupName + "<br>" + "Value: " + subgroupValue)
        .style("opacity", 1)

  }
  const mousemove = function(event, d) {
    tooltip.style("transform","translateY(-55%)")
           .style("left",(event.x)/2+"px")
           .style("top",(event.y)/2-30+"px")
  }
  const mouseleave = function(event, d) {
    tooltip
      .style("opacity", 0)
  }

    target
    .on('mousemove',mousemove)
    .on('mouseover',mouseover)
    .on('mouseleave',mouseleave)

    return tooltip;
    }

    onIntersection(callback = function(obj) {console.log("mutation",obj)}) {
        if(!this.container) return;
        const options = {
            rootMargin: '0px',
            threshold:1.
        };

        const vobj = this;
        this.observer = new IntersectionObserver((refers,observer)=>{
            refers.forEach(function(obj) {
                console.log(obj);
                if(obj.isIntersecting) {
                    callback(obj);
                    vobj.clearAnimation();
                }
            },options);
        });
        this.observer.observe(this.svg.node());
        return this.observer;
    }

    clearAnimation() {
        this.observer?.disconnect();
        return this.observer;
    }
}
