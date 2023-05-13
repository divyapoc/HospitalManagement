import React, { useRef, useState, useEffect } from "react";
import { SearchOutlined } from "@ant-design/icons";
import { Button, Input, Space, Table } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { SERVER_URL } from "../../../Globals";

const Patientlog = () => {
  const [state, setState] = useState({ data: [] });
  //get patients

  const getusers = () => {
    axios.get(SERVER_URL + "api/user/get-all-user").then((res) => {
      console.log(res.data);
      setState({ data: res.data.data });
    });
  };
  const data = state.data;
  useEffect(() => {
    getusers();
  }, []);
  //search-filter function  -----
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
  const columns = [
    {
      title: "Patient Id",
      dataIndex: "patient_id",
      key: "patient_id",
      ...getColumnSearchProps("patient_id"),
    },
    {
      title: "Ptient First Name",
      dataIndex: "first_name",
      key: "first_name",
      ...getColumnSearchProps("first_name"),
    },
    {
      title: "Ptient Last Name",
      dataIndex: "last_name",
      key: "last_name",

      ...getColumnSearchProps("last_name"),
    },
    {
      title: "DOB",
      dataIndex: "dob",
      key: "dob",
      width: "20%",
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
    },
    {
      title: "Phone Number",
      dataIndex: "mobile_number",
      key: "mobile_number",
    },
  ];
  return (
    <Table
      columns={columns}
      dataSource={data}
      scroll={{
        x: 1300,
      }}
    />
  );
};

export default Patientlog;
