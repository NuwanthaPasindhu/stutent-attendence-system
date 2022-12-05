<template>
  <div class="card-body">
    <div class="alert alert-danger" role="alert" v-if="errorMessage">
      {{ errorMessage }}
    </div>
    <QrcodeStream @decode="onDecode" />
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
      this.$emit("decoded", JSON.stringify(decode));
    },
  },
};
</script>

<style lang="scss" scoped></style>
