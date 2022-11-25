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
          <div class="col-lg-8 col-md-12">
            <div class="card shadow w-100">
              <div class="card-head">
                <h1>Add Student</h1>
              </div>
              <div class="card-body">
                <form>
                  <div
                    class="alert alert-danger my-3"
                    v-for="(messages, key) in ermessage"
                    :key="key"
                  >
                    <ul>
                      <li v-for="(msg, key) in messages" :key="key">
                        {{ msg }}
                      </li>
                    </ul>
                  </div>
                  <div class="alert alert-success my-3" v-if="message">
                    {{ message }}
                  </div>
                  <div class="row mb-3">
                    <div class="col-lg-6 col-md-12 my-2">
                      <span class="label">admission number</span>
                      <span
                        class="d-block text-danger font-weight-bold animate__animated animate__fadeIn"
                        v-if="v$.admission_number.$error"
                        >* &nbsp;{{
                          v$.admission_number.$errors[0].$message
                        }}</span
                      >
                      <input
                        type="number"
                        class="form-control"
                        v-model="state.admission_number"
                      />
                    </div>
                    <div class="col-lg-6 col-md-12 my-2">
                      <span class="label">full name</span>
                      <span
                        class="d-block text-danger font-weight-bold animate__animated animate__fadeIn"
                        v-if="v$.full_name.$error"
                        >* &nbsp;{{ v$.full_name.$errors[0].$message }}</span
                      >
                      <input
                        type="text"
                        class="form-control"
                        v-model="state.full_name"
                      />
                    </div>
                  </div>
                  <div class="row mb-3">
                    <div class="col-lg-6 col-md-12 my-2">
                      <span class="label">mobile number </span>
                      <span
                        class="d-block text-danger font-weight-bold animate__animated animate__fadeIn"
                        v-if="v$.mobile_number.$error"
                        >* &nbsp;{{
                          v$.mobile_number.$errors[0].$message
                        }}</span
                      >
                      <input
                        type="text"
                        class="form-control"
                        v-model="state.mobile_number"
                      />
                    </div>
                    <div class="col-lg-6 col-md-12 my-2">
                      <span class="label">address</span>
                      <span
                        class="d-block text-danger font-weight-bold animate__animated animate__fadeIn"
                        v-if="v$.address.$error"
                        >* &nbsp;{{ v$.address.$errors[0].$message }}</span
                      >
                      <input
                        type="text"
                        class="form-control"
                        v-model="state.address"
                      />
                    </div>
                  </div>
                  <div class="row mb-3">
                    <div class="col-lg-6 col-md-12 my-2">
                      <span class="label">mother's name </span>
                      <span
                        class="d-block text-danger font-weight-bold animate__animated animate__fadeIn"
                        v-if="v$.mother_name.$error"
                        >* &nbsp;{{ v$.mother_name.$errors[0].$message }}</span
                      >
                      <input
                        type="text"
                        class="form-control"
                        v-model="state.mother_name"
                      />
                    </div>
                    <div class="col-lg-6 col-md-12 my-2">
                      <span class="label">father's name</span>
                      <span
                        class="d-block text-danger font-weight-bold animate__animated animate__fadeIn"
                        v-if="v$.father_name.$error"
                        >* &nbsp;{{ v$.father_name.$errors[0].$message }}</span
                      >
                      <input
                        type="text"
                        class="form-control"
                        v-model="state.father_name"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    class="btn"
                    @click.prevent="handleSubmit"
                  >
                    Add Student
                  </button>
                  <button
                    type="button"
                    class="btn mx-5"
                    data-bs-toggle="modal"
                    data-bs-target="#exampleModal"
                  >
                    Add All Student
                  </button>
                </form>
              </div>
            </div>
          </div>
          <div class="col-lg-4 col-md-12">
            <div class="card shadow w-100">
              <div class="card-head">
                <h1>Download the excel file to be filled</h1>
              </div>
              <div class="card-body">
                <button
                  type="button"
                  class="btn w-100"
                  @click.prevent="download"
                >
                  <box-icon
                    name="cloud-download"
                    class="d-block mx-auto"
                    size="large"
                    type="solid"
                    animation="fade-down"
                  ></box-icon>
                  <span class="bg-success p-2 rounded text-light"
                    >Click here to download</span
                  >
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <dashboard-footer />
      <!-- Modal -->
      <div
        class="modal fade"
        id="exampleModal"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
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
              <DataUploader type="student" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Dashboard  Contents -->
  </main>
</template>

<script>
import axios from "axios";
import useVuelidate from "@vuelidate/core";
import { reactive, computed } from "vue";
import {
  helpers,
  minLength,
  maxLength,
  required,
  numeric,
} from "@vuelidate/validators";
import DataUploader from "@/components/Dashboard/uploads/dataUploader.vue";
export default {
  created() {},
  setup() {
    const state = reactive({
      admission_number: "",
      full_name: "",
      mobile_number: "",
      address: "",
      mother_name: "",
      father_name: "",
    });
    const rules = computed(() => {
      return {
        admission_number: {
          required: helpers.withMessage(
            "The admission number field required",
            required
          ),
          numeric: helpers.withMessage(
            "The admission number must be a number",
            numeric
          ),
        },
        full_name: {
          required: helpers.withMessage("Full name field required", required),
        },
        mobile_number: {
          required: helpers.withMessage(
            "The mobile number field required",
            required
          ),
          numeric: helpers.withMessage(
            "The mobile number must be a number",
            numeric
          ),
          minLength: helpers.withMessage(
            "The mobile number must be at least 9 characters",
            minLength(9)
          ),
          maxLength: helpers.withMessage(
            "The mobile number should be a maximum of 11 characters",
            maxLength(11)
          ),
        },
        address: {
          required: helpers.withMessage("The address field required", required),
        },
        mother_name: {
          required: helpers.withMessage(
            "The mother name field required",
            required
          ),
        },
        father_name: {
          required: helpers.withMessage(
            "The father name field required",
            required
          ),
        },
      };
    });
    const v$ = useVuelidate(rules, state);
    return { state, v$ };
  },
  data() {
    return {
      ermessage: "",
      message: false,
      nav_active: false,
      TableConfig: {
        TableData: {},
        TableHeaders: [
          "admission number",
          "student name",
          "mobile number",
          "address",
          "mother's name",
          "father's name",
        ],
        Heading: "Students",
      },
    };
  },
  methods: {
    toggle(value) {
      this.nav_active = value;
    },
    handleSubmit() {
      this.v$.$validate();
      if (!this.v$.$error) {
        alert("Hello");
      }
    },
    download() {
      window.location.href = `${axios.defaults.baseURL}/storage/bulkData/module/studentList.xlsx`;
    },
  },
  components: { DataUploader },
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
      form {
        span.label {
          text-transform: capitalize;
        }

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
    }
  }

  .popup {
    min-height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
  }
}
</style>
