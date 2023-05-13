import express from "express";
const app = express();

import User from "./User/user.router.js";
import Admin from "./Admin/admin.router.js";
import Departments from "./Departments/departments.router.js";
import Specialist from "./Specialist/specialist.router.js";
import appSettings from "./App_Settings/app.router.js";

import Appointment from "./Appointment/appointment.router.js";

import Contact_us from "./Contact_us/contact.router.js";
import Report from "./Report/Report.router.js";

app.use("/user", User);
app.use("/admin", Admin);
app.use("/departements", Departments);
app.use("/specialist", Specialist);
app.use("/appSettings", appSettings);
app.use("/appointment", Appointment);

app.use("/contact", Contact_us);
app.use("/reports", Report);
export default app;
