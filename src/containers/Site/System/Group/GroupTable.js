import React from 'react';
import {Button, Dropdown, Icon, Menu, Spin, Table, Tag} from 'antd';
import {inject, observer} from 'mobx-react';
import {Keys} from "../../../../stores";
import PageHeaderLayout from "../../../../layouts/PageHeaderLayout";
import ContentHolder from "../../../../components/utility/ContentHolder";
import TotalRecord from "../../../../components/TotalRecord";
import ObjectPath from 'object-path';
import GroupTableControl from "./GroupTableControl";
import GroupForm from "./GroupForm";
import UsersModal from "./UsersModal";
import Permission from '../../../../permissions/index';


@inject(Keys.group)
@observer
export default class GroupTable extends React.Component {

  constructor(props) {
    super(props);
    this.group = props.group;
  }

  componentDidMount() {
    this.group.reload();
  }

  componentWillUnmount() {
    console.log('%cclear.....', 'color: #00b33c', )
    this.group.clear();
  }

  handleClick = ({item, key, keyPath}, data) => {
    switch (key) {
      case 'edit':
        this.group.showUpdateModal(data);
        break;
      case 'user':
        this.group.showUsersModal(data);
        break;
      default:
        return null;
    }
  };

  render() {
    let {dataSource, fetching, pagination} = this.group;
    let counter = pagination ? (pagination.pageSize * (pagination.current - 1)) : 0;

    let columns = [{
      title: '#',
      key: 'index',
      render: (text, record, index) => <span>{index + 1 + counter}</span>
    },{
      title: 'Mã nhóm',
      dataIndex: 'Code',
    }, {
      title: 'Hình ảnh',
      dataIndex: 'Icon',
      key: 'Icon',
      width: 160,
      render: (text, record, index) => <div>{ObjectPath.get(text, 'Thumb.Url') && <img src={text.Thumb.Url} alt="" style={{maxWidth: '100%'}}/>}</div>
    }, {
      title: 'Nhóm',
      key: 'group',
      render: (text, record, index) => {
        return (
          <div>
            <div>
              <span>Tên: <span style={{color: '#1890ff'}}>{record.Title}</span></span>
            </div>
            <div>
              <span>Nhóm cha: </span> {ObjectPath.get(record,"Parent.Title")}
            </div>
            <div>
              <span>Loại: <span style={{color: '#1890ff'}}>{ObjectPath.get(record, "GroupType.Name")}</span></span>
            </div>
            <div>
              <span>Tạo: {ObjectPath.get(record, 'CreatedAt.Pretty')}</span>
            </div>
            <div>
              <span>Cập nhật: {ObjectPath.get(record, 'UpdatedAt.Pretty')}</span>
            </div>
          </div>
        )
      }
    }, {
      title: 'Mô tả',
      dataIndex: 'Description',
    }, {
      title: 'Khả năng truy cập',
      dataIndex: 'GroupAccessibility',
      key: 'GroupAccessibility',
      render: (text, record, index) => <span>{text ? text.Name : ''}</span>
    }, {
      title: 'Trạng thái',
      dataIndex: 'State',
      key: 'State',
      render: (text, record, index) => <Tag color={text.Code === 'Active' ? "#87d068" : "#f50"}>{text.Name}</Tag>
    }, {
      title: 'Số thành viên',
      dataIndex: 'Users',
      key: 'Users',
      render: (text, record, index) => <span>{ObjectPath.get(text, 'Pager.TotalOfItems')}</span>
    },{
      title: 'Số thứ tự ưu tiên',
      dataIndex: 'Stt',
      key: 'Stt',
      render: (text, record, index) => <span>{ObjectPath.get(record, "Order")}</span>
    }];

    columns.push({
      title: 'Xử lý',
      dataIndex: '',
      key: 'action',
      render: (text, record, index) => {
        const menu = (
          <Menu onClick={(e) => this.handleClick(e, record)}>
            {
              Permission.allowUpdateGroup() &&
              <Menu.Item key="edit">
                <Icon type="edit"/> Chỉnh sửa
              </Menu.Item>
            }

            {
              Permission.allowUpdateMembersGroup() &&
              <Menu.Item key="user">
                <Icon type="user"/> Thành viên
              </Menu.Item>
            }
          </Menu>
        );

        return (
          <Dropdown overlay={menu} trigger={['click']}>
            <Button
              icon="ellipsis"
            />
          </Dropdown>
        );
      }
    });

    return (
      <PageHeaderLayout
        title={this.group.groupType ? `` : `Danh sách nhóm`}
      >
        <ContentHolder>
          <GroupForm/>
          <UsersModal/>

          <GroupTableControl/>

          <div className={'standardTable'} style={{marginTop: 16}}>
            <TotalRecord total={this.group.pagination.total} name={'nhóm'}/>

            <Spin spinning={fetching}>
              <Table
                dataSource={dataSource.slice()}
                columns={columns}
                rowKey={record => record.ID}
                pagination={pagination}
                onChange={this.group.handleTableChange}
              />
            </Spin>
          </div>
        </ContentHolder>
      </PageHeaderLayout>
    )
  }

}