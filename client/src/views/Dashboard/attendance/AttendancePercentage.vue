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
                <h1>Student Attendance Percentage</h1>
              </div>
              <div class="card-body">
                <div class="table-responsive">
                  <table class="table table-hover">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>STUDENT NAME</th>
                        <th>Total number of school days</th>
                        <th>
                          Total number of days the student has attended school
                        </th>
                        <th>Percentage</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(data, key) in attendance" :key="key">
                        <td>{{ key + 1 }}</td>
                        <td>{{ data.student }}</td>
                        <td>{{ data.allAttendanceMarkedDates }}</td>
                        <td>{{ data.attendance }}</td>
                        <td>
                          <span
                            class="badge bg-success"
                            v-if="data.percentage >= 80"
                          >
                            {{ data.percentage }} %
                          </span>
                          <span class="badge bg-danger" v-else>
                            {{ data.percentage }} %
                          </span>
                        </td>
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
import axios from "axios";
export default {
  created() {
    this.getAttendance();
  },
  data() {
    return {
      nav_active: false,
      attendance: [],
    };
  },

  methods: {
    toggle(value) {
      this.nav_active = value;
    },
    getAttendance() {
      axios
        .get("/report/summary/student/attendance/percentage")
        .then((response) => (this.attendance = response.data.attendance));
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
