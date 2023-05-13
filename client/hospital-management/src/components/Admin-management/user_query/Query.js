import React, { useEffect, useRef, useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import { Button, Input, Space, Table, Modal, message } from "antd";

import axios from "axios";
import { SERVER_URL } from "../../../Globals";
import Swal from "sweetalert2";
const Query = () => {
  const [viewmsg, setViewmsg] = useState(false);
  const [replymsg, setReplymsg] = useState(false);
  const [replymessage, setReplymessage] = useState("");
  const [replydata, setReplydata] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [state, setState] = useState({
    data: [],
  });
  const data = state.data;

  useEffect(() => {
    axios.get(SERVER_URL + "api/contact/user-query").then((res) => {
      console.log(res.data.data);
      setState({
        data: res.data.data,
      });
    });
  }, []);
  //modal function
  const show = (detail) => {
    console.log("show data", detail);
    setViewmsg(true);
  };

  const resetshow = () => {
    setViewmsg(false);
  };
  //reply modal
  const reply = (detail) => {
    console.log("show data", detail);
    setReplymsg(true);
    setReplydata(detail);
  };

  const resetreply = () => {
    setReplymsg(false);
    setReplydata(null);
  };

  // reply query
  const replytoquery = async () => {
    console.log("value", replymessage);
    console.log("datatata", replydata);
    const messages = replymessage;
    axios
      .post(
        SERVER_URL + `api/contact/reply?contact_id=${replydata.contact_id}`,
        { messages }
      )
      .then((res) => {
        if (res.data.status === true) {
          setReplymessage("");
          resetreply();
          Swal.fire({ icon: "success", html: "replied successfully" });
        } else {
          Swal.fire({ icon: "error", html: "something  went wrong" });
          resetreply();
          setReplymessage("");
        }
      })
      .catch((error) => {
        setTimeout(() => {
          message.error(error.message);
        }, 1000);
      });
  };
  //search filter
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
  // const [show, setShow] = useState(false);

  const columns = [
    {
      title: "Name",
      dataIndex: "username",
      key: "username",
      width: "15%",
      fixed: "left",
      ...getColumnSearchProps("username"),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: "15%",
      fixed: "left",
      ...getColumnSearchProps("email"),
    },
    {
      title: "Mobile",
      dataIndex: "mobile",
      key: "mobile",
      width: "16%",
      ...getColumnSearchProps("mobile"),
    },
    {
      title: "Reply Status",
      dataIndex: "reply_status",
      key: "reply_status",
      width: "16%",
      render: (reply_status) => String(reply_status),
      ...getColumnSearchProps("reply_status"),
    },
    {
      title: "Read Message",
      dataIndex: "",
      width: "10%",

      key: "x",
      render: (data) => (
        <Button
          type="primary"
          onClick={() => {
            show(data);
          }}
        >
          Read
        </Button>
      ),
    },
    {
      title: "Reply by Message",
      dataIndex: "",
      width: "10%",

      key: "x",
      render: (data) => (
        <Button
          type="primary"
          onClick={() => {
            reply(data);
          }}
        >
          Reply
        </Button>
      ),
    },
  ];

  return (
    <>
      <Table columns={columns} dataSource={data} />
      <div>
        <Modal
          title="Edit items"
          open={viewmsg}
          onOk={() => {
            resetshow();
          }}
          cancelButtonProps={{ style: { display: "none" } }}
        >
          <div>
            <p>Message from user</p>
          </div>
        </Modal>
      </div>
      <div>
        <Modal
          title="Reply to Query"
          open={replymsg}
          bodyStyle={{ overflowY: "auto", maxHeight: "calc(100vh - 200px)" }}
          okText="Reply"
          onCancel={() => {
            resetreply();
          }}
          onOk={() => {
            replytoquery();
          }}
        >
          <div>
            <p className="query-model-text">
              Query ID : {replydata?.contact_id}
            </p>

            <textarea
              placeholder="Reply here..."
              rows={6}
              className="form-control"
              required
              value={replymessage}
              onChange={(e) => {
                setReplymessage(e.target.value);
              }}
            ></textarea>
          </div>
        </Modal>
      </div>
    </>
  );
};

export default Query;
