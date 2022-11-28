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
                <h1>Add Classes</h1>
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
                    <div class="col-lg-6 col-md-12 my-2">
                      <span class="label">Select the User</span>

                      <UserList @selected_user="selected_user" />
                    </div>
                    <div class="col-lg-6 col-md-12 my-2">
                      <span class="label">Select the User</span>

                      <SectionClassList @selected_class="selected_class" />
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
                            ? `http://localhost:4000/api/v1/${selectedUser.profilePic.link}`
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
                                {{ selectedUser.status }}</span
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
                                {{ selectedUser.profileComplete }}</span
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
                        v-for="(sectionClass, key) in TableConfig.TableData"
                        :key="key"
                      >
                        <td>{{ key + 1 }}</td>
                        <td>{{ sectionClass.classId.details }}</td>
                        <td>{{ sectionClass.userId.fullName }}</td>
                        <td>{{ sectionClass.userId.mobileNumber }}</td>
                        <button
                          class="btn"
                          @click="get_details(sectionClass.userId._id)"
                          data-bs-toggle="modal"
                          data-bs-target="#exampleModal"
                        >
                          Details
                        </button>
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
        id="exampleModal"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog modal-xl">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title heading" id="exampleModalLabel">
                Teacher Details
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
                <table class="table">
                  <thead>
                    <tr>
                      <th>Profile Pic</th>
                      <th>Class Teacher</th>
                      <th>Class Teacher Address</th>
                      <th>Class Teacher Mobile Number</th>
                      <th>Class Teacher Email</th>
                      <th>Class Teacher Profile Status</th>
                      <th>Class Teacher Profile complete</th>
                    </tr>
                  </thead>
                  <tbody v-if="userProfile">
                    <tr>
                      <td>
                        <img
                          :src="
                            userProfile.profilePic
                              ? `http://localhost:4000/api/v1/${userProfile.profilePic.link}`
                              : null
                          "
                          alt="Profile Picture"
                          class="profilePic"
                        />
                      </td>
                      <td>
                        {{ userProfile.fullName }}
                      </td>
                      <td>
                        {{ userProfile.address }}
                      </td>
                      <td>
                        {{ userProfile.mobileNumber }}
                      </td>
                      <td>
                        {{ userProfile.email }}
                      </td>
                      <td>
                        <span
                          class="badge"
                          :class="
                            userProfile.status ? ' bg-success' : 'bg-danger'
                          "
                        >
                          {{
                            userProfile.status
                              ? "Account Activated"
                              : "Account Blocked"
                          }}</span
                        >
                      </td>
                      <td>
                        <span
                          class="badge"
                          :class="
                            userProfile.profileComplete
                              ? ' bg-success'
                              : 'bg-danger'
                          "
                        >
                          {{
                            userProfile.profileComplete
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
      <!-- Modal -->
    </div>
    <!-- Dashboard  Contents -->
  </main>
</template>

<script>
import UserList from "@/components/Dashboard/Users/UserList.vue";
import axios from "axios";
import { reactive } from "vue";
import LoaderView from "@/components/loader/LoaderView.vue";
import SectionClassList from "@/components/Dashboard/sectionClasses/SectionClassList.vue";
export default {
  created() {
    this.sectionClassesTeacher();
  },
  setup() {
    const state = reactive({
      userID: "",
      selectedClass: "",
      year: "",
    });

    return { state };
  },
  data() {
    return {
      selectedUser: null,
      errors: null,
      errorMessage: null,
      success: null,
      sending: false,
      nav_active: false,
      TableConfig: {
        TableData: {},
        TableHeaders: ["#", "Class", "Name", "Mobile Number", "Details"],
        Heading: "Classes",
      },
      userProfile: null,
    };
  },
  methods: {
    toggle(value) {
      this.nav_active = value;
    },
    sectionClassesTeacher() {
      axios
        .get("classes/teacher-list")
        .then((r) => {
          this.TableConfig.TableData = r.data.sectionTeacherList;
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
        .post("/classes/create", {
          userID: this.state.userID,
          sectionClass: this.state.selectedClass,
        })
        .then((response) => {
          if (response.data.status == 201) {
            this.success = response.data.message;
            this.sending = false;
          }
        })
        .catch((e) => {
          if (typeof e.response.data.message == "string") {
            this.errorMessage = e.response.data.message;
          } else {
            this.errors = e.response.data.message;
          }
          this.success = null;
          this.sending = false;
        });
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
    selected_class(selectedClass) {
      this.state.selectedClass = selectedClass;
    },
    get_details(userID) {
      axios
        .get("/details/users/" + userID)
        .then((r) => {
          this.userProfile = r.data.user;
        })
        .catch((e) => {
          console.log(e);
        });
    },
  },
  components: { LoaderView, UserList, SectionClassList },
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
  .btn {
    background: var(--dashboard-color);
    color: #fff;
  }
}
</style>
