import React, {Component} from 'react';
import ObjectPath from 'object-path';
import {Button, Dropdown, Icon, Menu, Spin, Switch, Table} from 'antd';
import ContentHolder from '../../../../components/utility/ContentHolder';
import HubTableControl from "./HubTableControl";
import Permission from "../../../../permissions/index";
import PageHeaderLayout from '../../../../layouts/PageHeaderLayout';
import {inject, observer} from "mobx-react";
import {Keys} from '../../../../stores/index';
import TotalRecord from '../../../../components/TotalRecord/index';
import HubForm from './HubForm';

@inject(Keys.hubTable)
@observer
export default class HubTable extends Component {

  handleChange = (id, checked) => {
    this.props.hubTable.active(id, checked);
  };

  componentDidMount() {
    this.props.hubTable.reload();
  }

  componentWillUnmount() {
    this.props.hubTable.clear();
  }

  handleClickMenu = (id, {item, key, keyPath}) => {
    console.log("handleClickMenu", key);
    switch (key) {
      case 'edit':
        this.props.hubTable.showUpdateModal(id);
        break;
      default:
        return;
    }
  };

  render() {
    let {dataSource, fetching} = this.props.hubTable;
    // let {activeData, deactiveData} = this.props;

    let columns = [{
      title: 'ID',
      dataIndex: 'ID',
      key: 'ID',
    }, {
      title: 'Liên đoàn',
      dataIndex: 'Name',
      key: 'Name',
      render: (text, record, index) => <a>{text}</a>,
    }, {
      title: 'Mã',
      dataIndex: 'Code',
      key: 'Code',
    }, {
      title: 'Điện thoại',
      dataIndex: 'Phone',
      key: 'Phone',
      render: (text, record, index) => <span>{text}</span>
    }, {
      title: 'Public/Private',
      dataIndex: 'Accessibility',
      key: 'Accessibility',
      render: (text, record, index) => <span>{ObjectPath.get(record, "Accessibility.Name")}</span>
    }];
    if (Permission.allowUpdateStateHub()) {
      columns.push({
        title: 'Kích hoạt',
        dataIndex: '',
        key: 'active',
        render: (text, record, index) =>
          <Spin spinning={this.props.hubTable.isFetchingRowID === record.ID}>
            <Switch
              unCheckedChildren={<Icon type="lock"/>}
              onChange={(checked) => this.handleChange(record.ID, checked)}
              checked={ObjectPath.get(record, 'State.Code', "").toUpperCase() === 'ACTIVE'}
            />
          </Spin>
      })
    }
    if (Permission.allowUpdateHub()) {
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
      })
    }

    return (
      <PageHeaderLayout title="Danh sách liên đoàn">
        <HubForm/>

        <ContentHolder>
          <HubTableControl/>

          <div style={{marginTop: 16}}>
            <TotalRecord total={this.props.hubTable.pagination.total} name={"liên đoàn"}/>

            <Spin spinning={fetching}>
              <Table
                dataSource={dataSource.slice()}
                columns={columns}
                rowKey={record => record.ID}
                pagination={this.props.hubTable.pagination}
                onChange={this.props.hubTable.handleTableChange}
              />
            </Spin>
          </div>
        </ContentHolder>
      </PageHeaderLayout>
    )
  }

}
