<template>
  <div
    class="card shadow-sm"
    @dragenter.prevent="enter"
    @dragleave.prevent="leave"
    @dragover.prevent
    @drop.prevent="drop($event)"
  >
    <div class="alert alert-danger" v-if="error">{{ error }}</div>
    <div class="alert alert-success" role="alert" v-if="successMsg">
      {{ successMsg }}
    </div>
    <div class="alert alert-warning" role="alert" v-if="processing">
      processing ....
    </div>
    <div class="card-body">
      <div class="drag">
        <form enctype="multipart/form-data">
          <p>
            Drag and Drop Your image or
            <br />
            <label for="profile_pic">Select File </label>
          </p>
          <input
            type="file"
            accept=".xlsx"
            id="profile_pic"
            @change.prevent="FileSelector($event)"
          />
        </form>
      </div>
      <ProgressBar
        v-if="upload_progress !== 0"
        :progress="upload_progress"
        class="my-2"
      />
    </div>
  </div>
</template>

<script>
import ProgressBar from "@/components/Dashboard/progress/ProgressBar.vue";
import axios from "axios";
export default {
  props: ["type"],
  data() {
    return {
      upload_progress: 0,
      processing: false,
      nav_active: false,
      error: null,
      dragCount: 0,
      files: null,
      images: null,
      successMsg: "",
    };
  },
  components: {
    ProgressBar,
  },
  methods: {
    enter() {
      this.dragCount++;
    },
    leave() {
      this.dragCount--;
    },
    drop(e) {
      e.stopPropagation();
      const files = e.dataTransfer.files;
      this.addFile(files[0]);
    },
    FileSelector(e) {
      this.files = e.target.files[0];
      this.addFile(e.target.files[0]);
    },
    addFile(file) {
      if (
        !file.type.match(
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        )
      ) {
        this.error = `${file.name} is not an excel file.`;
        return;
      } else {
        this.error = null;
        this.files = file;
        const form = new FormData();
        form.append("teacherList", file);
        if (this.type == "student") {
          axios
            .post("/data/bulk/student-list-upload", form, {
              onUploadProgress: (progress) => {
                this.error = "";
                this.upload_progress = Math.round(
                  (progress.loaded / progress.total) * 100
                );
                this.processing =
                  (progress.loaded / progress.total) * 100 == 100
                    ? true
                    : false;
              },
            })
            .then((res) => {
              if (res.data.status === 201) {
                this.processing = false;
                this.successMsg = res.data.message;
              }
            })
            .catch((err) => {
              this.successMsg = "";
              this.processing = false;
              this.error = err.response.data.message;
            });
        }
        if (this.type == "teacher") {
          axios
            .post("/data/bulk/teacher-list-upload", form, {
              onUploadProgress: (progress) => {
                this.error = "";
                this.upload_progress = Math.round(
                  (progress.loaded / progress.total) * 100
                );
                this.processing =
                  (progress.loaded / progress.total) * 100 == 100
                    ? true
                    : false;
              },
            })
            .then((res) => {
              if (res.data.status === 201) {
                this.processing = false;
                this.successMsg = res.data.message;
              }
            })
            .catch((err) => {
              this.successMsg = "";
              this.processing = false;
              this.error = err.response.data.message;
            });
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.card-body {
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

  .drag {
    width: 100%;
    height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--dashboard-secondary);
    border: 1px dashed var(--dashboard-color);
    text-align: center;
    color: var(--dashboard-color);

    label {
      font-weight: 800;
      text-transform: uppercase;
      cursor: pointer;
    }

    #profile_pic {
      display: none;
    }
  }

  .image_preview {
    width: 100%;
    height: 200px;
    margin-top: 10px;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
}
</style>
