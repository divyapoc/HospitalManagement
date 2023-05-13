import "./App.css";
import React, { useEffect, useState } from "react";
import jwt_decode from "jwt-decode";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Admin-management/dashboard/Dashboard";
import Homepage from "./components/homepage/Homepage";
import Navbar from "./components/navbar/Navbar";
import Contact from "./components/contact/Contact";
import Managemtnt_Login from "./components/management/Managemtnt_Login";
import Sign_up from "./components/management/Sign_up";
import Doctorlist from "./components/doctorpage/Doctorlist";
import Patient from "./components/for_patient/Patient_data";
import Terms from "./components/privacy/Terms";
import { useDispatch, useSelector } from "react-redux";
import Dept_dashboard from "./components/Department-portal/dept_dashboard/Dept_dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Otppage from "./components/management/Otppage";
import Appointmentreport from "./components/for_patient/Appointmentreport";
import Patientreports from "./components/Department-portal/patient_report/Patientreports";
import ForPatientReport from "./components/for_patient/ForPatientReport";
function App() {
  const { loginStatus, token } = useSelector((state) => state.user);
  const [state, setState] = useState({
    det: "user",
  });

  useEffect(() => {
    let token = localStorage.getItem("token");
    if (token) {
      console.log(token);
      let decode = jwt_decode(token);
      let role = decode.role;
      setState({
        det: role,
      });
    }
    // else {
    //   setState({
    //     det: "",
    //   });
    // }
  }, []);

  console.log(state.det);

  // useEffect(()=>{,,,mm
  // let token = localStorage.getItem("token");
  // console.log(token);
  // let decode = jwt_decode(token);
  // // let role = "decode.role";
  //   setState({
  //   det : decode.role
  // })
  // },[])

  return (
    <>
      <Router>
        <Routes>
          {/* <Route exact path="/" element={<Homepage />} /> */}
          <Route path="/navbar" element={<Navbar />} />
        </Routes>
      </Router>
      {/* state.det === "data" || state.det === "user" */}
      {state.det === "user" ? (
        <Router>
          <Routes>
            <Route exact path="/" element={<Homepage />} />
            <Route exact path="/login" element={<Managemtnt_Login />} />
            <Route path="/doctor-list" element={<Doctorlist />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/sign-up" element={<Sign_up />} />
            <Route path="/otp-page" element={<Otppage />} />
            <Route
              path="/appointment-report-history"
              element={<Appointmentreport />}
            />
            <Route
              exact
              path="/forpatient-report"
              element={<ForPatientReport />}
            />

            <Route path="/for-patient" element={<Patient />} />
          </Routes>
        </Router>
      ) : null}
      {state.det === "admin" ? <Dashboard /> : null}
      {/* {state.det === "user" ? (
        <Router>
          <Routes>
            <Route exact path="/" element={<Homepage />} />
            <Route path="/for-patient" element={<Patient />} />
            <Route exact path="/login" element={<Managemtnt_Login />} />
            <Route path="/doctor-list" element={<Doctorlist />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/terms" element={<Terms />} />
          </Routes>
        </Router>
      ) : null} */}
      {state.det === "department" ? <Dept_dashboard /> : null}
    </>
  );
}

export default App;
