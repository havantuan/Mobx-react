import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import ObjectPath from 'object-path';
import {Button, Dropdown, Icon, Menu, Spin, Switch, Table, Tag} from 'antd';
import ContentHolder from '../../../../components/utility/ContentHolder';
import CheckinTableControl from "./CheckinTableControl";
import PageHeaderLayout from '../../../../layouts/PageHeaderLayout';
import {inject, observer} from "mobx-react";
import {Keys} from '../../../../stores/index';
import TotalRecord from '../../../../components/TotalRecord/index';
import CheckinForm from './CheckinForm';
import Permission from "../../../../permissions/index";
import routerConfig from "../../../../config/router";
@inject(Keys.checkinTable)
@observer
export default class CheckinTable extends Component {

  handleChange = (id, checked) => {
    this.props.checkinTable.active(id, checked);
  };

  componentDidMount() {
    this.props.checkinTable.reload();
  }

  componentWillUnmount() {
    this.props.checkinTable.clear();
  }

  handleClickMenu = (id, {item, key, keyPath}) => {
    console.log("handleClickMenu", key);
    switch (key) {
      case 'edit':
        this.props.checkinTable.showUpdateModal(id);
        break;
      default:
        return;
    }
  };

  render() {
    let {dataSource, fetching} = this.props.checkinTable;
    // let {activeData, deactiveData} = this.props;

    let columns = [{
      title: 'ID',
      dataIndex: 'ID',
      key: 'ID',
      render: (text, record, index) => <span>{text}</span>
    }, {
      title: 'Tiêu đề',
      dataIndex: 'Title',
      key: 'Title',
      render: (text, record, index) => <Tag color="red"><Link to={routerConfig.detailCheckIn.replace(':code', record.ID)}>{text}</Link></Tag>,
      sorter: true
    },{
      title: 'Trạng thái',
      dataIndex: 'State',
      key: 'State',
      render: (text, record, index) => <span>{ObjectPath.get(record, "State.Name")}</span>
    },{
      title: 'Thời gian',
      dataIndex: 'Date',
      key: 'Date',
      render: (text, record, index) => <span>{ObjectPath.get(record, "Date.Pretty")}</span>
    }];
      if(Permission.allowUpdateCheckIn()) {
        columns.push({
          title: '',
          dataIndex: '',
          key: 'action',
          render: (text, record, index) => {
            const menu = (
              <Menu onClick={(e) => this.handleClickMenu(record.ID, e)}>
                <Menu.Item key="edit">
                  <Icon type="edit"/> Chỉnh sửa
                </Menu.Item>
              </Menu>
            );

            return (
              <Dropdown overlay={menu} trigger={['click']}>
                <Button
                  icon="ellipsis"
                  size="small"
                >
                  Hành động
                </Button>
              </Dropdown>
            )
          }
        });
      }
    ;
    return (
      <PageHeaderLayout title="Danh sách điểm danh">
        <CheckinForm/>

        <ContentHolder>
          <CheckinTableControl/>

          <div style={{marginTop: 16}}>
            <TotalRecord total={this.props.checkinTable.pagination.total} name={"điểm danh"}/>

            <Spin spinning={fetching}>
              <Table
                dataSource={dataSource.slice()}
                columns={columns}
                rowKey={record => record.ID}
                pagination={this.props.checkinTable.pagination}
                onChange={this.props.checkinTable.handleTableChange}
              />
            </Spin>
          </div>
        </ContentHolder>
      </PageHeaderLayout>
    )
  }

}
