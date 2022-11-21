<template>
  <select
    class="form-select"
    aria-label="Default select example"
    @change="selected_class($event)"
  >
    <option selected>Select The Class</option>
    <option
      v-for="(section, key) in allSectionClasses"
      :key="key"
      :value="section._id"
    >
      {{ section.name + " CLASS" }}
    </option>
  </select>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      allSectionClasses: [],
    };
  },
  created() {
    this.sectionClasses();
  },
  methods: {
    selected_class(e) {
      this.$emit("selected_class", e.target.value);
    },
    sectionClasses() {
      axios
        .get("classes/all")
        .then((r) => {
          this.allSectionClasses = r.data.classes;
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
