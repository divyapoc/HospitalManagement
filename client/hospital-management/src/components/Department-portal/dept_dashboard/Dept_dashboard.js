import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  NavLink,
} from "react-router-dom";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Layout, Menu, Typography } from "antd";
import Portal_menu from "./Dept_menu";
import Dept_doctors from "../dept_doctors/Dept_doctors";
import Doctor_login from "../doctor_login/Doctor_login";
import Doctorboard from "../doctor_access/Doctorboard";
import Patient_history from "../doctorAppointment/Patient_history";
import Today_appointment from "../doctorAppointment/Today_appointment";
import Patientreports from "../patient_report/Patientreports";
import ReportSetting from "../patient_report/Reportsetting";
import Dept_patient from "../dept_patient/Dept_patient";
import Dept_patient_report from "../dept_patient/Dept_patient_report";
import { useDispatch } from "react-redux";
import jwt_decode from "jwt-decode";
import { logout } from "../../../redux/user/UserSlice";
const { Header, Sider, Content, Footer } = Layout;
const Dept_dashboard = () => {
  const { Title } = Typography;
  const [collapsed, setCollapsed] = useState(false);
  const [title, setTitle] = useState("");
  const [logo, setLogo] = useState("");
  const [dept, setDept] = useState({});
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    window.location.href = "/";
    //  localStorage.setItem("loginstatus","0")
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decode = jwt_decode(token);
      console.log(decode);
      setDept(decode);
    }
  }, []);

  return (
    <Router>
      <Layout>
        <Layout>
          <Sider
            trigger={null}
            collapsible
            collapsed={collapsed}
            style={{
              overflow: "auto",
              height: "100vh",
              position: "sticky",
              left: 0,
              top: 0,
              bottom: 0,
            }}
          >
            <div className="logo">
              <Title level={4} className="text-center">
                {dept?.department_name}
              </Title>
            </div>

            <Menu theme="dark" mode="inline">
              {Portal_menu.map((val, key) => {
                return (
                  <Menu.Item key={key} icon={val.icon}>
                    <NavLink style={{ textDecoration: "none" }} to={val.link}>
                      <span>{val.title}</span>
                    </NavLink>
                  </Menu.Item>
                );
              })}
              <Menu.Item
                icon={<LogoutOutlined />}
                key="4"
                onClick={handleLogout}
              >
                Logout
              </Menu.Item>
            </Menu>
          </Sider>
          <Layout className="site-layout">
            <Header
              className="site-layout-background"
              style={{
                padding: 0,
              }}
            >
              {React.createElement(
                collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
                {
                  className: "trigger",
                  onClick: () => setCollapsed(!collapsed),
                }
              )}
            </Header>
            <Content
              className="site-layout-background"
              style={{
                margin: "24px 16px 0",
                height: "73vh",
                overflow: "auto",
              }}
            >
              <div style={{ padding: 24, background: "#fff" }}>
                <Routes>
                  <Route
                    exact
                    path="/dept-doctorlist"
                    element={<Dept_doctors />}
                  />
                  <Route
                    exact
                    path="/doctor-login"
                    element={<Doctor_login />}
                  />
                  <Route exact path="/doctor-board" element={<Doctorboard />} />
                  <Route
                    exact
                    path="/deptartment-patient-report"
                    element={<Dept_patient />}
                  />
                  <Route
                    exact
                    path="/patient-history"
                    element={<Patient_history />}
                  />
                  <Route
                    exact
                    path="/today-appointment"
                    element={<Today_appointment />}
                  />
                  <Route
                    exact
                    path="/report-history"
                    element={<Patientreports />}
                  />
                  <Route
                    exact
                    path="/report-setting"
                    element={<ReportSetting />}
                  />
                  <Route
                    exact
                    path="/department-patient_report"
                    element={<Dept_patient_report />}
                  />
                </Routes>
              </div>
            </Content>
            <Footer className="footer-color">
              <div className="text-light text-center">
                Hospital Management @2022
              </div>
            </Footer>
          </Layout>
        </Layout>
      </Layout>
    </Router>
  );
};

export default Dept_dashboard;
