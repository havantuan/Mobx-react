import React, {Component} from 'react';
import {Button, Spin, Table, Tag, Popconfirm, Icon, Menu, Dropdown} from 'antd';
import ContentHolder from '../../../../components/utility/ContentHolder';
import EditPermission from "./EditPermission";
import Permission from "../../../../permissions/index";
import PageHeaderLayout from "../../../../layouts/PageHeaderLayout";
import {inject, observer} from 'mobx-react';
import {Keys} from "../../../../stores/index";
import RoleModal from "./RoleModal";

const NodeColumnTable = (data) => {
  return (
    <div className={"tagList"}>
      {data.data.map((el, index) => {
        return <Tag key={index} color="#87d068">{el.Name}</Tag>
      })}
    </div>
  )
};

@inject(Keys.role)
@observer
export default class RoleTable extends Component {

  constructor(props) {
    super(props);
    this.role = props.role;
  }

  componentWillUnmount() {
    this.role.clear();
  }

  componentDidMount() {
    this.role.fetch({RoleType: null});
  }

  handleDeleteRole = (code) => {
    this.role.deleteRole(code);
  }
  handleClickMenu = (id, {item, key, keyPath}) => {
    switch (key) {
      case 'edit':
        this.props.role.upDateRole(id);
        break;
      default:
        return;
    }
  }

  render() {
    let {dataSource = [], fetching} = this.role;
    const columns = [{
      key: 'stt',
      title: '#',
      dataIndex: '',
      render: (text, record, index) => <span>{index + 1}</span>
    }, {
      title: 'Vai trò',
      dataIndex: 'Role',
      key: 'role',
      render: (text, record, index) => {
        return (
          <div>
            <a>{record.Name ? record.Name : 'Role'}</a>
          </div>
        )
      }
    }, {
      key: 'code',
      title: 'Code',
      dataIndex: 'Code',
      render: (text, record, index) => <span>{text}</span>
    },{
      title: 'Type',
      key: 'Type',
      render: (text, record, index) =><span>{record.Type.Name}</span>
    }, {
      width: 700,
      key: 'groupPermission',
      title: 'Nhóm quyền',
      dataIndex: 'Permissions',
      render: (text, record, index) => <NodeColumnTable data={text}/>
    },
    ];
    if (Permission.allowGrantPermissionRole()) {
      columns.push({
        title: 'Hành động',
        key: 'action',
        render: (text, record, index) => {
          return (
            <Button
              size={'small'}
              type="primary"
              onClick={() => this.role.showModal(record)}
            >
              Chọn quyền
            </Button>
          )
        }
      })
    }
    if (Permission.allowUpdateRole()) {
      columns.push({
        title: 'Xử lý',
        key: 'delete',
        render: (text, record, index) => {
          const menu = (
            <Menu onClick={(e) => this.handleClickMenu(record.ID, e)}>
              <Menu.Item key="edit">
                <Icon type="edit"/> Chỉnh sửa
              </Menu.Item>
              <Menu.Item key="delete">
                <Popconfirm
                  title={`Bạn có muốn xóa vai trò ${record.Name}?`}
                  onConfirm={() => this.handleDeleteRole(record.ID)}
                  okText="Đồng ý"
                  cancelText="Bỏ qua"
                >
                  <Icon type="compass"/>&nbsp;Xóa vai trò
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
          );
        }
      })
    }

    return (
      <PageHeaderLayout
        title={'Phân quyền vai trò'}
      >
        <ContentHolder>
          <EditPermission/>
          <RoleModal/>
          {Permission.allowUpdateRole() &&
          <div style={{textAlign: 'right', marginBottom: 16}}>
            <Button
              icon="plus"
              type="primary"
              onClick={this.role.openModal}
            >
              Thêm vai trò mới
            </Button>
          </div>
          }
          <div style={{marginTop: 16}}>
            <Spin spinning={fetching}>
              <Table
                pagination={false}
                dataSource={dataSource.slice()}
                columns={columns}
                rowKey={record => record.ID}
              />
            </Spin>
          </div>
        </ContentHolder>
      </PageHeaderLayout>
    )
  }

}
