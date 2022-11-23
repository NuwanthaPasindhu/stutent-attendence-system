<template>
  <div class="card-body">
    <div class="alert alert-danger" role="alert" v-if="errorMessage">
      {{ errorMessage }}
    </div>
    <QrcodeStream @onInit="onInit" @decode="onDecode" />
  </div>
</template>

<script>
import { QrcodeStream } from "qrcode-reader-vue3";
export default {
  components: { QrcodeStream },
  data() {
    return {
      nav_active: false,
      attendance_history: [],
      errorMessage: "",
    };
  },

  methods: {
    onDecode(decodeString) {
      const decode = {
        admissionId: decodeString,
      };
      console.log(JSON.stringify(decode));
      //   this.$emit("decode",decodeString)
    },
    async onInit(promise) {
      try {
        await promise;
      } catch (error) {
        if (error.name === "NotAllowedError") {
          this.errorMessage = "user denied camera access permisson";
        } else if (error.name === "NotFoundError") {
          this.errorMessage = "no suitable camera device installed";
        } else if (error.name === "NotSupportedError") {
          this.errorMessage = "page is not served over HTTPS (or localhost)";
        } else if (error.name === "NotReadableError") {
          this.errorMessage = "maybe camera is already in use";
        } else if (error.name === "OverconstrainedError") {
          this.errorMessage =
            "did you requested the front camera although there is none?";
        } else if (error.name === "StreamApiNotSupportedError") {
          this.errorMessage = "browser seems to be lacking features";
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
