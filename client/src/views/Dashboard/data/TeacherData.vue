<template>
  <main class="d-flex">
    <side-bar :open="nav_active" />
    <!-- Dashboard  Contents -->
    <div class="container-fluid">
      <!-- Nav Bar Start  -->
      <NavBar @toggleNav="toggle" />
      <!-- Nav Bar End  -->
      <div class="container py-4 my-5">
        <div class="row">
          <div class="col-lg-8 col-md-12 mb-4">
            <div class="card shadow-sm">
              <div class="card-head">
                <h1>Upload Teachers</h1>
              </div>
              <div class="card-body">
                <DataUploader />
              </div>
            </div>
          </div>
          <div class="col-lg-4 col-md-12 mb-4">
            <div class="card shadow-sm">
              <div class="card-head">
                <h1>Download the excel file to be filled</h1>
              </div>
              <div class="card-body">
                <button
                  type="button"
                  class="btn w-100"
                  @click.prevent="download"
                >
                  <box-icon
                    name="cloud-download"
                    class="d-block mx-auto"
                    size="large"
                    type="solid"
                    animation="fade-down"
                  ></box-icon>
                  <span class="bg-success p-2 rounded text-light"
                    >Click here to download</span
                  >
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <dashboard-footer />
    </div>
  </main>
</template>

<script>
import DataUploader from "@/components/Dashboard/uploads/dataUploader.vue";
import axios from "axios";
export default {
  data() {
    return {
      nav_active: false,
    };
  },
  methods: {
    toggle(value) {
      this.nav_active = value;
    },
    download() {
      window.location.href = `${axios.defaults.baseURL}/storage/bulkData/module/teacherList.xlsx`;
    },
  },
  components: { DataUploader },
};
</script>

<style lang="scss" scoped>
main {
  width: 100vw;
  min-height: 100vh;
  height: auto;
  overflow-x: hidden;

  .modal {
    .profilePic {
      width: 100px;
      height: 100px;
      object-fit: cover;
    }
  }
}

.heading {
  font-weight: 800;
  color: var(--dashboard-color);
  text-transform: uppercase;
}

.container {
  overflow-x: hidden;
  min-height: 100vh;

  .card {
    border-radius: 20px;
    overflow: hidden;
    z-index: 1;

    .card-head {
      height: 200px;
      background: linear-gradient(0deg, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)),
        url("@/assets/Dashboard/data/banner.jpg");
      background-size: cover;
      background-position: center center;
      display: flex;
      align-items: center;
      justify-content: center;
      h1 {
        color: #ffff;
        font-weight: 900;
      }
    }

    .card-body {
      form {
        textarea,
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

      .row {
        overflow-x: hidden;

        table {
          tr {
            th {
              text-transform: uppercase;
            }
          }
        }
      }
    }
  }

  .popup {
    min-height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
  }
}
</style>
