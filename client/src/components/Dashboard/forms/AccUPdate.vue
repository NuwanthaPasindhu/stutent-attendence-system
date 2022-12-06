<template>
  <form class="py-2">
    <div class="alert alert-danger" v-if="state.errorMessage.length > 0">
      <ul>
        <li v-for="(message, key) in state.errorMessage" :key="key">
          {{ message.message }}
        </li>
      </ul>
    </div>
    <div class="alert alert-success" v-if="state.successMessage">
      {{ state.successMessage }}
    </div>
    <div class="row my-3">
      <div class="col-lg-6 col-md-12 mb-4">
        <label for="exampleInputEmail1" class="form-label">Full Name</label>
        <span
          class="d-block text-danger font-weight-bold animate__animated animate__fadeIn"
          v-if="v$.fullName.$error"
          >* &nbsp;{{ v$.fullName.$errors[0].$message }}</span
        >
        <input type="text" class="form-control" v-model="state.fullName" />
      </div>

      <div class="col-lg-6 col-md-12 mb-4">
        <label for="exampleInputEmail1" class="form-label">Mobile Number</label>
        <span
          class="d-block text-danger font-weight-bold animate__animated animate__fadeIn"
          v-if="v$.mobileNumber.$error"
          >* &nbsp;{{ v$.mobileNumber.$errors[0].$message }}</span
        >
        <input type="tel" class="form-control" v-model="state.mobileNumber" />
      </div>
    </div>
    <div class="row my-3">
      <div class="col-lg-6 col-md-12 mb-4">
        <label for="exampleInputEmail1" class="form-label">Address</label>
        <span
          class="d-block text-danger font-weight-bold animate__animated animate__fadeIn"
          v-if="v$.address.$error"
          >* &nbsp;{{ v$.address.$errors[0].$message }}</span
        >
        <input type="text" class="form-control" v-model="state.address" />
      </div>
      <div class="col-lg-6 col-md-12">
        <label for="exampleInputEmail1" class="form-label">Email</label>
        <span
          class="d-block text-danger font-weight-bold animate__animated animate__fadeIn"
          v-if="v$.email.$error"
          >* &nbsp;{{ v$.email.$errors[0].$message }}</span
        >
        <input type="email" class="form-control" v-model="state.email" />
      </div>
    </div>

    <div class="row">
      <div class="col-lg-12">
        <button type="submit" class="btn" @click.prevent="handleSubmit">
          Update
        </button>
      </div>
    </div>
  </form>
</template>

<script>
import axios from "axios";
import useVuelidate from "@vuelidate/core";
import { reactive, computed } from "vue";
import { mapGetters, mapActions, useStore } from "vuex";
import {
  helpers,
  minLength,
  maxLength,
  email,
  required,
  numeric,
} from "@vuelidate/validators";
export default {
  computed: mapGetters({
    user: "auth/GET_USER",
  }),

  setup() {
    const store = useStore();

    const state = reactive({
      fullName: store.getters["auth/GET_USER"].fullName,
      mobileNumber: store.getters["auth/GET_USER"].mobileNumber,
      address: store.getters["auth/GET_USER"].address,
      email: store.getters["auth/GET_USER"].email,
      errorMessage: [],
      successMessage: "",
    });
    const rules = computed(() => {
      return {
        fullName: {
          required: helpers.withMessage(
            "The Full Name field is required",
            required
          ),
        },
        mobileNumber: {
          required: helpers.withMessage(
            "The mobile number field is required",
            required
          ),
          minLength: helpers.withMessage(
            "The mobile number must be at least 9 characters",
            minLength(9)
          ),
          maxLength: helpers.withMessage(
            "The mobile number should be a maximum of 11 characters",
            maxLength(11)
          ),
          numeric: helpers.withMessage(
            "The mobile number field must be numeric",
            numeric
          ),
        },
        address: {
          required: helpers.withMessage(
            "The address field is required",
            required
          ),
        },

        email: {
          required: helpers.withMessage(
            "The email field is required",
            required
          ),
          email: helpers.withMessage(
            "Please type a valid email address",
            email
          ),
        },
      };
    });
    const v$ = useVuelidate(rules, state);

    return { state, v$ };
  },
  methods: {
    ...mapActions({
      attempt: "auth/attempt",
    }),

    handleSubmit() {
      this.v$.$validate();
      if (!this.v$.$error) {
        axios
          .put("auth/profile-update/" + this.user._id, {
            fullName: this.state.fullName,
            mobileNumber: this.state.mobileNumber,
            address: this.state.address,
            email: this.state.email,
          })
          .then((response) => {
            this.state.successMessage = response.data.message;
            this.attempt(localStorage.getItem("token"));
          })
          .catch((e) => {
            if (typeof e.response.data.message === "string") {
              this.state.errorMessage.push({
                message: e.response.data.message,
              });
            } else {
              this.state.errorMessage = e.response.data.message;
            }
          });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
form {
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
</style>
