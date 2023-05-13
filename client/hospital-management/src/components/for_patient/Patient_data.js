import React, { useEffect, useRef, useState } from "react";
import Navbar from "../navbar/Navbar";
import axios from "axios";
import { SERVER_URL } from "../../Globals";
import decode from "jwt-decode";
import { Typography } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  SearchOutlined,
  UploadOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  Button,
  Input,
  Space,
  Table,
  Form,
  message,
  DatePicker,
  Modal,
} from "antd";
import "./patient.css";
import { useNavigate, Link } from "react-router-dom";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import moment from "moment";

const { Title } = Typography;
const Patient = () => {
  const { user, loginStatus, token } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [FirstName, setFirstName] = useState("");
  const [LastName, setLastName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [updatemode, setUpdatemode] = useState(false);
  const [patientId, setPatientId] = useState("");
  const [state, setState] = useState({ data: [] });
  //set doctor detail
  const [doctor_name, setDoctor_name] = useState("");
  const [doctor_id, setDoctor_id] = useState("");
  const [department_id, setDepartment_id] = useState("");
  const [department_name, setDepartment_name] = useState("");
  const [requested_date, setRequested_date] = useState("");
  const [day, setDay] = useState([]);
  const [form] = Form.useForm();
  const [selectedDay, setSelectedDay] = useState("");
  const [isselecting, setIsSelecting] = useState(false);
  const [selectdetail, setSelectdetail] = useState({
    data: [],
  });
  const [open, setOpen] = useState(false);

  //date disable
  dayjs.extend(customParseFormat);
  //disable date
  const disabledDate = (current) => {
    return current && current < dayjs().endOf("day");
  };

  //checkingnlogin and redirect
  useEffect(() => {
    if (!JSON.parse(loginStatus)) {
      navigate("/login");
    }
  }, [navigate, loginStatus]);

  const getdetail = async () => {
    if (token) {
      console.log("token", token);
      const decoder = await decode(token);
      console.log("decode", decoder);
      console.log("decoder", decoder.patient_id);
      setPatientId(decoder.patient_id);
      console.log(patientId);
      const data = await axios
        .get(SERVER_URL + `api/user/get-user?patient_id=${decoder.patient_id}`)
        .then((res) => {
          console.log("res", res.data.data);
          setEmail(res.data.data.email);
          setMobileNumber(res.data.data.mobile_number);
          setFirstName(res.data.data.first_name);
          setLastName(res.data.data.last_name);
          setGender(res.data.data.gender);
          setPatientId(res.data.data.patient_id);
        })
        .catch((error) => {
          setTimeout(() => {
            message.error(error.message);
          }, 1000);
        });
      axios
        .get(
          SERVER_URL +
            `api/reports/forpatient-report?patient_id=${decoder.patient_id}`
        )
        .then((res) => {
          console.log("res", res.data.data);
          if (res.data.status === "success") {
            setState({ data: res.data.data });
          } else {
            setTimeout(() => {
              message.error(res.data.message);
            }, 1000);
          }
        });
    }
  };
  console.log("state", state);
  const data = state.data;
  useEffect(() => {
    getdetail();
  }, []);

  // useEffect(() => {

  // }, );

  //form-layout
  const responsive_layout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 10 },
      md: { span: 8 },
      lg: { span: 8 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 14 },
      md: { span: 16 },
      lg: { span: 16 },
    },
  };

  //profile-update integration

  const edit = () => {
    if (updatemode === true) {
      setUpdatemode(false);
    } else {
      setUpdatemode(true);
    }
  };

  const updatemobilenumber = async (number) => {
    // Function to generate OTP
    console.log(number);
    navigate("/otp-page", { state: { number } });
  };
  const updatemail = async (email) => {
    console.log(email, "data");
    const decoder = await decode(token);
    axios
      .put(SERVER_URL + `api/user/update-user/${decoder.patient_id}`, {
        email,
      })
      .then((res) => {
        console.log(res);
        console.log(res.data);
        if (res.data.status === "success") {
          setTimeout(() => {
            message.success(res.data.message);
          }, 1000);
        } else {
          setTimeout(() => {
            message.error(res.data.message);
          }, 1000);
        }
      })
      .catch((error) => {
        console.log("err", error);
        setTimeout(() => {
          message.error(error.message);
        }, 500);
      });
    getdetail();
    // setUpdatemode(false);
  };

  //appointment-booking
  const selectdata = (data) => {
    console.log("data", data);
    setDepartment_id(data.department_id);
    setDepartment_name(data.department_name);
    setDoctor_id(data.specialist_id);
    setDoctor_name(data.specialist_name);
    setIsSelecting(true);
    setOpen(true);
  };

  //reset selecting
  const resetSelect = () => {
    setIsSelecting(false);
  };

  const handleChange = (value) => {
    // this.setState({selectValue:e.target.value});
    console.log(value._d);
    let reqdate = value._d;
    setRequested_date(reqdate);
  };

  const handleSubmit = () => {
    let decoder = decode(token);
    const values = {
      department_id: department_id,
      department_name: department_name,
      doctor_id: doctor_id,
      doctor_name: doctor_name,
      patient_id: decoder.patient_id,
      patient_name: decoder.patient_name,
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

  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div
        style={{
          padding: 8,
        }}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1890ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
  });

  //dummy data

  // const data = [
  //   {
  //     date: "2/2/2022",
  //     appointment_id: "12334545",
  //     specialist_name: "Dr.Sharan",
  //     department_name: "Cardiology",
  //   },
  //   {
  //     date: "2/2/2022",
  //     appointment_id: "12334545",
  //     specialist_name: "Dr.Sharan",
  //     department_name: "Cardiology",
  //   },
  // ];

  const columns = [
    {
      title: "Doctor Name",
      dataIndex: "specialist_name",
      key: "specialist_name",
      ...getColumnSearchProps("specialist_name"),
    },
    {
      title: "Department",
      dataIndex: "department_name",
      key: "department_name",
      ...getColumnSearchProps("department_name"),
    },
    {
      title: "Appointment history",
      dataIndex: "",
      width: "15%",
      fixed: "right",
      key: "x",
      render: (data) => (
        <>
          <Button
            onClick={() => {
              navigate("/appointment-report-history", {
                state: { data, patientId },
              });
            }}
          >
            Appointment history
          </Button>
        </>
      ),
    },
    {
      title: "Your Report",
      dataIndex: "",
      width: "15%",
      fixed: "right",
      key: "x",
      render: (data) => (
        <>
          <Button
            onClick={() => {
              navigate("/forpatient-report", { state: { data, patientId } });
            }}
          >
            Your Report
          </Button>
        </>
      ),
    },
    {
      title: "Action",
      dataIndex: "",
      width: "15%",
      fixed: "right",
      key: "x",
      render: (data) => (
        <>
          <Button
            onClick={() => {
              selectdata(data);
              setDay(data.available_day);
            }}
          >
            Request Appointment
          </Button>
        </>
      ),
    },
  ];

  return (
    <>
      <Navbar />
      <div className="row">
        <div className="paitent-sidebar">
          <div>
            <button
              class="btn rounded-pill text-white btn side-button py-0 px-2 mt-3 mb-3 ms-1"
              type="button"
              data-bs-toggle="offcanvas"
              data-bs-target="#offcanvasExample"
              aria-controls="offcanvasExample"
            >
              Click here To See Your Profile
              <i class="fa-solid fa-angles-right"></i>
            </button>
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
                  Your Profile
                </h5>
                <button
                  type="button"
                  class="btn-close text-reset"
                  data-bs-dismiss="offcanvas"
                  aria-label="Close"
                ></button>
              </div>
              <div class="offcanvas-body p-0">
                <div className="detail-card">
                  <div className="d-flex justify-content-end card-edit">
                    {!updatemode ? (
                      <button className="pa-profile-btn" onClick={() => edit()}>
                        Edit
                      </button>
                    ) : (
                      <button className="pa-profile-btn" onClick={() => edit()}>
                        Back
                      </button>
                    )}
                  </div>
                  <div className="p-4 edit-body">
                    <div>
                      {updatemode ? (
                        <div className="row">
                          <label
                            for="patient_id"
                            class="profile-lable col-3 align-self-end"
                          >
                            PatientId
                          </label>
                          <div className="col-9 ">
                            <input
                              type="text"
                              id="patient_id"
                              value={patientId}
                              className="patient-input-disable form-control form-control mb-2 rounded-0"
                              disabled
                            />
                          </div>
                        </div>
                      ) : (
                        <p>PatientId : {patientId}</p>
                        // <p>PatientId</p>
                      )}
                    </div>
                    {updatemode ? (
                      <div className="row">
                        <label
                          for="name"
                          class="profile-lable col-3 align-self-end"
                        >
                          Name
                        </label>
                        <div className="col-9">
                          <input
                            type="text"
                            value={FirstName}
                            className="patient-input-disable form-control form-control mb-2 rounded-0"
                            disabled
                          />
                        </div>
                      </div>
                    ) : (
                      <p>
                        {/* name */}
                        Name : {FirstName}&nbsp;
                        {LastName}
                      </p>
                    )}
                    <div>
                      {updatemode ? (
                        <div>
                          <div className="row">
                            <label
                              for="mobile"
                              class="profile-lable col-3 align-self-end"
                            >
                              Mobile
                            </label>
                            <div className="col-9 ">
                              <input
                                type="text"
                                value={mobileNumber}
                                onChange={(e) =>
                                  setMobileNumber(e.target.value)
                                }
                                className="patient-input form-control form-control mb-2 rounded-0"
                              />
                            </div>
                          </div>
                          <div className="d-flex justify-content-end">
                            <button
                              className="profile-edit-btn btn my-3 mx-auto"
                              onClick={() => updatemobilenumber(mobileNumber)}
                            >
                              Update MobileNumber
                            </button>
                          </div>
                        </div>
                      ) : (
                        // <p>Mobile</p>

                        <p>Mobile : {mobileNumber}</p>
                      )}
                    </div>
                    <div>
                      {updatemode ? (
                        <div className="row">
                          <label
                            for="gender"
                            class="profile-lable col-3 align-self-end"
                          >
                            Gender
                          </label>
                          <div className="col-9 ">
                            <input
                              type="text"
                              value={gender}
                              className="patient-input-disable form-control form-control mb-2 rounded-0"
                              disabled
                            />
                          </div>
                        </div>
                      ) : (
                        // <p>Gender</p>
                        <p>Gender : {gender}</p>
                      )}
                    </div>
                    <div>
                      {updatemode ? (
                        <div className="row">
                          <label
                            for="email"
                            class="profile-lable col-3 align-self-end"
                          >
                            Email
                          </label>
                          <div className="col-9 ">
                            <input
                              type="text"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              className="patient-input form-control form-control mt-3 mb-2 rounded-0"
                            />
                          </div>
                        </div>
                      ) : (
                        <p>Email : {email}</p>
                        // <p>Email</p>
                      )}
                    </div>
                    <div>
                      {updatemode ? (
                        <div className="d-flex justify-content-end">
                          <button
                            className="profile-edit-btn btn my-3 mx-auto"
                            onClick={() => updatemail(email)}
                          >
                            Update Your Email
                          </button>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <header className="patient-haeder">
        <p>
          ” Our Mission Is To Bring Healthcare Of International Standards Within
          The Reach Of Every Individual.”
        </p>
        <p>For New Appointment, click below</p>
        <Link to={"/doctor-list"}>
          <button className="btn new-app-btn">Book New Appointment</button>
        </Link>
      </header>

      <div className="container-fluid mt-4 px-4 pat-table">
        <Title level={3} style={{ textAlign: "center" }} className="mb-4">
          YOUR APPOINTMENT HISTORY
        </Title>
        <Table
          columns={columns}
          dataSource={data}
          scroll={{
            x: 1300,
          }}
        />
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

export default Patient;
