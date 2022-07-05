import * as d3 from "d3";
import D3Comp from "~/assets/chartTemplate/comp";

export default {
  props: {
    height: {
      default: 0
    },
    csv: {
      default: ""
    },
    d: {
      default:1
    },
    gap: {
      default:10
    }
  },
  data() {
    return {
      root: null,
      svg: null,
      comp: null,
      data: [],
      transition: null,
      width: 0
    }
  },
  mounted() {
    //setting
    this.root = this.$refs.root;

    this.svg = d3.select(this.$refs.svg);
    this.width = this.root.getBoundingClientRect().width;
    this.transition = d3.transition().duration(300).ease(d3.easeQuadOut);
    this.comp = new D3Comp({
      container: this.$refs.root,
      svg: this.svg
    });
    window.addEventListener('resize',this.resize);
    if (this.csv) {
      d3.csv(this.csv).then((res) => {
        console.log("data loaded",res);
        this.data = res;
        if (this.render) this.render();
      });
    }
  },
  destroyed() {
    window.removeEventListener('resize',this.resize);
  },
  methods: {
    resize() {
      this.width = this.root.getBoundingClientRect().width;
      if(this.update) this.update(0)
    },
    toLocale(n1) {
      const cn1 = n1.toString()
      .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")
      return cn1;
    },
  },
}
