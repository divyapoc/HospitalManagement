import React, { useRef, useState, useEffect } from "react";
import { SearchOutlined } from "@ant-design/icons";
import { Button, Input, Space, Table } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { SERVER_URL } from "../../../Globals";
const Confirm = () => {
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const [state, setState] = useState({
    data: [],
  });
  // get appointments
  const get = () => {
    axios
      .get(SERVER_URL + "api/appointment//get-Conform-Appointment")
      .then((res) => {
        console.log(res.data.result);
        setState({
          data: res.data.result,
        });
      });
  };
  useEffect(() => {
    get();
  }, []);

  const data = state.data;

  //search function
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
  const columns = [
    {
      title: "Patient Id",
      dataIndex: "patient_id",
      key: "patient_id",
      ...getColumnSearchProps("patient_id"),
    },
    {
      title: "Patient Name",
      dataIndex: "data",
      key: "patient_name",
      render: (data) => data.first_name + " " + data.last_name,
    },
    {
      title: "Phone Number",
      dataIndex: "data",
      key: "mobile_number",
      render: (data) => data.mobile_number,
    },
    {
      title: "Doctor Id",
      dataIndex: "doctor_id",
      key: "doctor_id",
      //   width: "20%",
      ...getColumnSearchProps("doctor_id"),
    },
    {
      title: "Doctor Name",
      dataIndex: "doctor_name",
      key: "doctor_name",
    },
    {
      title: "Department Name",
      dataIndex: "department_name",
      key: "department_name",
      // width: "20%",
      ...getColumnSearchProps("department_name"),
    },
    {
      title: "Appointment Id",
      dataIndex: "appointment_id",
      key: "appointment_id",
      ...getColumnSearchProps("appointment_id"),
    },
    {
      title: "confrimed Date",
      dataIndex: "confrimed_date",
      key: "confrimed_date",
      fixed: "right",
      ...getColumnSearchProps("confrimed_date"),
    },
  ];
  return (
    <Table
      columns={columns}
      scroll={{
        x: 1800,
      }}
      dataSource={data}
    />
  );
};

export default Confirm;
