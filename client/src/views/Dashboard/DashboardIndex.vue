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
            <div
              class="card w-100"
              :class="user.role !== 'ADMIN' ? `shadow` : `border-0`"
            >
              <div
                class="card-header card-head py-3"
                v-if="user.role !== 'ADMIN'"
              >
                <h1 class="heading">Today Attendance</h1>
              </div>
              <ClassAttendance v-if="user.role == 'TEACHER'" />
              <SectionAttendance v-if="user.role == 'SECTION_HEAD'" />
              <SchoolAttendance v-if="user.role == 'ADMIN'" />
            </div>
          </div>
        </div>
        <div class="row" v-if="user.role == 'ADMIN'">
          <div class="col-lg-12 col-md-12">
            <div class="card w-100">
              <div class="card-body row">
                <div
                  class="card col-lg-6 col-sm-12"
                  v-for="(section, key) in allSections"
                  :key="key"
                >
                  <div class="card-header d-flex justify-content-between">
                    {{ section.details }}
                    <button
                      class="btn btn-success"
                      @click="get_details(section._id)"
                      data-bs-toggle="modal"
                      data-bs-target="#exampleModal"
                    >
                      Details
                    </button>
                  </div>
                  <div class="card-body">
                    <PieChart :id="section.name" :section="section._id" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <dashboard-footer />
    </div>
    <!-- Dashboard  Contents -->
    <!-- Modal -->
    <div
      class="modal fade"
      id="exampleModal"
      tabindex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
      v-if="user.role == 'ADMIN'"
    >
      <div class="modal-dialog modal-xl">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title heading" id="exampleModalLabel">
              Section Details
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <div class="table-responsive">
              <table class="table table-hover">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Class</th>
                    <th>Attendance</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(attendance, key) in allAttendance" :key="key">
                    <td>
                      {{ key + 1 }}
                    </td>
                    <td>
                      {{ attendance.class }}
                    </td>
                    <td>
                      {{ attendance.attendance }}
                    </td>
                  </tr>
                  <tr>
                    <td>TODAY ATTENDENCE</td>
                    <td colspan="2">
                      <b class="text-center">
                        {{ tdyAttendance }}
                      </b>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import { mapGetters } from "vuex";
import ClassAttendance from "@/components/Dashboard/summary/ClassAttendance.vue";
import SchoolAttendance from "@/components/Dashboard/summary/SchoolAttendance.vue";
import SectionAttendance from "@/components/Dashboard/summary/SectionAttendance.vue";
import axios from "axios";
import PieChart from "@/components/Dashboard/charts/PieChart.vue";
export default {
  computed: mapGetters({
    user: "auth/GET_USER",
  }),
  data() {
    return {
      nav_active: false,
      attendance: {},
      allSections: [],
      allAttendance: [],
      tdyAttendance: 0,
    };
  },
  mounted() {
    if (this.user.role == "ADMIN") {
      this.sections();
    }
  },
  watch: {
    user(newValue, oldValue) {
      if (newValue !== oldValue) {
        if (newValue.role == "ADMIN") {
          this.sections();
        }
      }
    },
  },

  methods: {
    toggle(value) {
      this.nav_active = value;
    },

    sections() {
      axios
        .get("sections/all")
        .then((r) => {
          this.allSections = r.data.sections;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    get_details(id) {
      axios
        .get("report/summary/section/all-class?sectionID=" + id)
        .then((r) => {
          this.allAttendance = r.data.attendance;
          this.tdyAttendance = 0;
          r.data.attendance.map((atd) => {
            this.tdyAttendance = this.tdyAttendance + atd.attendance;
          });
        })
        .catch((e) => {
          console.log(e);
        });
      console.log(id);
    },
  },
  components: {
    ClassAttendance,
    SectionAttendance,
    SchoolAttendance,
    PieChart,
  },
};
</script>

<style lang="scss">
main {
  // background: var(--dashboard-color);
  width: 100vw;
  min-height: 100vh;
  height: auto;
  overflow-x: hidden;
}

.container {
  overflow-x: hidden;
  height: auto;

  .card {
    border-radius: 20px;
    overflow: hidden;
    z-index: 1;

    .card-head {
      height: 200px;
      background: linear-gradient(0deg, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)),
        url("@/assets/Dashboard/Sections/banner.jpg");
      background-size: cover;
      background-position: center center;
      display: flex;
      align-items: center;
      justify-content: center;

      h1 {
        color: #ffff;
        font-weight: 900;
        text-align: center;
      }
      h5 {
        color: #ffff;
        font-weight: 900;
        text-align: center;
        text-transform: uppercase;
      }
    }

    .card-body {
      form {
        textarea,
        input {
          border: none;
          border-bottom: 2px solid var(--dashboard-color);
          outline: 0;

          &::placeholder {
            font-weight: 400;
            color: var(--dashboard-color);
          }

          &:focus {
            outline: 0;
            box-shadow: none;
            transition: all 0.2s ease-in-out;
            border-bottom: 2px solid var(--dashboard-warning);
          }
        }

        label {
          font-weight: 700;
        }

        .btn {
          background: var(--dashboard-color);
          color: #fff;
          border-radius: 5px;
          font-weight: 800;
        }
      }

      .row {
        overflow-x: hidden;

        table {
          tr {
            th {
              text-transform: uppercase;
            }
          }
        }
      }
    }
  }

  .popup {
    min-height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
  }
}
</style>
