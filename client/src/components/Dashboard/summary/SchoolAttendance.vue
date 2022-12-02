<template>
  <div class="card-body">
    <div class="table-responsive">
      <canvas id="canvas"></canvas>
    </div>
  </div>
</template>

<script>
import { Chart } from "chart.js/auto";
import axios from "axios";

export default {
  data() {
    return {
      sectionList: [],
      attendance: [],
      rendered: false,
    };
  },
  created() {
    this.getTodayAttendanceReport();
    this.sections();
  },
  watch: {
    rendered(newValue, oldValue) {
      if (newValue != oldValue) {
        console.log(newValue);
        this.chartGen();
        this.chartGen2();
      }
    },
  },
  methods: {
    sections() {
      axios
        .get("sections/all")
        .then((r) => {
          r.data.sections.map((section) =>
            this.sectionList.push(section.details)
          );
          this.rendered = true;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    getTodayAttendanceReport() {
      axios.get("/report/summary/school").then((response) => {
        console.log(response.data);
      });
    },
    chartGen() {
      const ctx = document.querySelector("#canvas").getContext("2d");
      new Chart(ctx, {
        type: "bar",
        data: {
          labels: this.sectionList,
          datasets: [
            {
              label: "Today Attendance",
              data: [
                65, 59, 80, 81, 56, 55, 40, 65, 59, 80, 81, 56, 55, 40, 5, 10,
              ],
              backgroundColor: [
                "rgba(119,79,82,.4)",
                "rgba(12,234,138,.4)",
                "rgba(208,123,180,.4)",
                "rgba(235,210,74,.4)",
                "rgba(95,30,218,.4)",
                "rgba(200,38,92,.4)",
                "rgba(182,41,98,.4)",
                "rgba(247,42,80,.4)",
                "rgba(82,99,121,.4)",
                "rgba(242,118,20,.4)",
                "rgba(248,172,62,.4)",
                "rgba(185,54,196,.4)",
                "rgba(103,25,35,.4)",
                "rgba(27,155,227,.4)",
                "rgba(81,52,160,.4)",
                "rgba(255,80,211,.4)",
              ],
              borderColor: [
                "rgb(119,79,82)",
                "rgb(12,234,138)",
                "rgb(208,123,180)",
                "rgb(235,210,74)",
                "rgb(95,30,218)",
                "rgb(200,38,92)",
                "rgb(182,41,98)",
                "rgb(247,42,80)",
                "rgb(82,99,121)",
                "rgb(242,118,20)",
                "rgb(248,172,62)",
                "rgb(185,54,196)",
                "rgb(103,25,35)",
                "rgb(27,155,227)",
                "rgb(81,52,160)",
                "rgb(255,80,211)",
              ],
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.card-body {
  height: 100vh;
}
@media screen and (max-width: 1440px) {
  .card-body {
    height: 70vh;
  }
}
@media screen and (max-width: 965px) {
  .card-body {
    height: 500px;
  }
}
</style>
