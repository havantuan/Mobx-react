import React from 'react';
import {Tabs, Icon} from 'antd';
import PageTabsCardLayout from "../../../../layouts/PageTabsCardLayout";
import PostTable from "../Post/PostTable";
import GroupTable from "../Group/GroupTable";
import groupStore from "../../../../stores/groupStore";
import postTableStore from "../../../../stores/post/postTableStore";
export default class News extends React.PureComponent {
  componentWillUnmount() {
    groupStore.clear();
    postTableStore.clear();
  }
  render() {
    groupStore.setGroupType("News", 4, "Tin tức");
    postTableStore.setGroupType("News", 4, "Tin tức");
    return (
      <div style={{marginTop: 20}}>
        <PageTabsCardLayout>
          <Tabs type="card">
            <Tabs.TabPane tab={<span><Icon type="table"/>Tin tức</span>} key={'1'}>
              <PostTable/>
            </Tabs.TabPane>
            <Tabs.TabPane tab={<span><Icon type="printer"/>Nhóm tin tức</span>} key={'2'}>
              <GroupTable/>
            </Tabs.TabPane>
          </Tabs>
        </PageTabsCardLayout>
      </div>

    )
  }

}