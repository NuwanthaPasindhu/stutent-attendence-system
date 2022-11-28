import { createRouter, createWebHistory } from "vue-router";

import LoginPage from "@/views/Login/LoginPage";
import ForgotPassword from "@/views/ForgotPassword/ForgotPassword";
import PasswordUpdate from "@/views/ForgotPassword/PasswordUpdate";

import DashboardIndex from "@/views/Dashboard/DashboardIndex";
import AccountDetails from "@/views/Dashboard/Account/AccountDetails";
import AddSection from "@/views/Dashboard/sections/add/AddSection";
import AddTeacher from "@/views/Dashboard/sections/add/addTeacher";
import addAdmin from "@/views/Dashboard/sections/add/addAdmin";
import TeacherData from "@/views/Dashboard/data/TeacherData";
import StudentData from "@/views/Dashboard/data/StudentData";
import LogOut from "@/views/Dashboard/LogOut";

import AddClasses from "@/views/Dashboard/Classses/add/AddClasses";

import AttendanceMark from "@/views/Dashboard/attendance/AttendanceMark";
import StudentAdd from "@/views/Dashboard/students/StudentAdd";
import AssignStudent from "@/views/Dashboard/students/AssignStudent";
import AttendenceHistory from "@/views/Dashboard/attendance/AttendenceHistory";

import UserComplete from "@/views/errors/userComplete";
import AccessDenied from "@/views/errors/AccessDenied";
// Guards
import { admin, common, dashboard, sectionHead, teacher } from "@/guards";
const routes = [
  // Dashboard URLs
  {
    path: "/dashboard",
    name: "DashboardIndex",
    component: DashboardIndex,
    beforeEnter: dashboard,
  },
  {
    path: "/dashboard/logout",
    name: "LogOut",
    component: LogOut,
    beforeEnter: dashboard,
  },
  {
    path: "/dashboard/account",
    name: "AccountDetails",
    component: AccountDetails,
    beforeEnter: dashboard,
  },
  {
    path: "/dashboard/add-section",
    name: "AddSection",
    component: AddSection,
    beforeEnter: admin,
  },
  {
    path: "/dashboard/add-bulk-data/teacher",
    name: "TeacherData",
    component: TeacherData,
    beforeEnter: admin,
  },
  {
    path: "/dashboard/add-bulk-data/student",
    name: "StudentData",
    component: StudentData,
    beforeEnter: admin,
  },
  {
    path: "/dashboard/add-teacher",
    name: "AddTeacher",
    component: AddTeacher,
    beforeEnter: admin,
  },
  {
    path: "/dashboard/add-admin",
    name: "addAdmin",
    component: addAdmin,
    beforeEnter: admin,
  },

  // section head Access Url
  {
    path: "/dashboard/add-class",
    name: "AddClasses",
    component: AddClasses,
    beforeEnter: sectionHead,
  },
  // Teacher  Access Url
  {
    path: "/dashboard/attendance",
    name: "AttendanceMark",
    component: AttendanceMark,
    beforeEnter: teacher,
  },
  {
    path: "/dashboard/add-students",
    name: "StudentAdd",
    component: StudentAdd,
    beforeEnter: teacher,
  },
  {
    path: "/dashboard/assign-students",
    name: "AssignStudent",
    component: AssignStudent,
    beforeEnter: teacher,
  },
  {
    path: "/dashboard/attendance-history",
    name: "AttendenceHistory",
    component: AttendenceHistory,
    beforeEnter: teacher,
  },

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

  // ERROR Pages
  {
    path: "/account-complete",
    name: "UserComplete",
    component: UserComplete,
    beforeEnter: common,
  },
  {
    path: "/access-denied",
    name: "AccessDenied",
    component: AccessDenied,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
