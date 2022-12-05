<template>
  <div class="card-body" style="max-height: 300px">
    <canvas :id="'section_' + id" class="d-block mx-auto"></canvas>
  </div>
</template>

<script>
import { Chart } from "chart.js/auto";
import axios from "axios";
export default {
  props: {
    id: {
      type: String,
      required: true,
    },
    section: {
      type: String,
      required: true,
    },
  },
  mounted() {
    this.getTodayAttendanceReport(this.section);
  },
  watch: {
    todayAttendance(newValue, oldValue) {
      if (newValue !== oldValue) {
        this.chartGen("section_" + this.id);
      }
    },
  },
  data() {
    return {
      abLength: 0,
      todayAttendance: 0,
    };
  },
  methods: {
    getTodayAttendanceReport(section) {
      axios
        .get("/report/summary/section?sectionID=" + section)
        .then((response) => {
          (this.abLength = response.data.abLength),
            (this.todayAttendance = response.data.todayAttendance);
        });
    },
    chartGen(id) {
      const ctx = document.querySelector(`#${id}`).getContext("2d");
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

<style scoped></style>
