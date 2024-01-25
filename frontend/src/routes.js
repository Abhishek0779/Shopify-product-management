// import
import Dashboard from "./views/Dashboard/Dashboard";
import ActivityLog from "./views/Dashboard/ActivityLog";
import Product from "./views/Dashboard/Products";
import SignIn from "./views/Auth/SignIn.js";
import SignUp from "./views/Auth/SignUp.js";

import {
  HomeIcon,
  DocumentIcon,
  RocketIcon,
} from "./components/Icons/Icons";

// array of route objects
var dashRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    rtlName: "لوحة القيادة",
    icon: <HomeIcon color="inherit" />,
    component: Dashboard,
    layout: "/admin",
  },
  {
    path: "/product/:id",
    name: "product",
    rtlName: "",
    icon:"",
    component: Product,
    layout: "/admin",
  },
  {
    path: "/activity-log",
    name: "Activity Log",
    rtlName: " ",
    icon:"",
    component: ActivityLog,
    layout: "/admin",
  },
  {
    path: "/signin",
    name: "Sign In",
    rtlName: "لوحة القيادة",
    icon: <DocumentIcon color="inherit" />,
    component: SignIn,
    layout: "/auth",
  },
  {
    path: "/signup",
    name: "Sign Up",
    rtlName: "لوحة القيادة",
    icon: <RocketIcon color="inherit" />,
    secondaryNavbar: true,
    component: SignUp,
    layout: "/auth",
  }
];
export default dashRoutes;
