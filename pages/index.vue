<template>
<div>
  <!-- <RatioChart :width="1000" :height="500"></RatioChart> -->
  <!-- <Chart2 :width="1000" :height="500" csv="/example_pie.csv"></Chart2> -->
  <!-- <Chart2 :width="1000" :height="500" csv="/example_stack.csv"></Chart2> -->
  <!-- <div style="width:100%;height:200vh"></div> -->
  <!-- <Chart1 :width="1000" :height="500"></Chart1> -->
<eng-chart :width="1000" :height="154" csv="/d1_eng.csv">
  <p class="title">Companies in Korean Media Market</p>
  <p class="desc">Internet Newspaper is the majority of the media companies</p>
</eng-chart>
<eng-chart :width="1000" :height="320" :d="2" csv="/d2_eng.csv" name="Company">
  <p class="title">Companies in Korean Media Market</p>
</eng-chart>
<bar-graph :width="1000" :height="550" csv="/d1_bar.csv">
  <p class="title">현재 이용 소셜미디어(상위 10개) (단위: %)</p>
  <p class="desc">표본 - 전체(n=3,000)<br>Q. 귀하께서는 사회적 이슈에 관한 우리 사회의 여론에 아래 매체가 얼마나 영향을 미친다고 생각하십니까?</p>
</bar-graph>
</div>
</template>

<script>
import EngChart from '../components/EngChart.vue';
import BarGraph from '../components/BarGraph.vue';

export default {
  components:{ EngChart, BarGraph },
}
</script>

<style lang="less">
  @import url("~/assets/chartTemplate/chart.less");
  html,body {
    min-height: 1000vh;
  }
</style>
