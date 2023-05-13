import React from "react";

import { Tabs } from "antd";
import { Edit_spe } from "./Edit_spe";
import Specialist from "./Specialist";

const Specialistsetting = () => {
  const { TabPane } = Tabs;

  function callback(key) {
    console.log(key);
  }
  return (
    <div>
      <Tabs defaultActiveKey="1" onChange={callback}>
        <TabPane tab="Add Specialist" key="1">
          <Specialist />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default Specialistsetting;
