import * as d3 from "d3";
import D3Comp from "~/assets/chartTemplate/comp";

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
      default: () => ["#fdc900", "#ddd", "#7e7e7e", "#ffde99"]
    },
    padding: {
      default: () => [10, 10]
    },
    title: {
      default: ""
    },
    csv: {
      default: ""
    },
  },
  data() {
    return {
      svg: null,
      body: null,
      x: null,
      y: null,
      comp: null,
      data: []
    }
  },
  mounted() {
    const vobj = this;
    //setting
    this.svg = d3.select(this.$refs.svg);
    this.comp = new D3Comp({
      container: this.$refs.root,
      svg: this.svg
    });
    if (this.csv) {
      d3.csv(this.csv).then((res) => {
        console.log(res);
        this.data = res;
        if (this.render) this.render();
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
