import * as d3 from "d3";

export default {
    props: {
        width: {
            default: 0
        },
        height: {
            default: 0
        },
        css: {
            default: ""
        },
        color: {
            default: ()=>["#fdc900", "#ddd", "#7e7e7e", "#ffde99"]
        },
        padding: {
            default: ()=>[10, 10]
        },
        title: {
            default: ""
        },
        csv: {
            default: ""
        }
    },
    data() {
        return {
            data:[]
        }
    },
    mounted() {
        if(this.csv) {
            d3.csv(this.csv).then((res)=>{
                console.log(res);
                this.data = res;
                if(this.render) this.render();
            });
        }
    },
    computed: {
        innerWidth() {
            return this.width - this.padding[1];
        },
        innerHeight() {
            return this.height - this.padding[0];
        }
    },
}