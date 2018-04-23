import React from 'react';
import ObjectPath from 'object-path';
import {Spin, Table, Tag} from 'antd';
import ContentHolder from '../../../../components/utility/ContentHolder';
import NotificationTableControl from "./NotificationTableControl";
import PageHeaderLayout from "../../../../layouts/PageHeaderLayout";
import NotificationModal from "./NotificationModal";
import {inject, observer} from "mobx-react";
import {Keys} from '../../../../stores/index';
import TotalRecord from '../../../../components/TotalRecord/index';

@inject(Keys.notification)
@observer
export default class NotificationTable extends React.Component {

  constructor(props) {
    super(props);
    this.notification = this.props.notification;
  }

  componentWillUnmount() {
    this.notification.clear();
  }

  componentDidMount() {
    this.notification.reload();
  }

  render() {
    let {dataSource, fetching} = this.notification;

    let columns = [{
      title: 'ID',
      dataIndex: 'ID',
      key: 'ID',
    }, {
      title: 'Tiêu đề',
      dataIndex: 'Title',
      key: 'Title',
      width: '20%'
    }, {
      title: 'Chi tiết',
      dataIndex: 'Body',
      key: 'Body',
      width: '30%'
    }, {
      title: 'Đối tượng nhận',
      dataIndex: 'AppType',
      key: 'AppType',
      render: (text, record, index) => <span>{ObjectPath.get(record, "AppType.Name")}</span>
    }, {
      title: 'Thời gian gửi',
      dataIndex: 'Date',
      key: 'Date',
      width: '20%',
      render: (text, record, index) => <p>{ObjectPath.get(record, "Date.Pretty")}</p>
    }, {
      title: 'Trạng thái gửi thông báo',
      dataIndex: 'detail',
      key: 'detail',
      render: (text, record, index) => (
        <div className={'tagList'}>
          <div>
            <b>{'Thiết bị nhận thành công: '}</b>
            <Tag color={'green'}>{ObjectPath.get(record, "TotalPushSuccess")}</Tag>
          </div>
          <div>
            <b>{'Tổng số thiết bị gửi: '}</b>
            <Tag color={'blue'}>{ObjectPath.get(record, "TotalPushTokens")}</Tag>
            </div>
        </div>
      )
    }];

    return (
      <PageHeaderLayout title={'Danh sách thông báo'}>
        <ContentHolder>
          <NotificationTableControl/>

          <NotificationModal/>

          <div style={{marginTop: 20}}>
            <TotalRecord total={this.notification.pagination.total} name={'thông báo'}/>
            <Spin spinning={fetching}>
              <Table
                dataSource={dataSource ? dataSource.slice() : []}
                columns={columns}
                rowKey={record => record.ID}
                pagination={this.notification.pagination}
                onChange={this.notification.handleTableChange}
              />
            </Spin>
          </div>

        </ContentHolder>
      </PageHeaderLayout>
    )
  }

}