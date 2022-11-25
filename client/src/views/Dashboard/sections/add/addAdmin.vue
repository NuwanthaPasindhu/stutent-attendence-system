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

<style lang="scss" scoped></style>
