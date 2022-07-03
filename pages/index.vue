<template>
<div>
  <!-- <RatioChart :width="1000" :height="500"></RatioChart> -->
  <Chart2 :width="1000" :height="500" csv="/example_pie.csv"></Chart2>
  <div style="width:100%;height:200vh">d</div>
  <!-- <Chart1 :width="1000" :height="500"></Chart1> -->
</div>
</template>

<script>
import Chart1 from '../components/1-Chart.vue';
import RatioChart from '../components/2-RatioChart.vue';
import Chart2 from '../components/2-Chart.vue';

export default {
  components:{ Chart1, RatioChart, Chart2 },
  mounted() {
  }
}
</script>

<style>
  html,body {
    min-height: 1000vh;
  }
</style>