import React, {Component} from 'react';
import {Form, Icon, Tabs} from 'antd';
import InfomationCustomer from './InfomationCustomer';
import ChangePassword from './ChangePassword';
import PageHeaderLayout from "../../../../layouts/PageHeaderLayout";
import ContentHolder from "../../../../components/utility/ContentHolder";
import {inject, observer} from "mobx-react";
import {Keys} from '../../../../stores/index';

const TabPane = Tabs.TabPane;

@Form.create()
@inject(Keys.me)
@observer
export default class UserConfig extends Component {

  changeScannerKey = (e) => {
    this.me.setScannerKey(+e.target.value);
  };

  callback = (key) => {
    console.log(key);
  };

  constructor(props) {
    super(props);
    this.me = this.props.me;
  }

  render() {

    return (
      <PageHeaderLayout title="Cấu hình tài khoản cá nhân">
        <ContentHolder>
          <Tabs defaultActiveKey="1" onChange={this.callback}>
            <TabPane
              tab={<span><Icon type="setting"/>Thông tin tài khoản</span>}
              key="1"
            >
              <InfomationCustomer/>
            </TabPane>

            <TabPane
              tab={<span><Icon type="lock"/>Thay đổi mật khẩu</span>}
              key="2"
            >
              <ChangePassword/>
            </TabPane>
          </Tabs>
        </ContentHolder>
      </PageHeaderLayout>
    )
  }

}
