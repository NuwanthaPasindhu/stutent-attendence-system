<template>
  <div class="card shadow w-100">
    <div
      class="card-header py-3 d-flex flex-row align-items-center justify-content-between"
    >
      <h6 class="m-0 heading"></h6>
      <button class="btn btn-success" @click.prevent="getUsers()">
        <box-icon name="refresh" color="white" animation="spin"></box-icon>
      </button>
    </div>
    <div class="card-body">
      <div class="table-responsive" style="max-height: 400px; overflow: auto">
        <table class="table table-hover">
          <thead>
            <tr>
              <th>Profile Pic</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>address</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="(user, key) in users" :key="key">
              <td>
                <img
                  :src="
                    user.profilePic
                      ? `http://localhost:4000/api/v1/${user.profilePic.link}`
                      : null
                  "
                  alt="Profile Picture"
                  class="profilePic"
                />
              </td>
              <td>{{ user.fullName }}</td>
              <td>{{ user.email }}</td>
              <td>{{ user.mobileNumber }}</td>
              <td>{{ user.address }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      users: [],
    };
  },
  created() {
    this.getUsers();
  },
  methods: {
    getUsers() {
      axios
        .get("/details/users/all")
        .then((r) => {
          this.users = r.data.allUsers;
        })
        .catch((e) => {
          console.log(e);
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.profilePic {
  width: 100px;
  height: 100px;
  object-fit: cover;
}
</style>
