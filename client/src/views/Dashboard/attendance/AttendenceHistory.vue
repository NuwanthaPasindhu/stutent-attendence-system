<template>
  <main class="d-flex">
    <side-bar :open="nav_active" />
    <!-- Dashboard  Contents -->
    <div class="container-fluid">
      <!-- Nav Bar Start  -->
      <NavBar @toggleNav="toggle" />
      <!-- Nav Bar End  -->
      <div class="container">
        <div class="row my-5">
          <div class="col-lg-12 col-md-12">
            <div class="card shadow w-100">
              <div class="card-head">
                <h1 class="text-center">{{ historyDate }} Date Attendance</h1>
              </div>
              <div class="card-body">
                <h3 class="text-center my-2">Please Select The Date</h3>
                <div class="row">
                  <div class="col-lg-6 col-md-12">
                    <input
                      type="date"
                      class="form-control"
                      v-model="historyDate"
                    />
                  </div>
                  <div class="col-lg-6 col-md-12">
                    <!-- <canvas id="canvas" class="d-block mx-auto"></canvas> -->
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="row mb-5">
          <div class="col-lg-12 col-md-12">
            <div class="card shadow w-100">
              <div class="card-body" style="max-height: 450px">
                <div class="table-responsive">
                  <table class="table table-hover">
                    <tbody v-if="attendance_history.length > 0">
                      <tr
                        v-for="(history, key) in attendance_history"
                        :key="key"
                      >
                        <td>{{ history.stdId.fullName }}</td>
                        <td>
                          <span class="badge bg-success">
                            {{ history.attendance ? "Marked" : "AB" }}
                          </span>
                        </td>
                      </tr>
                    </tbody>
                    <tbody v-else>
                      <tr>
                        <td colspan="2">No Data Found</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <dashboard-footer />
    </div>
  </main>
</template>

<script>
// import { Chart } from "chart.js/auto";
import axios from "axios";
export default {
  data() {
    return {
      nav_active: false,
      attendance_history: [],
      errorMessage: "",
      historyDate: `${new Date().getFullYear()}-0${new Date().getMonth() + 1}-0${
        new Date().getDate() - 1
      }`,
      abLength: 0,
      todayAttendance: 0,
    };
  },
  created() {
    this.getAttendance();
  },

  watch: {
    historyDate(newValue, oldValue) {
      if (newValue !== oldValue) {
        this.getAttendance();
      }
    },

    // todayAttendance(nwValue, oldValue) {
    //   if (nwValue !== oldValue) {
    //     this.chartGen();
    //   }
    // },
  },
  methods: {
    toggle(value) {
      this.nav_active = value;
    },
    getAttendance() {
      axios.get("/report/summary?date=" + this.historyDate).then((response) => {
        this.abLength = response.data.abLength;
        this.todayAttendance = response.data.todayAttendance;
        this.attendance_history = response.data.studentList;
      });
    },
    // chartGen() {
    //   const ctx = document.querySelector("#canvas").getContext("2d");
    //   new Chart(ctx, {
    //     type: "doughnut",
    //     data: {
    //       labels: ["AB", "Present"],
    //       datasets: [
    //         {
    //           data: [this.abLength, this.todayAttendance],
    //           backgroundColor: ["rgb(255, 99, 132)", "rgb(54, 162, 235)"],
    //           hoverOffset: 4,
    //         },
    //       ],
    //     },
    //   });
    // },
  },
};
</script>

<style lang="scss" scoped>
main {
  width: 100vw;
  min-height: 100vh;
  height: auto;
  overflow-x: hidden;
}
.container {
  overflow-x: hidden;
  .card {
    border-radius: 20px;
    overflow: hidden;
    z-index: 1;
    .card-head {
      height: 200px;
      background: linear-gradient(
          0deg,
          rgba(255, 0, 150, 0.3),
          rgba(255, 0, 150, 0.3)
        ),
        url("@/assets/Dashboard/StudentAttendance/Banner.jpg");
      background-size: cover;
      background-position: center center;
      display: flex;
      align-items: center;
      justify-content: center;
      h1 {
        color: #ffff;
        font-weight: 900;
      }
    }
    .card-body {
      table.table {
        tr {
          input[type="checkbox"] {
            width: 20px;
            height: 20px;
            accent-color: var(--dashboard-main);
          }
        }
      }
    }
  }
}
</style>
