<template>
  <select
    class="form-select"
    aria-label="Default select example"
    @change="selected_section($event)"
  >
    <option selected>Select The Section</option>
    <option v-for="(section, key) in allSections" :key="key" :value="section._id">
      {{ section.name + " SECTION" }}
    </option>
  </select>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      allSections: [],
    };
  },
  created() {
    this.sections();
  },
  methods: {
      selected_section(e) {
      this.$emit("selected_section", e.target.value);
    },
    sections() {
      axios
        .get("sections/all")
        .then((r) => {
          this.allSections = r.data.sections;
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
