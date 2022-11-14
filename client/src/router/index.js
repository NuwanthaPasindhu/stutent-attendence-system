import { createRouter, createWebHistory } from 'vue-router'

import LoginPage from "@/views/Login/LoginPage";
import ForgotPassword from "@/views/ForgotPassword/ForgotPassword";
import PasswordUpdate from "@/views/ForgotPassword/PasswordUpdate";
const routes = [
  // Public Access Url

  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/login",
    name: "LoginPage",
    component: LoginPage,
  },
  {
    path: "/forgot-password",
    name: "ForgotPassword",
    component: ForgotPassword,
  },
  {
    path: "/password-update",
    name: "PasswordUpdate",
    component: PasswordUpdate,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
