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
                <h1>Add Sections</h1>
              </div>
              <div class="card-body">
                <div class="alert alert-danger" v-if="errorMessage">
                  {{ errorMessage }}
                </div>
                <div class="alert alert-success" v-if="success">
                  {{ success }}
                </div>
                <div class="alert alert-danger" v-if="errors">
                  <ul>
                    <li v-for="(error, key) in errors" :key="key">
                      {{ error.message }}
                    </li>
                  </ul>
                </div>
                <form>
                  <div class="row mb-3">
                    <div class="col-lg-12 col-md-12 my-2">
                      <span class="label">Select the User</span>

                      <UserList @selected_user="selected_user" />
                    </div>
                  </div>

                  <div class="row mb-3">
                    <div class="col-lg-6 col-md-12 my-2">
                      <span class="label">Select the section</span>

                      <SectionList @selected_section="selected_section" />
                    </div>
                    <div class="col-lg-6 col-md-12 my-2">
                      <span class="label">Year</span>
                      <YearSelector @year="selected_year" />
                    </div>
                  </div>

                  <div class="row mb-3">
                    <button
                      type="submit"
                      class="btn"
                      @click.prevent="AddSection"
                      v-if="!sending"
                    >
                      Add Section
                    </button>
                    <LoaderView v-if="sending" />
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div class="col-lg-6 col-md-12">
            <div class="card shadow w-100">
              <div class="card-head">
                <h1>User Details</h1>
              </div>
              <div class="card-body">
                <div class="row mb-3">
                  <div class="col-lg-12 col-md-12 my-2">
                    <!-- Profile Details Start -->
                    <div class="profile_card" v-if="selectedUser">
                      <img
                        class="profile_pic"
                        :src="
                          selectedUser.profilePic
                            ? `http://www.localhost:4000/api/v1/${selectedUser.profilePic.link}`
                            : 'https://images.pexels.com/photos/14270861/pexels-photo-14270861.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
                        "
                        alt=""
                        srcset=""
                      />
                    </div>
                    <!-- Profile Details End -->
                  </div>

                  <div class="col-lg-12 col-md-12 my-2">
                    <div class="table-responsive">
                      <table class="table table-striped table-bordered">
                        <tbody>
                          <tr>
                            <th>ID</th>
                            <td v-if="selectedUser">{{ selectedUser._id }}</td>
                          </tr>
                          <tr>
                            <th>Full Name</th>
                            <td v-if="selectedUser">
                              {{ selectedUser.fullName }}
                            </td>
                          </tr>
                          <tr>
                            <th>Mobile Number</th>
                            <td v-if="selectedUser">
                              {{ selectedUser.mobileNumber }}
                            </td>
                          </tr>
                          <tr>
                            <th>email</th>
                            <td v-if="selectedUser">
                              {{ selectedUser.email }}
                            </td>
                          </tr>
                          <tr>
                            <th>Address</th>
                            <td v-if="selectedUser">
                              {{ selectedUser.address }}
                            </td>
                          </tr>
                          <tr>
                            <th>status</th>
                            <td v-if="selectedUser">
                              <span
                                class="badge"
                                :class="
                                  selectedUser.status
                                    ? ' bg-success'
                                    : 'bg-danger'
                                "
                              >
                                {{
                                  selectedUser.status
                                    ? "Account Activated"
                                    : "Account Blocked"
                                }}</span
                              >
                            </td>
                          </tr>
                          <tr>
                            <th>profileComplete</th>
                            <td v-if="selectedUser">
                              <span
                                class="badge"
                                :class="
                                  selectedUser.profileComplete
                                    ? ' bg-success'
                                    : 'bg-danger'
                                "
                              >
                                {{
                                  selectedUser.profileComplete
                                    ? "profile Completed"
                                    : "Profile not Completed"
                                }}</span
                              >
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
        </div>
        <div class="row my-5">
          <div class="col-lg-12 col-md-12">
            <div class="card shadow w-100">
              <div
                class="card-header py-3 d-flex flex-row align-items-center justify-content-between"
              >
                <h6 class="m-0 heading">{{ TableConfig.Heading }}</h6>
              </div>
              <div class="card-body">
                <div class="table-responsive">
                  <table class="table table-hover">
                    <thead>
                      <tr>
                        <th
                          v-for="(TableHeader, key) in TableConfig.TableHeaders"
                          :key="key"
                        >
                          {{ TableHeader }}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="(row, key) in TableConfig.TableData"
                        :key="key"
                      >
                        <td>{{ row.name }}</td>
                        <td>{{ row.details }}</td>
                        <td><YearSelector @year="selectedSectionYear" /></td>
                        <td>
                          <button
                            class="btn btn-success"
                            @click="get_details(row._id)"
                            data-bs-toggle="modal"
                            data-bs-target="#exampleModal"
                          >
                            Details
                          </button>
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
    <!-- Dashboard  Contents -->
    <!-- Button trigger modal -->
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
            <div class="table-responsive">
              <table class="table table-hover">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Class Year</th>
                    <th>Class Name</th>
                    <th>Class Details</th>
                    <th>Profile Pic</th>
                    <th>Class Teacher</th>
                    <th>Class Teacher Address</th>
                    <th>Class Teacher Mobile Number</th>
                    <th>Class Teacher Email</th>
                    <th>Class Teacher Profile Status</th>
                    <th>Class Teacher Profile complete</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(section, key) in section_details" :key="key">
                    <td>{{ key + 1 }}</td>
                    <td>{{ section.year }}</td>
                    <td>{{ section.classId.name }}</td>
                    <td>{{ section.classId.details }}</td>
                    <td>
                      <img
                        :src="
                          section.userId.profilePic
                            ? `http://localhost:4000/api/v1/${section.userId.profilePic.link}`
                            : null
                        "
                        alt="Profile Picture"
                        class="profilePic"
                      />
                    </td>
                    <td>{{ section.userId.fullName }}</td>
                    <td>{{ section.userId.address }}</td>
                    <td>{{ section.userId.mobileNumber }}</td>
                    <td>{{ section.userId.email }}</td>
                    <td>
                      <span
                        class="badge"
                        :class="
                          section.userId.status ? ' bg-success' : 'bg-danger'
                        "
                      >
                        {{
                          section.userId.status
                            ? "Account Activated"
                            : "Account Blocked"
                        }}</span
                      >
                    </td>
                    <td>
                      <span
                        class="badge"
                        :class="
                          section.userId.profileComplete
                            ? ' bg-success'
                            : 'bg-danger'
                        "
                      >
                        {{
                          section.userId.profileComplete
                            ? "Account Completed"
                            : "Account not Completed"
                        }}</span
                      >
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
import SectionList from "@/components/Dashboard/sections/SectionList.vue";
import UserList from "@/components/Dashboard/Users/UserList.vue";
import YearSelector from "@/components/Dashboard/years/YearSelector.vue";
import axios from "axios";
import { reactive } from "vue";
import LoaderView from "@/components/loader/LoaderView.vue";
export default {
  created() {
    this.sections();
  },
  setup() {
    const state = reactive({
      userID: "",
      section: "",
      year: "",
    });

    return { state };
  },
  data() {
    return {
      errors: null,
      errorMessage: null,
      success: null,
      sending: false,
      section_details: null,
      sectionYear: new Date().getFullYear(),
      nav_active: false,
      TableConfig: {
        TableData: {},
        TableHeaders: ["Section", "Additional Data", "Year", "more details"],
        Heading: "Sections",
      },
      selectedUser: null,
    };
  },
  methods: {
    toggle(value) {
      this.nav_active = value;
    },
    selected_year(year) {
      this.state.year = year;
    },
    selectedSectionYear(year) {
      this.sectionYear = year;
    },
    selected_user(user) {
      this.state.userID = user;
      axios
        .get(`/details/users/${user}`)
        .then((response) => {
          this.selectedUser = response.data.user;
          this.errorMessage = null;
        })
        .catch((error) => {
          this.errorMessage = error.response.data.message;
        });
    },
    selected_section(section) {
      this.state.section = section;
    },
    sections() {
      axios
        .get("sections/all")
        .then((r) => {
          this.TableConfig.TableData = r.data.sections;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    AddSection() {
      this.sending = true;
      this.errorMessage = null;
      this.errors = null;
      axios
        .post("/sections/create", this.state)
        .then((response) => {
          if (response.data.status == 201) {
            this.success = response.data.message;
            this.sections();
            this.sending = false;
          }
        })
        .catch((e) => {
          this.sections();
          if (typeof e.response.data.message == "string") {
            this.errorMessage = e.response.data.message;
          } else {
            this.errors = e.response.data.message;
          }
          this.success = null;
          this.sending = false;
        });
    },
    get_details(id) {
      axios
        .get(`sections/details/${id}/${this.sectionYear}`)
        .then((response) => {
          this.section_details = response.data.sectionClasses;
        })
        .catch((e) => {
          console.log(e);
        });
    },
  },
  components: { SectionList, YearSelector, LoaderView, UserList },
};
</script>

<style lang="scss" scoped>
main {
  width: 100vw;
  min-height: 100vh;
  height: auto;
  overflow-x: hidden;

  .modal {
    .profilePic {
      width: 100px;
      height: 100px;
      object-fit: cover;
    }
  }
}

.heading {
  font-weight: 800;
  color: var(--dashboard-color);
  text-transform: uppercase;
}

.container {
  overflow-x: hidden;
  min-height: 100vh;

  .card {
    border-radius: 20px;
    overflow: hidden;
    z-index: 1;

    .profile_card {
      height: 150px;

      img.profile_pic {
        width: 150px;
        height: 150px;
        border-radius: 50%;
        display: block;
        margin: 0 auto;
        object-fit: cover;
        border: 5px solid var(--dashboard-main);
        padding: 2px;
        transform: translate(0px, 0%);
      }
    }

    img.profile_pic {
      width: 150px;
      height: 150px;
      border-radius: 50%;
      object-fit: cover;
      transform: translate(0px, 55%);
      border: 5px solid var(--dashboard-main);
      padding: 2px;
    }
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
