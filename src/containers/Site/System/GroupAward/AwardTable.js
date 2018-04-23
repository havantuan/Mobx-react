import React, {Component} from 'react';
import ObjectPath from 'object-path';
import {Button, Dropdown, Icon, Menu, Spin, Switch, Table} from 'antd';
import ContentHolder from '../../../../components/utility/ContentHolder';
import AwardTableControl from "./AwardTableControl";
import Permission from "../../../../permissions/index";
import PageHeaderLayout from '../../../../layouts/PageHeaderLayout';
import {inject, observer} from "mobx-react";
import {Keys} from '../../../../stores/index';
import TotalRecord from '../../../../components/TotalRecord/index';
import AwardForm from './AwardForm';

@inject(Keys.groupAwardTable)
@observer
export default class AwardTable extends Component {

  handleChange = (id, checked) => {
    this.props.groupAwardTable.active(id, checked);
  };

  componentDidMount() {
    this.props.groupAwardTable.reload();
  }

  componentWillUnmount() {
    this.props.groupAwardTable.clear();
  }

  handleClickMenu = (id, {item, key, keyPath}) => {
    console.log("handleClickMenu", key);
    switch (key) {
      case 'edit':
        this.props.groupAwardTable.showUpdateModal(id);
        break;
      default:
        return;
    }
  };

  render() {
    let {dataSource, fetching} = this.props.groupAwardTable;
    // let {activeData, deactiveData} = this.props;

    let columns = [{
      title: 'ID',
      dataIndex: 'ID',
      key: 'ID',
    }, {
      title: 'Giải thưởng',
      dataIndex: 'Title',
      key: 'Title',
      render: (text, record, index) => <a>{text}</a>,
      sorter: true
    }, {
      title: 'Mô tả',
      dataIndex: 'Description',
      key: 'Description',
      render: (text) => <span>{text}</span>
    }, {
      title: 'Nhóm giải thưởng',
      dataIndex: 'GroupID',
      key: 'GroupID',
      render: (text, record, index) => <a>{ObjectPath.get(record, "AwardGroup.Title")}</a>,
      sorter: true
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
      <PageHeaderLayout title="Danh sách nhóm giải thưởng">
        <AwardForm/>
        <ContentHolder>
          <AwardTableControl/>
          <div style={{marginTop: 16}}>
            <TotalRecord total={this.props.groupAwardTable.pagination.total} name={"nhóm giải thưởng"}/>

            <Spin spinning={fetching}>
              <Table
                dataSource={dataSource.slice()}
                columns={columns}
                rowKey={record => record.ID}
                pagination={this.props.groupAwardTable.pagination}
                onChange={this.props.groupAwardTable.handleTableChange}
              />
            </Spin>
          </div>
        </ContentHolder>
      </PageHeaderLayout>
    )
  }

}
