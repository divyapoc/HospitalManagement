import Service from "./appointment.service.js";

async function requestedappointment(req, res, next) {
  await Service.requestedappointment(req.body, res, function (result) {
    console.log(result);
    return res.json({ message: result.message });
  });
}

async function Booked(req, res, next) {
  await Service.Booked(req.body, res, function (result) {
    return res.json({ message: result.message });
  });
}

async function getRequestedAppointment(req, res, next) {
  await Service.getRequestedAppointment(req, res, function (result) {
    return res.json({ message: result.message });
  });
}

async function confirmAppointment(req, res, next) {
  await Service.confirmAppointment(req, res, function (result) {
    return res.json({ message: result.message });
  });
}

async function denyAppointment(req, res, next) {
  await Service.denyAppointment(req, res, function (result) {
    return res.json({ message: result.message });
  });
}

async function getTodayAppointment(req, res, next) {
  await Service.getTodayAppointment(req, res, function (result) {
    return res.json({ message: result.message });
  });
}

async function getTodayApp(req, res, next) {
  await Service.getTodayApp(req, res, function (result) {
    return res.json({ message: result.message });
  });
}

async function getAppointmenthistory(req, res, next) {
  await Service.getAppointmenthistory(req, res, function (result) {
    return res.json({ message: result.message });
  });
}

async function getConformAppointment(req, res, next) {
  await Service.getConformAppointment(req, res, function (result) {
    return res.json({ message: result.message });
  });
}

export default {
  requestedappointment,
  getRequestedAppointment,
  Booked,
  confirmAppointment,
  denyAppointment,
  getTodayAppointment,
  getTodayApp,
  getAppointmenthistory,
  getConformAppointment,
};
