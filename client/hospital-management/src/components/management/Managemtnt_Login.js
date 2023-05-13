import React, { useEffect } from "react";
import Navbar from "../navbar/Navbar";
import { SERVER_URL } from "../../Globals";
import { Input, Button, Form, Image, Typography, message } from "antd";
import "./management.css";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
// import { userSlice } from "../../redux/user/UserSlice";
import { userlogin } from "../../redux/user/UserSlice";
const { Title } = Typography;

const Managemtnt_Login = (props) => {
  const location = useLocation();
  console.log("props", location.state);
  if (location.state) {
    setTimeout(() => {
      message.warning(location.state);
    }, 1000);
  }
  const navigate = useNavigate();
  const { user, token, loginStatus } = useSelector((state) => state.user);
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  useEffect(() => {
    if (loginStatus) {
      window.location.href = "/";
    }
  }, [navigate, loginStatus]);
  const formSubmit = (values) => {
    console.log(values);
    dispatch(userlogin(values));
    // axios
  };

  const responsive_layout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 8 },
      md: { span: 6 },
      lg: { span: 6 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 },
      md: { span: 18 },
      lg: { span: 18 },
    },
  };
  const buttonLayout = {
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 12, offset: 10 },
      md: { span: 12, offset: 10 },
      lg: { span: 12, offset: 10 },
    },
  };
  return (
    <>
      <Navbar></Navbar>
      <div className="mt-5">
        <div class="card mb-3 mx-auto " style={{ maxWidth: "700px" }}>
          <div className="card-header bg-warning">
            <Title
              level={3}
              style={{ textAlign: "center" }}
              className="my-1 text-white"
            >
              Login
            </Title>
          </div>

          <div class="row g-0">
            <div class="col-md-5">
              <img
                src="https://img.freepik.com/free-photo/team-young-specialist-doctors-reviewing-documents-corridor-hospital_1303-21211.jpg?w=2000"
                class="img-fluid"
                alt="slide1"
              />
            </div>
            <div class="col-md-7">
              <div class="card-body">
                <Form {...responsive_layout} form={form} onFinish={formSubmit}>
                  <Form.Item
                    label="Id:"
                    type="text"
                    name="id"
                    hasFeedback
                    rules={[{ required: true, message: "Enter Your Id" }]}
                  >
                    <Input
                      placeholder="Enter your Id"
                      type="text"
                      name="id"
                      id="id"
                    />
                  </Form.Item>

                  <Form.Item
                    name="password"
                    label="Password"
                    rules={[
                      {
                        required: true,
                        message: "Please input password!",
                      },
                    ]}
                    hasFeedback
                  >
                    <Input.Password
                      name="password"
                      id="password"
                      placeholder="Enter your password"
                    />
                  </Form.Item>
                  <Form.Item {...buttonLayout}>
                    <Button
                      type="ghost"
                      htmlType="submit"
                      className="mt-2 login-button"
                    >
                      Submit
                    </Button>
                  </Form.Item>
                </Form>
                <div>
                  <p className="text-center mt-1">
                    New user{" "}
                    <a href="/sign-up" className="log-sign-link">
                      click here to Register
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Managemtnt_Login;
