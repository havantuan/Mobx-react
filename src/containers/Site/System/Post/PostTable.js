import React, {Component} from 'react';
import ObjectPath from 'object-path';
import {Button, Dropdown, Icon, Menu, Spin, Table, Tooltip, Popconfirm, Row, Col } from 'antd';
import ContentHolder from '../../../../components/utility/ContentHolder';
import PostTableControl from "./PostTableControl";
import Permission from "../../../../permissions/index";
import PageHeaderLayout from '../../../../layouts/PageHeaderLayout';
import {inject, observer} from "mobx-react";
import {Keys} from '../../../../stores/index';
import TotalRecord from '../../../../components/TotalRecord/index';
import PostForm from './PostForm';
import basicStyle from "../../../../config/basicStyle";
import ApprovedPostModal from "./ApprovedPostModal";
import HubList from "../../Common/HubProvider/hubList";

@inject(Keys.postTable)
@observer
export default class PostTable extends Component {

  handleChange = (id, checked) => {
    this.props.postTable.active(id, checked);
  };

  componentDidMount() {
    this.props.postTable.reload();
  }

  componentWillUnmount() {
    this.props.postTable.clear();
  }

  handleClickMenu = (data, {item, key, keyPath}) => {
    switch (key) {
      case 'edit':
        this.props.postTable.showUpdateModal(data);
        break;
      default:
        return;
    }
  };

  render() {
    let {dataSource, fetching} = this.props.postTable;

    let columns = [{
      title: 'ID',
      dataIndex: 'ID',
      key: 'ID'
    }, {
      title: 'Bài viết',
      key: 'post',
      width: '600px',
      render: (text, record) => (
        <div>
          <div>
            <span>Tiêu đề: <span style={{color: basicStyle.colors.title}}>{record.Title}</span></span>
          </div>
          <div>
            <span>Tạo: {ObjectPath.get(record, 'CreatedAt.Pretty')}</span>
          </div>
          <div>
            <span>Tạo bởi: {ObjectPath.get(record, 'CreatedBy.Name')}</span>
          </div>
          {
            record && record.UpdateBy &&
            <div>
              <span>Cập nhật: {ObjectPath.get(record, 'UpdatedAt.Pretty')}</span>
              <div>
                <span>Cập nhật bởi: {record.UpdatedBy.Name}</span>
              </div>
            </div>
          }
        </div>
      )
    }, {
      title: 'Nhóm',
      dataIndex: 'Group',
      key: 'Group',
      render: (text) => <span>{text && text.Title}</span>
      // }, {
      //   title: 'Nội dung',
      //   dataIndex: 'Content',
      //   key: 'Content',
      //   width: '50%',
      //   render: (text) => <div dangerouslySetInnerHTML={{__html: text}}/>
    }, {
      title: 'Trạng thái phê duyệt',
      dataIndex: 'ApproveType',
      key: 'ApproveType',
      render: (text) => <span>{text && text.Name}</span>
    }];
    if (Permission.allowUpdatePostGroup()) {
      columns.push({
        title: 'Xử lý',
        dataIndex: '',
        key: 'action',
        render: (text, record, index) => {
          const menu = (
            <Menu onClick={(e) => this.handleClickMenu(record, e)}>
              <Menu.Item key="edit">
                <Icon type="edit"/> Chỉnh sửa
              </Menu.Item>

              <Menu.Item key="delete">
                <Popconfirm
                  title="Bạn có chắc chắn muốn xóa không?"
                  onConfirm={() => {this.props.postTable.deletePost(record.ID)
                  }}
                  okText="Có"
                  cancelText="Không"
                >
                <Icon type="delete"/> Xóa bài viết
                </Popconfirm>
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
    columns.push({
      title: 'Ghim',
      dataIndex: 'Pin',
      key: 'pin',
      render: (text, record) => (
        <Tooltip
          title={text ? 'Đã ghim' : 'Ghim bài viết'}
        >
          <Button
            icon={'pushpin'}
            style={{color: text ? '#ff0000' : '#dddddd'}}
            onClick={() => this.props.postTable.pinAPost(text, record.ID)}
          />
        </Tooltip>
      )
    });

    // rowSelection object indicates the need for row selection
    const rowSelection = {
      selectedRowKeys: this.props.postTable.getSelectedRowKeys,
      onChange: (selectedRowKeys) => {
        this.props.postTable.onRowSelectionChange(selectedRowKeys);
      }
    };

    return (
      <PageHeaderLayout
        title={<Row><Col md={16} sm={16}>{this.props.postTable.groupType ? `` : `Danh sách bài viết`}</Col><Col md={8} sm={8} style={{textAlign: 'right'}}>{this.props.postTable.groupType ? `` : <div><a target="_blank" href={`/static/Slide/suy-nghi-dai-bieu.html`}>Tâm tư</a></div>}</Col></Row>}
      >
        <PostForm/>
        <ApprovedPostModal/>

        <ContentHolder>
          <PostTableControl/>

          <div style={{marginTop: 16}}>
            <TotalRecord total={this.props.postTable.pagination.total} name={"bài viết"}/>

            <Spin spinning={fetching}>
              <Table
                rowSelection={rowSelection}
                dataSource={dataSource.slice()}
                columns={columns}
                rowKey={record => record.ID}
                pagination={this.props.postTable.pagination}
                onChange={this.props.postTable.handleTableChange}
              />
            </Spin>
          </div>
        </ContentHolder>
      </PageHeaderLayout>
    )
  }

}
