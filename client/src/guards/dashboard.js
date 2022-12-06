import router from "@/router";

const guard = (to, from, next) => {
  if (
    localStorage.getItem("token") !== null ||
    localStorage.getItem("role") !== null
  ) {
    if (localStorage.getItem("accComplete") == "true") {
      next();
    } else {
      router.replace("/account-complete");
    }
  } else {
    next("/");
  }
};

export default guard;
