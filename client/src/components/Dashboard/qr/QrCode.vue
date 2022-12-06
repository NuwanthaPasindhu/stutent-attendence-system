<template>
  <a id="qrcode" :href="dataUrl" :download="studentName + '-' + admissionId">
    <img :src="dataUrl" class="qrCode" />
  </a>
</template>

<script>
import QRCode from "qrcode";
export default {
  created() {
    this.qrCodeGen(this.admissionId.toString());
  },
  props: {
    admissionId: { type: Number, required: true },
    studentName: { type: String, required: true },
  },
  data() {
    return {
      dataUrl: "",
    };
  },
  methods: {
    qrCodeGen(admissionId) {
      QRCode.toDataURL(admissionId, { width: 250 }).then(
        (data) => (this.dataUrl = data)
      );
    },
  },
};
</script>

<style lang="scss" scoped></style>
