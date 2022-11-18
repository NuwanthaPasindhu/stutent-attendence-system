<template>
  <select
    class="form-select"
    aria-label="Default select example"
    @change="selected_User($event)"
  >
    <option selected>Select The User</option>
    <option v-for="(user, key) in users" :key="key" :value="user._id">
      {{ user.fullName }}
    </option>
  </select>
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
      selected_User(e) {
      this.$emit("selected_user", e.target.value);
    },
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
select {
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
</style>
