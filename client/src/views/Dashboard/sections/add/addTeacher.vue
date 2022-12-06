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
                <h1>Create Teacher</h1>
              </div>
              <div class="card-body">
                <AddUserForm type="teacher" />
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-lg-12 col-md-12 mb-4">
            <div class="card shadow-sm">
              <div class="card-head">
                <h1>All Teacher</h1>
              </div>
              <div class="card-body">
                <AllTeacher />
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
import AllTeacher from "@/components/Dashboard/table/AllTeacher.vue";

export default {
  data() {
    return {
      nav_active: false,
    };
  },
  methods: {
    toggle(value) {
      this.nav_active = value;
    },
  },
  components: { AddUserForm, AllTeacher },
};
</script>

<style lang="scss" scoped></style>
