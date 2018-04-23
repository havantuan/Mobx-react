import React, {Component} from 'react';
import ObjectPath from 'object-path';
import {Button, Dropdown, Icon, Menu, Spin, Switch, Table, Tag, Tooltip, Upload} from 'antd';
import ContentHolder from '../../../../components/utility/ContentHolder';
import UsersTableControl from "./UsersTableControl";
import EditRole from "./EditRole";
import PageHeaderLayout from "../../../../layouts/PageHeaderLayout";
import {inject, observer} from 'mobx-react';
import {Keys} from "../../../../stores/index";
import TotalRecord from '../../../../components/TotalRecord/index';
import UserForm from "./UserForm";
import apiUrl from "../../../../config/apiUrl";
import Permission from '../../../../permissions/index';

@inject(Keys.user, Keys.router, Keys.app)
@observer
export default class UsersTable extends Component {

  state = {
    isLoadingRowID: null
  };

  constructor(props) {
    super(props);
    this.user = props.user;
  }

  componentDidMount() {
    this.user.reload();
  };

  componentWillUnmount() {
    this.user.clear();
  }

  showRoleModal = (e, data) => {
    e.preventDefault();
    this.user.showRoleModal(data);
  };

  handleClick = ({item, key, keyPath}, data) => {
    switch (key) {
      case 'edit':
        this.user.showUpdateModal(data);
        break;
      case 'role':
        this.user.showRoleModal(data);
        break;
      default:
        return null;
    }
  };

  handleChange = (info, userID) => {
    if (info.file.status === 'uploading') {
      this.setState({isLoadingRowID: userID});
      return;
    }
    if (info.file.status === 'done') {
      console.log('%c done...', 'background: #009900; color: #fff',);
      this.setState({isLoadingRowID: null}, () => {
        this.user.reload();
      });
    }
    if (info.file.status === 'error') {
      console.log('%c error...', 'background: #009900; color: #fff',);
      this.setState({isLoadingRowID: null});
    }
  };

  render() {
    let {dataSource, fetching, pagination} = this.user;
    let counter = pagination ? (pagination.pageSize * (pagination.current - 1)) : 0;

    let columns = [{
      title: '#',
      dataIndex: '',
      key: 'index',
      render: (text, record, index) => <span>{index + 1 + counter}</span>
    }, {
      title: 'Ảnh đại diện',
      dataIndex: 'Portrait',
      key: 'Portrait',
      width: 160,
      render: (text, record, index) => {
        return (
          <Upload
            name="avatar"
            listType="picture-card"
            className="avatar-uploader"
            showUploadList={false}
            action={apiUrl.UPDATE_USER_IMAGE_URL.replace(':id', record.ID)}
            // beforeUpload={beforeUpload}
            onChange={(info) => this.handleChange(info, record.ID)}
            headers={{
              Authorization: `Bearer ${this.props.app.token}`
            }}
          >
            {(text && text.Url) ? <img src={ObjectPath.get(text, "Thumb.Url")} alt="" style={{maxWidth: '100%'}}/>
              : (
                <div>
                  <Icon type={this.state.isLoadingRowID === record.ID ? 'loading' : 'plus'}/>
                  <div className="ant-upload-text">Upload</div>
                </div>
              )}
          </Upload>
        )
      }
    }, {
      title: 'Người dùng',
      dataIndex: '',
      width: 230,
      key: 'Name',
      render: (text, record, index) => {
        return (
          <div>
            <div>
              <span>Mã : </span>
              <Tag color="#87d068" key={index}>{record.Code}</Tag>
            </div>
            <div>
              <span>Tên: </span>
              <span style={{color: '#1890ff'}}>{record.Name}</span>
            </div>
            <div>Điện thoại: {record.Phone}</div>
          </div>
        )
      }
    }, {
      title: 'Liên đoàn',
      dataIndex: 'Hub',
      key: 'Hub',
      render: (text, record, index) => (
        <div className={"tagList"}>
          {
            text &&
            <Tooltip title={`${text.Name}`}>
              <Tag color="purple">{text.Code}</Tag>
            </Tooltip>
          }
        </div>
      )
    }, {
      title: 'Vai trò',
      dataIndex: 'Roles',
      key: 'roles',
      width: 100,
      render: (text, record, index) => (
        <div className={"tagList"}>
          {
            text && text.map(val => <Tag color="#87d068" key={val.ID}>{val.Name}</Tag>)
          }
        </div>
      )
    }, {
      title: 'Trạng thái',
      dataIndex: 'State',
      key: 'State',
      render: (text, record, index) => <Tag color={text.Code === 'Active' ? "#87d068" : "#f50"}>{text.Name}</Tag>
    }];

    {
      Permission.allowUpdateStateUser() &&
      columns.push({
        title: 'Kích hoạt',
        dataIndex: '',
        key: 'active',
        render: (text, record, index) =>
          <Spin
            spinning={this.user.isActiveID === record.ID ? this.user.isActiveFetching : false}>
            {
              <Switch
                unCheckedChildren={<Icon type="lock"/>}
                onChange={(checked) => this.user.onActiveChange(record.ID, checked)}
                checked={ObjectPath.get(record, 'State.Code', '').toUpperCase() === 'ACTIVE'}
              />
            }
          </Spin>
      });
    }

    columns.push({
      title: 'Xử lý',
      dataIndex: '',
      key: 'action',
      render: (text, record, index) => {
        const menu = (
          <Menu onClick={(e) => this.handleClick(e, record)}>
            {
              Permission.allowUpdateUser() &&
              <Menu.Item key="edit">
                <Icon type="edit"/> Chỉnh sửa
              </Menu.Item>
            }

            {
              Permission.allowGrantRoleUser() &&
              <Menu.Item key="role">
                <Icon type="safety"/> Vai trò
              </Menu.Item>
            }
          </Menu>
        );

        return (
          <Dropdown overlay={menu} trigger={['click']}>
            <Button
              icon="ellipsis"
            >
            </Button>
          </Dropdown>
        );
      }
    });

    return (
      <PageHeaderLayout
        title={'Danh sách người dùng'}
      >
        <ContentHolder>
          <EditRole/>
          <UserForm/>

          <UsersTableControl/>

          <div className={'standardTable'} style={{marginTop: 16}}>
            <TotalRecord total={this.user.pagination.total} name={'người dùng'}/>

            <Spin spinning={fetching}>
              <Table
                dataSource={dataSource.slice()}
                columns={columns}
                rowKey={record => record.ID}
                pagination={pagination}
                onChange={this.user.handleTableChange}
              />
            </Spin>
          </div>
        </ContentHolder>
      </PageHeaderLayout>
    )
  }

}