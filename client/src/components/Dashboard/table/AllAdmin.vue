<template>
  <div class="card shadow w-100">
    <div
      class="card-header py-3 d-flex flex-row align-items-center justify-content-between"
    >
      <h6 class="m-0 heading"></h6>
    </div>
    <div class="card-body">
      <div class="table-responsive">
        <table class="table table-hover">
          <thead>
            <tr>
              <th>Profile Pic</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>address</th>
              <th>Profile Status</th>
              <th>Profile complete</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="(user, key) in admin" :key="key">
              <td>
                <img
                  :src="
                    user.profilePic
                      ? `http://192.168.1.2:4000/api/v1/${user.profilePic.link}`
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
              <td>
                <span
                  class="badge"
                  :class="user.status ? ' bg-success' : 'bg-danger'"
                >
                  {{
                    user.status ? "Account Activated" : "Account Blocked"
                  }}</span
                >
              </td>
              <td>
                <span
                  class="badge"
                  :class="user.profileComplete ? ' bg-success' : 'bg-danger'"
                >
                  {{
                    user.profileComplete
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
</template>

<script>
export default {
  props: {
    admin: {
      type: Array,
      required: true,
    },
  },

  methods: {},
};
</script>

<style lang="scss" scoped>
.profilePic {
  width: 100px;
  height: 100px;
  object-fit: cover;
}
</style>
