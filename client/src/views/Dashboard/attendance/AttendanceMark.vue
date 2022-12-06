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
          <div class="col-lg-6 col-md-12">
            <div class="card shadow w-100">
              <div class="card-head">
                <h1>Student Attendance</h1>
              </div>

              <div class="alert alert-danger" v-if="errorMessage">
                {{ errorMessage }}
              </div>

              <QrCodeReader @decoded="decoded" />
            </div>
          </div>
          <div class="col-lg-6 col-md-12">
            <div class="card shadow w-100">
              <div class="card-head">
                <h1>Today Attendance</h1>
              </div>
              <div class="card-body">
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
import QrCodeReader from "@/components/Dashboard/attendance/QrCodeReader";
import axios from "axios";
export default {
  created() {
    this.getAttendance();
  },
  components: { QrCodeReader },
  data() {
    return {
      nav_active: false,
      attendance_history: [],
      errorMessage: "",
    };
  },

  methods: {
    toggle(value) {
      this.nav_active = value;
    },
    decoded(value) {
      const decoded = JSON.parse(value);

      axios
        .post("students/attendance", { admissionID: decoded.admissionId * 1 })
        .then((response) => {
          if (response.data.status == 200) {
            this.getAttendance();
          }
        })
        .catch((error) => (this.errorMessage = error.response.data.message));
    },
    getAttendance() {
      axios
        .get("students/today-attendance")
        .then((response) => {
          this.attendance_history = response.data.todayAttendance;
        })
        .catch((error) => console.log(error));
    },
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
  }
}
</style>
