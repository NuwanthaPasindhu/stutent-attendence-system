<template>
  <form>
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
    <div class="row mb-3">
      <div class="col-lg-6 col-md-12 my-2">
        <label for="exampleInputEmail1" class="form-label">Full Name</label>
        <span
          class="d-block text-danger font-weight-bold animate__animated animate__fadeIn"
          v-if="v$.fullName.$error"
          >* &nbsp;{{ v$.fullName.$errors[0].$message }}</span
        >
        <input type="text" class="form-control" v-model="state.fullName" />
      </div>
      <div class="col-lg-6 col-md-12 my-2">
        <span class="label">Mobile Number</span>
        <span
          class="d-block text-danger font-weight-bold animate__animated animate__fadeIn"
          v-if="v$.mobileNumber.$error"
          >* &nbsp;{{ v$.mobileNumber.$errors[0].$message }}</span
        >
        <input type="tel" v-model="state.mobileNumber" class="form-control" />
      </div>
      <div class="col-lg-12 col-md-12 my-2">
        <span class="label">Email</span>
        <span
          class="d-block text-danger font-weight-bold animate__animated animate__fadeIn"
          v-if="v$.email.$error"
          >* &nbsp;{{ v$.email.$errors[0].$message }}</span
        >
        <input type="email" v-model="state.email" class="form-control" />
      </div>
      <div class="col-lg-12 col-md-12 my-2">
        <span class="label">address</span>
        <span
          class="d-block text-danger font-weight-bold animate__animated animate__fadeIn"
          v-if="v$.address.$error"
          >* &nbsp;{{ v$.address.$errors[0].$message }}</span
        >
        <input type="text" v-model="state.address" class="form-control" />
      </div>
    </div>
    <div class="row mb-3">
      <button
        type="submit"
        class="btn"
        @click.prevent="handleTeacher"
        v-if="!sending && type === 'teacher'"
      >
        Add {{ type }}
      </button>
      <button
        type="submit"
        class="btn"
        @click.prevent="handleAdmin"
        v-if="!sending && type === 'admin'"
      >
        Add {{ type }}
      </button>
      <LoaderView v-if="sending" />
    </div>
  </form>
</template>

<script>
import axios from "axios";
import LoaderView from "@/components/loader/LoaderView.vue";
import useVuelidate from "@vuelidate/core";
import {
  helpers,
  minLength,
  maxLength,
  email,
  required,
  numeric,
} from "@vuelidate/validators";
import { reactive, computed } from "vue";
export default {
  setup() {
    const state = reactive({
      errorMessage: [],
      successMessage: "",
      fullName: "",
      mobileNumber: "",
      address: "",
      email: "",
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
  props: ["type"],
  data() {
    return {
      sending: false,
    };
  },
  methods: {
    handleTeacher() {
      this.v$.$validate();
      if (!this.v$.$error) {
        axios
          .post("/sections/create-teacher", {
            fullName: this.state.fullName,
            mobileNumber: this.state.mobileNumber,
            address: this.state.address,
            email: this.state.email,
          })
          .then((response) => {
            this.state.successMessage = response.data.message;
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
    handleAdmin() {
      this.v$.$validate();
      if (!this.v$.$error) {
        axios
          .post("/sections/create-admin", {
            fullName: this.state.fullName,
            mobileNumber: this.state.mobileNumber,
            address: this.state.address,
            email: this.state.email,
          })
          .then((response) => {
            this.state.successMessage = response.data.message;
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
  components: { LoaderView },
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
