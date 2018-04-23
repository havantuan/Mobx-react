import React, {Component} from 'react';
import ObjectPath from 'object-path';
import {Button, Dropdown, Icon, Menu, Spin, Table} from 'antd';
import ContentHolder from '../../../../components/utility/ContentHolder';
import AwardTableControl from "./AwardTableControl";
import PageHeaderLayout from '../../../../layouts/PageHeaderLayout';
import {inject, observer} from "mobx-react";
import {Keys} from '../../../../stores/index';
import TotalRecord from '../../../../components/TotalRecord/index';
import AwardForm from './AwardForm';
import UsersModal from "./UsersModal";

@inject(Keys.awardTable)
@observer
export default class AwardTable extends Component {

  handleChange = (id, checked) => {
    this.props.awardTable.active(id, checked);
  };

  componentDidMount() {
    this.props.awardTable.reload();
  }

  componentWillUnmount() {
    this.props.awardTable.clear();
  }

  handleClickMenu = (id, {item, key, keyPath}) => {
    console.log("handleClickMenu", key);
    switch (key) {
      case 'edit':
        this.props.awardTable.showUpdateModal(id);
        break;
      case 'user':
        this.props.awardTable.showUsersModal(id);
        break;
      default:
        return;
    }
  };

  render() {
    let {dataSource, fetching} = this.props.awardTable;
    // let {activeData, deactiveData} = this.props;

    let columns = [{
      title: 'ID',
      dataIndex: 'ID',
      key: 'ID',
    }, {
      title: 'Giải thưởng',
      dataIndex: 'Title',
      key: 'Title',
      render: (text, record, index) => <span>{ObjectPath.get(record, "Title")}</span>,
    }, {
      title: 'Mô tả',
      dataIndex: 'Description',
      key: 'Description',
      render: (text) => <span>{text}</span>
    }, {
      title: 'Nhóm giải thưởng',
      dataIndex: 'GroupAward',
      key: 'GroupAward',
      render: (text, record, index ) => <span>{ObjectPath.get(record, "AwardGroup.Title")}</span>
    }];

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
            <Menu.Item key="user">
              <Icon type="user"/> Thành viên
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
    return (
      <PageHeaderLayout title="Danh sách giải thưởng">
        <AwardForm/>
        <UsersModal/>
        <ContentHolder>
          <AwardTableControl/>
          <div style={{marginTop: 16}}>
            <TotalRecord total={this.props.awardTable.pagination.total} name={"giải thưởng"}/>

            <Spin spinning={fetching}>
              <Table
                dataSource={dataSource.slice()}
                columns={columns}
                rowKey={record => record.ID}
                pagination={this.props.awardTable.pagination}
                onChange={this.props.awardTable.handleTableChange}
              />
            </Spin>
          </div>
        </ContentHolder>
      </PageHeaderLayout>
    )
  }

}
