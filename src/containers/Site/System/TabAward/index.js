import React from 'react';
import {Tabs, Icon} from 'antd';
import PageTabsCardLayout from "../../../../layouts/PageTabsCardLayout";
import AwardTable from "../Award/AwardTable";
import GroupAward from "../GroupAward/AwardTable";

export default class News extends React.PureComponent {

  render() {
    return (
      <div style={{marginTop: 20}}>
        <PageTabsCardLayout>
          <Tabs type="card">
            <Tabs.TabPane tab={<span><Icon type="table"/>Giải thưởng</span>} key={'1'}>
              <AwardTable/>
            </Tabs.TabPane>
            <Tabs.TabPane tab={<span><Icon type="printer"/>Nhóm giải thưởng</span>} key={'2'}>
              <GroupAward/>
            </Tabs.TabPane>
          </Tabs>
        </PageTabsCardLayout>
      </div>

    )
  }

}