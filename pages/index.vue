<template>
<div>
  <!-- <RatioChart :width="1000" :height="500"></RatioChart> -->
  <!-- <Chart2 :width="1000" :height="500" csv="/example_pie.csv"></Chart2> -->
  <!-- <Chart2 :width="1000" :height="500" csv="/example_stack.csv"></Chart2> -->
  <!-- <div style="width:100%;height:200vh"></div> -->
  <!-- <Chart1 :width="1000" :height="500"></Chart1> -->
<eng-chart :height="154" csv="/example_data/d1_eng.csv">
  <p class="title">Companies in Korean Media Market</p>
  <p class="desc">Internet Newspaper is the majority of the media companies</p>
</eng-chart>
<eng-chart :height="320" :d="2" csv="/example_data/d2_eng.csv" name="Company">
  <p class="title">Companies in Korean Media Market</p>
</eng-chart>
<bar-graph :height="550" csv="/example_data/d1_bar.csv">
  <p class="title">현재 이용 소셜미디어(상위 10개) (단위: %)</p>
  <p class="desc">표본 - 전체(n=3,000)<br>Q. 귀하께서는 사회적 이슈에 관한 우리 사회의 여론에 아래 매체가 얼마나 영향을 미친다고 생각하십니까?</p>
</bar-graph>
<div class="row">
<bar-graph :height="550" csv="/example_data/d1_bar.csv" line="true">
  <p class="title">현재 이용 소셜미디어(상위 10개) (단위: %)</p>
</bar-graph>
<bar-graph :height="550" csv="/example_data/d1_bar.csv" line="true">
  <p class="title">현재 이용 소셜미디어(상위 10개) (단위: %)</p>
</bar-graph>
</div>
<bar-graph :height="550" csv="/example_data/d1_bar.csv" color="#CC322C" :line="true">
  <p class="title">현재 이용 소셜미디어(상위 10개) (단위: %)</p>
  <p class="desc">표본 - 전체(n=3,000)<br>Q. 귀하께서는 사회적 이슈에 관한 우리 사회의 여론에 아래 매체가 얼마나 영향을 미친다고 생각하십니까?</p>
</bar-graph>
<bar-graph-2 :height="550" csv="/example_data/d1_bar.csv"></bar-graph-2>
<bar-graph-2 :height="550" csv="/example_data/d2_bar.csv" :d="2">
  <p class="title">언론산업 사업체의 지역별 분포 (2014~2019) (단위: 개)</p>
</bar-graph-2>
<rad-chart :height="550" csv="/example_data/d1_eng.csv">
  <p class="title">언론산업 사업체의 지역별 분포 (2014~2019) (단위: 개)</p>
</rad-chart>
<bar-graph-3 :height="550" csv="/example_data/d2_multi.csv">
  <p class="title">언론산업 사업체의 지역별 분포 (2014~2019) (단위: 개)</p>
</bar-graph-3>
<stack-graph-1 :height="550" csv="/example_data/d2_multi.csv">
  <p class="title">언론산업 사업체의 지역별 분포 (2014~2019) (단위: 개)</p>
</stack-graph-1>
<line-graph-1 :height="550" csv="/example_data/d2_line.csv">
  <p class="title">언론산업 사업체의 지역별 분포 (2014~2019) (단위: 개)</p>
</line-graph-1>
<stack-graph-2 :height="800" csv="/example_data/d3_multi.csv" :d="3" :title="`매체 영향력에 대한 답변 (단위: %)`" :desc="`귀하께서는 사회적 이슈에 관한 우리 사회의 여론에 아래 매체가 얼마나 영향을 미친다고 생각하십니까?`">

</stack-graph-2>
</div>
</template>

<script>
import EngChart from '../components/EngChart.vue';
import BarGraph from '../components/BarGraph-1.vue';
import BarGraph2 from '../components/BarGraph-2.vue';
import RadChart from '../components/RadChart.vue';
import BarGraph3 from '../components/BarGraph-3.vue';
import StackGraph1 from '../components/StackGraph-1.vue';
import LineGraph1 from '../components/LineGraph-1.vue';
import StackGraph2 from '../components/StackGraph-2.vue';

export default {
  components:{ EngChart, BarGraph, BarGraph2, RadChart, BarGraph3, StackGraph1, LineGraph1, StackGraph2 },
}
</script>

<style lang="less">
  @import url("~/assets/chartTemplate/chart.less");
  html,body {
    min-height: 1000vh;
  }
  .row {
    display: flex;
    gap: 1rem;
    & > div {
      flex: 1;
    }
  }
</style>
