import { createApp } from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import "bootstrap/dist/css/bootstrap.min.css";
import "animate.css";
import "bootstrap";
import "@/config/axio.config"
import "@/store/auth/subscriber";

const app = createApp(App);
app.use(store);
app.use(router);
app.mount("#app");


if (localStorage.getItem("token")) {
  store.dispatch("auth/attempt", localStorage.getItem("token"));
}
