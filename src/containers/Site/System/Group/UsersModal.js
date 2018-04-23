import React from 'react';
import {Modal, Form, Spin, Table, Row, Col, Button, Tag, Tooltip} from 'antd';
import {inject, observer} from 'mobx-react';
import {Keys} from "../../../../stores";
import TotalRecord from "../../../../components/TotalRecord";
import UserProvider from "../../Common/UserProvider/UserProvider";
import basicStyle from "../../../../config/basicStyle";
import EnumRoleTypes from "../../Common/RoleProvider/index";
import ObjectPath from 'object-path';

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    xs: {span: 24},
    sm: {span: 8},
  },
  wrapperCol: {
    xs: {span: 24},
    sm: {span: 16},
  },
};
const tailFormItemLayout = {
  labelCol: {
    xs: {span: 24},
    sm: {span: 4},
  },
  wrapperCol: {
    xs: {span: 24},
    sm: {span: 20},
  },
};

@Form.create()
@inject(Keys.group)
@observer
export default class UsersModal extends React.Component {

  constructor(props) {
    super(props);
    this.group = props.group;
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      console.log('Received values of form: ', values);
      if (!err) {
        let {UserIDs, RoleID} = values;
        let credentials = [];
        if (Array.isArray(UserIDs)) {
          credentials = UserIDs.map(val => {
            return {
              UserID: val ? +val : null,
              RoleID: RoleID ? +RoleID : null,
            }
          })
        }
        this.group.addPeopleToGroup(this.group.isFetchingRowID, {Users: credentials}).then(() => {
          this.props.form.resetFields();
          this.props.form.setFieldsValue({UserIDs: []});
          this.group.reloadUsersByGroupID();
        });
      }
    });
  };
  closeModal = () => {
    this.props.form.resetFields();
    this.props.form.setFieldsValue({UserIDs: []});
   this.group.cancelModal();
  }

  render() {
    const {getFieldDecorator} = this.props.form;
    const {usersCurrentRow, isFetchingCurrentRow, usersPagination, countSelectedRowKeys} = this.group;
    let counter = usersPagination ? (usersPagination.pageSize * (usersPagination.current - 1)) : 0;
    let columns = [{
      title: '#',
      key: 'index',
      render: (text, record, index) => <span>{index + 1 + counter}</span>
    }, {
      title: 'Ảnh đại diện',
      dataIndex: 'User',
      key: 'Avatar',
      width: 110,
      render: (text) => <span>{ObjectPath.get(text, 'Avatar.Thumb.Url') &&
      <img src={text.Avatar.Thumb.Url} alt="" style={{maxWidth: '100%'}}/>}</span>
    }, {
      title: 'Người dùng',
      dataIndex: 'User',
      width: 230,
      key: 'Name',
      render: (text, record, index) => {
        if (text) {
          return (
            <div>
              <div>
                <span>Mã: </span>
                <Tag color="purple" key={index}>{text.Code}</Tag>
              </div>
              <div>
                <span>Tên: </span>
                <span style={{color: '#1890ff'}}>{text.Name}</span>
              </div>
              <div>Điện thoại: {text.Phone}</div>
            </div>
          )
        }
      }
    }, {
      title: 'Liên đoàn',
      dataIndex: 'User',
      key: 'Hub',
      render: (text, record, index) => {
        if (text && text.Hub) {
          return (
            <div className={"tagList"}>
              <Tooltip title={`${text.Hub.Name}`}>
                <Tag color="purple">{text.Hub.Code}</Tag>
              </Tooltip>
            </div>
          )
        }
      }
    }, {
      title: 'Vai trò',
      dataIndex: 'Role',
      key: 'role',
      width: 100,
      render: (text) => (
        <div className={"tagList"}>
          {
            text && text.Name && <Tag color="#87d068">{text.Name}</Tag>
          }
        </div>
      )
    }, {
      title: 'Trạng thái',
      dataIndex: 'User',
      key: 'State',
      render: (text) => {
        if (text && text.State) {
          return (<Tag color={text.State.Code === 'Active' ? "#87d068" : "#f50"}>{text.State.Name}</Tag>)
        }
      }
    }];

    // rowSelection object indicates the need for row selection
    const rowSelection = {
      selectedRowKeys: this.group.getSelectedRowKeys,
      onChange: (selectedRowKeys) => {
        this.group.onRowSelectionChange(selectedRowKeys);
      }
    };

    return (
      <Modal
        width={'1000px'}
        title={`Thành viên ${this.group.isFetchingRowName}`}
        visible={this.group.isShowUsersModal}
        onCancel={this.closeModal}
        footer={false}
      >
        <Form onSubmit={this.handleSubmit} className={'custom-form'}>
          <FormItem
            {...tailFormItemLayout}
            label={'Người dùng'}
          >
            {getFieldDecorator('UserIDs', {
              rules: [
                {required: true, message: 'Vui lòng chọn người dùng'}
              ]
            })(
              <UserProvider mode={'multiple'} maxTagCount={3}/>
            )}
          </FormItem>

          <Row gutter={basicStyle.gutter}>
            <Col span={12}>
              <FormItem
                {...formItemLayout}
                label={'Vai trò trong nhóm'}
              >
                {getFieldDecorator('RoleID', {
                  rules: [
                    {required: true, message: 'Vui lòng chọn vai trò'}
                  ],
                  initialValue: '11'
                })(
                  <EnumRoleTypes mode='default' valueByCode={false} placeholder={'Vai trò người dùng trong nhóm'} RoleType='Group'/>
                )}
              </FormItem>
            </Col>

            <Col span={6}>
              <FormItem>
                <Button
                  type={'primary'}
                  htmlType={'submit'}
                  style={{width: '100%'}}
                  icon={'plus'}
                  loading={this.group.isCreating}
                >
                  Thêm thành viên
                </Button>
              </FormItem>
            </Col>

            <Col span={6}>
              <FormItem>
                <Button
                  disabled={!(countSelectedRowKeys > 0)}
                  type={'danger'}
                  style={{width: '100%'}}
                  icon={'minus'}
                  loading={this.group.isUpdating}
                  onClick={this.group.onSubmitRemovePeople}
                >
                  Xóa {countSelectedRowKeys > 0 ? countSelectedRowKeys : ''} thành viên
                </Button>
              </FormItem>
            </Col>
          </Row>
        </Form>

        <div className={'standardTable'} style={{marginTop: 16}}>
          <TotalRecord total={usersPagination.total} name={'thành viên'}/>

          <Spin spinning={isFetchingCurrentRow}>
            <Table
              rowSelection={rowSelection}
              dataSource={usersCurrentRow ? usersCurrentRow.slice() : []}
              columns={columns}
              rowKey={record => (record.User && record.User.ID)}
              pagination={usersPagination}
              onChange={this.group.handleUsersTableChange}
            />
          </Spin>
        </div>
      </Modal>
    )
  }

}