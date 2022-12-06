<template>
  <div class="card-body" style="max-height: 450px">
    <canvas id="canvas" class="d-block mx-auto"></canvas>
  </div>
</template>

<script>
import { Chart } from "chart.js/auto";
import axios from "axios";

export default {
  data() {
    return {
      abLength: 0,
      todayAttendance: 0,
    };
  },
  created() {
    this.getTodayAttendanceReport();
  },

  watch: {
    todayAttendance(nwValue, oldValue) {
      if (nwValue !== oldValue) {
        this.chartGen();
      }
    },
  },

  methods: {
    getTodayAttendanceReport() {
      axios.get("/report/summary/section").then((response) => {
        (this.abLength = response.data.abLength),
          (this.todayAttendance = response.data.todayAttendance);
      });
    },
    chartGen() {
      const ctx = document.querySelector("#canvas").getContext("2d");
      new Chart(ctx, {
        type: "doughnut",
        data: {
          labels: ["AB", "Present"],
          datasets: [
            {
              data: [this.abLength, this.todayAttendance],
              backgroundColor: ["rgb(255, 99, 132)", "rgb(54, 162, 235)"],
              hoverOffset: 4,
            },
          ],
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
