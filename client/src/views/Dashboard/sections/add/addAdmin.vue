<template>
  <main class="d-flex">
    <side-bar :open="nav_active" />
    <!-- Dashboard  Contents -->
    <div class="container-fluid">
      <!-- Nav Bar Start  -->
      <NavBar @toggleNav="toggle" />
      <!-- Nav Bar End  -->
      <div class="container py-4 my-5">
        <div class="row">
          <div class="col-lg-12 col-md-12 mb-4">
            <div class="card shadow-sm">
              <div class="card-head">
                <h1>Create Admin</h1>
              </div>
              <div class="card-body">
                <AddUserForm type="admin" :refresh="getUsers()" />
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-lg-12 col-md-12 mb-4">
            <div class="card shadow-sm">
              <div class="card-head">
                <h1>All Admin</h1>
              </div>
              <div class="card-body">
                <AllAdmin :admin="users" />
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
import AddUserForm from "@/components/Dashboard/forms/AddUserForm.vue";
import AllAdmin from "@/components/Dashboard/table/AllAdmin.vue";
import axios from "axios";
export default {
  created() {
    this.getUsers();
  },
  data() {
    return {
      nav_active: false,
      users: [],
    };
  },
  methods: {
    toggle(value) {
      this.nav_active = value;
    },
    getUsers() {
      axios
        .get("/sections/all-admin")
        .then((r) => {
          this.users = r.data.allUsers;
        })
        .catch((e) => {
          console.log(e);
        });
    },
  },
  components: { AddUserForm, AllAdmin },
};
</script>

<style lang="scss" scoped>
main {
  width: 100vw;
  min-height: 100vh;
  height: auto;
  overflow-x: hidden;

  .profilePic {
    width: 100px;
    height: 100px;
    object-fit: cover;
  }
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
}
</style>
