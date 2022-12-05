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
                <h1>Assign Student</h1>
              </div>
              <div class="card-body">
                <div
                  class="alert alert-success"
                  role="alert"
                  v-if="successMessage"
                >
                  {{ successMessage }}
                </div>
                <div
                  class="alert alert-danger"
                  role="alert"
                  v-if="errorMessage"
                >
                  {{ errorMessage }}
                </div>
                <div class="row">
                  <div class="col-8">
                    <input
                      type="number"
                      class="form-control"
                      v-model="admissionID"
                      min="100"
                    />
                  </div>
                  <button @click="assign" class="btn col-4">Assign</button>
                  <div class="col-lg-12 mt-2">
                    <div class="table-responsive">
                      <table class="table table-hover">
                        <tbody v-if="profile">
                          <tr>
                            <th>admission Number</th>
                            <td>{{ profile.admissionNumber }}</td>
                          </tr>

                          <tr>
                            <th>full Name</th>
                            <td>{{ profile.fullName }}</td>
                          </tr>
                          <tr>
                            <th>mobile Number</th>
                            <td>{{ profile.mobileNumber }}</td>
                          </tr>
                          <tr>
                            <th>Address</th>
                            <td>{{ profile.address }}</td>
                          </tr>
                          <tr>
                            <th>Mother Name</th>
                            <td>{{ profile.motherName }}</td>
                          </tr>
                          <tr>
                            <th>Father Name</th>
                            <td>{{ profile.fatherName }}</td>
                          </tr>
                        </tbody>
                        <tbody v-else>
                          <tr></tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-lg-12 col-md-12">
            <div class="card shadow w-100">
              <div class="card-head">
                <h1>All Student</h1>
              </div>
              <div class="card-body">
                <div class="table-responsive">
                  <table class="table table-hover">
                    <thead>
                      <tr>
                        <th>Admission Number</th>
                        <th>Name</th>
                        <th>Qr code</th>
                        <th>profile</th>
                      </tr>
                    </thead>
                    <tbody v-if="TableData.length > 0">
                      <tr v-for="(student, key) in TableData" :key="key">
                        <td>{{ student.stdId.admissionNumber }}</td>
                        <td>{{ student.stdId.fullName }}</td>
                        <td>
                          <QrCode
                            :admissionId="student.stdId.admissionNumber"
                            :studentName="student.stdId.fullName"
                          />
                        </td>
                        <td>
                          <button
                            class="btn btn-success"
                            data-bs-toggle="modal"
                            data-bs-target="#exampleModal2"
                            @click.prevent="studentProfile(student.stdId._id)"
                          >
                            <box-icon name="show" color="white"></box-icon>
                          </button>
                        </td>
                      </tr>
                    </tbody>
                    <tbody v-else>
                      <tr>
                        <td colspan="5" class="text-center">
                          No Records found
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
      <!-- Modal -->
      <div
        class="modal fade"
        id="exampleModal2"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog modal-xl">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title heading" id="exampleModalLabel">
                Student Profile
              </h5>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body" v-if="studentProfileData">
              <div class="table-responsive">
                <table class="table table-hover">
                  <tbody>
                    <tr>
                      <th>QR Code</th>
                      <td>
                        <QrCode
                          v-if="studentProfileData"
                          :admissionId="studentProfileData.admissionNumber"
                          :studentName="studentProfileData.fullName"
                        />
                      </td>
                    </tr>
                    <tr>
                      <th>Admission Number</th>
                      <td>{{ studentProfileData.admissionNumber }}</td>
                    </tr>
                    <tr>
                      <th>Student Name</th>
                      <td>{{ studentProfileData.fullName }}</td>
                    </tr>
                    <tr>
                      <th>Address</th>
                      <td>{{ studentProfileData.address }}</td>
                    </tr>
                    <tr>
                      <th>MotherName</th>
                      <td>{{ studentProfileData.motherName }}</td>
                    </tr>
                    <tr>
                      <th>Father Name</th>
                      <td>{{ studentProfileData.fatherName }}</td>
                    </tr>
                    <tr>
                      <th>Parent's mobile Number</th>
                      <td>{{ studentProfileData.mobileNumber }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal -->
    </div>
  </main>
</template>

<script>
import QrCode from "@/components/Dashboard/qr/QrCode.vue";
import axios from "axios";
export default {
  created() {
    this.studentData();
  },
  data() {
    return {
      nav_active: false,
      successMessage: "",
      errorMessage: "",
      admissionID: 100,
      profile: null,
      TableData: [],
      studentProfileData: null,
    };
  },
  watch: {
    admissionID(newAdmissioNumber, oldAdmissioNumber) {
      if (newAdmissioNumber !== oldAdmissioNumber && newAdmissioNumber > 100) {
        axios
          .get("students/details/admission/" + newAdmissioNumber)
          .then((res) => {
            this.profile = res.data.profile;
          });
      } else {
        return;
      }
    },
  },
  methods: {
    toggle(value) {
      this.nav_active = value;
    },
    studentData() {
      axios
        .get("/students/")
        .then((res) => {
          this.TableData = res.data.students;
        })
        .catch((err) => console.log(err));
    },
    studentProfile(stdID) {
      axios
        .get("/students/details/" + stdID)
        .then((res) => {
          this.studentProfileData = res.data.profile;
        })
        .catch((err) => console.log(err));
    },
    assign() {
      this.successMessage = "";
      this.errorMessage = "";
      axios
        .post("/students/assign", {
          admissionID: this.admissionID,
        })
        .then((res) => {
          this.successMessage = res.data.message;
          this.studentData();
        })
        .catch((err) => {
          this.errorMessage = err.response.data.message;
        });
    },
  },
  components: { QrCode },
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
  min-height: 100vh;

  .card {
    border-radius: 20px;
    overflow: hidden;
    z-index: 1;

    .card-head {
      height: 200px;
      background: linear-gradient(0deg, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)),
        url("@/assets/Dashboard/Student/banner.jpg");
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
      span.label {
        text-transform: capitalize;
      }

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
        &.btn-warning {
          background: var(--dashboard-main);
          color: #000;
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
