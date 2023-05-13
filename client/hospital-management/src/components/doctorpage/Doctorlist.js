import React, { useEffect, useState } from "react";
import Navbar from "../navbar/Navbar";
import {
  Button,
  Input,
  Select,
  Modal,
  Typography,
  Form,
  DatePicker,
  Space,
  message,
} from "antd";
import "./Doctor.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { SERVER_URL } from "../../Globals";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import customParseFormat from "dayjs/plugin/customParseFormat";
import moment from "moment";
import jwt_decode from "jwt-decode";

// import weekday from "dayjs/plugin/weekday";

const { Title } = Typography;
const { Option } = Select;

const items = [];

const Doctorlist = () => {
  const { user, loginStatus, token } = useSelector((state) => state.user);
  //set doctor detail
  const [doctor_name, setDoctor_name] = useState("");
  const [doctor_id, setDoctor_id] = useState("");
  const [department_id, setDepartment_id] = useState("");
  const [department_name, setDepartment_name] = useState("");
  const [requested_date, setRequested_date] = useState("");
  //  const token = localStorage.getItem("token");

  const [day, setDay] = useState([]);
  const [form] = Form.useForm();
  const [selectedDay, setSelectedDay] = useState("");
  dayjs.extend(customParseFormat);

  //disable date
  const disabledDate = (current) => {
    return current && current < dayjs().endOf("day");
  };
  const [isselecting, setIsSelecting] = useState(false);
  const [selectdetail, setSelectdetail] = useState({
    data: [],
  });

  const [details, setDetails] = useState({});
  const [department, setDepartment] = useState({
    id: "",
  });

  const [specialistData, setSpecialistData] = useState({
    data: "",
  });

  const navigate = useNavigate();

  const [state, setState] = useState({
    data: [],
  });

  const [depName, setDepName] = useState({
    name: "",
  });

  const [availableDay, setAvailableDay] = useState({
    day: [],
  });

  const [availableSlot, setAvailableSlot] = useState({
    data: "",
  });

  const [listSlot, setListSlot] = useState({
    data: [],
  });

  const [open, setOpen] = useState(false);

  const handleChange = (value) => {
    // this.setState({selectValue:e.target.value});
    console.log(value._d);
    let reqdate = value._d;
    setRequested_date(reqdate);
    // setAvailableSlot({
    //   data: value,
    // });

    // console.log("value", value);
  };
  console.log("Requested_date", requested_date);
  useEffect(() => {
    axios.get(SERVER_URL + "api/departements/getAllDepartments").then((res) => {
      console.log(res.data.data);
      setState({
        data: res.data.data,
      });
    });

    console.log("department_name", department.id);
    axios
      .get(SERVER_URL + "api/specialist/getspecialistByDepId", {
        params: { department_id: department.id },
      })
      .then((res) => {
        console.log("dep", res.data.result);
        console.log(res.data.result[0].specialist_id);
        setSelectdetail({
          data: res.data.result,
        });

        setSpecialistData({
          data: res.data.result[0].specialist_id,
        });
      })
      .catch((err) => {
        console.log(err);
      });

    // axios
  }, [department.id, specialistData.data, details]);

  // console.log("selectdetail", selectdetail)

  const getData = (selectedData) => {
    console.log(selectedData);
    setDepartment({
      id: selectedData,
    });

    axios
      .get(SERVER_URL + "api/departements/getSingleDepartment", {
        params: { department_id: selectedData },
      })
      .then((res) => {
        console.log("departNameeeeee", res.data.data.department_name);
        setDepName({
          name: res.data.data.department_name,
        });
      });
  };

  //slot data
  const selectdata = (data) => {
    const status = JSON.parse(loginStatus);
    if (!status) {
      alert(
        "login to your account to request appointment .\n If you are new user register first."
      );
      navigate("/login");
    } else {
      console.log("data", data);
      setDepartment_id(data.department_id);
      setDepartment_name(data.department_name);
      setDoctor_id(data.specialist_id);
      setDoctor_name(data.specialist_name);
      setIsSelecting(true);
      setOpen(true);
    }
  };

  //
  const resetSelect = () => {
    setIsSelecting(false);
  };

  const handleSubmit = () => {
    let decode = jwt_decode(token);
    const values = {
      department_id: department_id,
      department_name: department_name,
      doctor_id: doctor_id,
      doctor_name: doctor_name,
      patient_id: decode.patient_id,
      patient_name: decode.patient_name,
      requested_date: requested_date,
    };
    axios
      .post(SERVER_URL + "/api/appointment/request-appointment", values)
      .then((res) => {
        console.log(res);
        setTimeout(() => {
          message.warning(res.data.message);
        }, 1000);
      });

    // setIsSelecting(false);
  };

  // console.log("detailss", details);
  // form layout
  const responsive_layout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 24 },
      md: { span: 12 },
      lg: { span: 12 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 24 },
      md: { span: 12 },
      lg: { span: 12 },
    },
  };
  return (
    <>
      <Navbar></Navbar>
      <div>
        <button
          class="btn rounded-pill text-white btn side-button py-0 px-2 mt-3 ms-1"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#offcanvasExample"
          aria-controls="offcanvasExample"
        >
          Departments
          <i class="fa-solid fa-angles-right"></i>
        </button>
        <div className="doctor-offcanvas">
          <div
            class="offcanvas offcanvas-start"
            tabIndex="-1"
            id="offcanvasExample"
            aria-labelledby="offcanvasExampleLabel"
          >
            <div class="offcanvas-header">
              <h5
                class="offcanvas-title text-white mx-auto"
                id="offcanvasExampleLabel"
              >
                Department
              </h5>
              <button
                type="button"
                class="btn-close text-reset"
                data-bs-dismiss="offcanvas"
                aria-label="Close"
              ></button>
            </div>
            <div class="offcanvas-body p-0">
              <nav className="navbar py-0">
                <ul className="navbar-nav side-nav flex-fill">
                  <li className="nav-item w-100">
                    {state.data.map((det, key) => {
                      return (
                        <button
                          className="nav-link w-100 btn rounded-0 border-bottom text-white side-link"
                          onClick={() => getData(det.department_id)}
                          value={det.department_id}
                        >
                          {det.department_name}
                        </button>
                      );
                    })}
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
      <div className="container-fluid  my-2">
        <div className="row row-cols-lg-3 row-cols-xxl-4 row-cols-md-2 row-cols-1 gy-3 gx-xl-5 gx-3">
          {selectdetail.data.map((obj) => {
            return (
              <div className="col">
                <div className="card doctor-card">
                  <div className="doctor-img1">
                    <div className=""></div>
                  </div>
                  <div className="doctor-img2">
                    <img
                      className=""
                      src={SERVER_URL + "uploads/specialist/" + obj.image}
                    />
                  </div>
                  <div>
                    <div class="card-body main-text">
                      <p class="card-title doctor-name text-center">
                        {obj.specialist_name}
                      </p>
                      <p className="doc-edu text-muted text-center mb-2">
                        {obj.education}
                      </p>
                      <div className="d-flex doctor-exp text-uppercase justify-content-between mx-3">
                        <p class="card-text ">{obj.specialisation}</p>
                        <p class="card-text ">{obj.experience} EXP</p>
                      </div>
                      <p class="card-text doctor-avl mx-1 mb-2">
                        Department : {obj.department_name}
                      </p>
                      <div>
                        <p class="card-text doctor-avl mb-2">
                          <span className="span mx-1">Available on</span>&nbsp;:
                          {obj.available_day.map((obj) => {
                            return <span key={obj}>{obj} &nbsp;</span>;
                          })}
                        </p>
                        <p class="card-text doctor-time mb-3 mx-1">
                          <span className="span">Timing</span>
                          &nbsp;<i class="fa-regular fa-clock"></i> :{obj.time}
                          &nbsp;
                        </p>
                      </div>
                      <div className="text-center mb-1">
                        <button
                          className="btn book-btn px-1 py-1 text-center"
                          // key={index}
                          onClick={() => {
                            // selectdata(obj.specialist_id);
                            selectdata(obj);
                            setDay(obj.available_day);
                          }}
                        >
                          Request Appointment
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div>
        <Modal
          title="Select Your Appointment date"
          open={isselecting}
          okText="Request Appointment"
          onCancel={() => {
            resetSelect();
          }}
          onOk={() => {
            resetSelect();
            handleSubmit();
          }}
          className="modal-app"
        >
          <div>
            <Form {...responsive_layout}>
              <p>
                Selected Doctor is available on&nbsp;
                {day.map((data) => {
                  return (
                    <span key={data} className="text-success">
                      {data} , &nbsp;
                    </span>
                  );
                })}
              </p>
              s
              <Form.Item
                name="available_day"
                label="Choose date for Appointment"
                // rules={[{ required: true, message: "Select day" }]}
              >
                <DatePicker
                  picker="date"
                  disabledDate={disabledDate}
                  onChange={handleChange}
                  format="YYYY/MM/DD"
                />
              </Form.Item>
            </Form>
          </div>
        </Modal>
      </div>
    </>
  );
};

export default Doctorlist;
