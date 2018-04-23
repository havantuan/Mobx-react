import React from 'react';
import {Modal, Form, Spin, Table, Row, Col, Button, Tag, Tooltip} from 'antd';
import {inject, observer} from 'mobx-react';
import {Keys} from "../../../../stores";
import TotalRecord from "../../../../components/TotalRecord";
import UserProvider from "../../Common/UserProvider/UserProvider";
import basicStyle from "../../../../config/basicStyle";
import EnumRoleTypes from "../../Common/EnumProvider/roleTypes";
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
@inject(Keys.awardTable)
@observer
export default class UsersModal extends React.Component {

  constructor(props) {
    super(props);
    this.awardTable = props.awardTable;
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      console.log('Received values of form: ', values);
      if (!err) {
        let {UserIDs} = values;
        let credentials = [];
        if (Array.isArray(UserIDs)) {
          credentials = UserIDs.map(val => +val)
        }
        this.awardTable.addPeopleToGroup(this.awardTable.isFetchingRowID, {UserIDs: credentials}).then(() => {
          this.props.form.resetFields();
          this.props.form.setFieldsValue({UserIDs: []});
          this.awardTable.reloadUsersByGroupID();
        });
      }
    });
  };

  render() {
    const {getFieldDecorator} = this.props.form;
    const {usersCurrentRow, isFetchingCurrentRow, usersPagination, countSelectedRowKeys} = this.awardTable;
    let counter = usersPagination ? (usersPagination.pageSize * (usersPagination.current - 1)) : 0;
    let columns = [{
      title: '#',
      key: 'index',
      render: (text, record, index) => <span>{index + 1 + counter}</span>
    }, {
      title: 'Ảnh đại diện',
      dataIndex: 'Avatar',
      key: 'Avatar',
      width: 110,
      render: (text, record, index) => <span>{ObjectPath.get(record, 'Avatar.Thumb.Url') &&
      <img src={ObjectPath.get(record, 'Avatar.Thumb.Url')} alt="" style={{maxWidth: '100%'}}/>}</span>
    }, {
      title: 'Người dùng',
      dataIndex: 'User',
      width: 230,
      key: 'Name',
      render: (text, record, index) => {
        return (
          <div>
            <div>
              <span>Mã: </span>
              <Tag color="purple" key={index}>{ObjectPath.get(record, "Code")}</Tag>
            </div>
            <div>
              <span>Tên: </span>
              <span style={{color: '#1890ff'}}>{ObjectPath.get(record, "Name")}</span>
            </div>
            <div>Điện thoại: {ObjectPath.get(record, "Phone")}</div>
          </div>
        )
      }
    }, {
      title: 'Liên đoàn',
      dataIndex: 'User',
      key: 'Hub',
      render: (text, record, index) => {
        return (
          <div className={"tagList"}>
            <Tooltip title={`${ObjectPath.get(record, "Hub.Name")}`}>
              <Tag color="purple">{ObjectPath.get(record, "Hub.Code")}</Tag>
            </Tooltip>
          </div>
        )
      }
    }, {
      title: 'Trạng thái',
      dataIndex: 'User',
      key: 'State',
      render: (text, record, index) => {

        return (<Tag
          color={ObjectPath.get(record, "State.Code") === 'Active' ? "#87d068" : "#f50"}>{ObjectPath.get(record, "State.Name")}</Tag>)

      }
    }];

    // rowSelection object indicates the need for row selection
    const rowSelection = {
      selectedRowKeys: this.awardTable.getSelectedRowKeys,
      onChange: (selectedRowKeys) => {
        this.awardTable.onRowSelectionChange(selectedRowKeys);
      }
    };
    console.log('%c this.awardTable.isShowUsersModal', 'color: #00b33c', this.awardTable.isShowUsersModal);
    return (
      <Modal
        width={'1000px'}
        title={`Thành viên ${this.awardTable.isFetchingRowName}`}
        visible={this.awardTable.isShowUsersModal}
        onOk={this.handleSubmit}
        onCancel={this.awardTable.cancelModal}
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
            <Col span={6} offset={4}>

              <Button
                type={'primary'}
                htmlType={'submit'}
                style={{width: '100%'}}
                icon={'plus'}
                loading={this.awardTable.isCreating}
              >
                Thêm thành viên
              </Button>
            </Col>
            <Col span={6}>
              <Button
                disabled={!(countSelectedRowKeys > 0)}
                type={'danger'}
                style={{width: '100%'}}
                icon={'minus'}
                loading={this.awardTable.isUpdating}
                onClick={this.awardTable.onSubmitRemovePeople}
              >
                Xóa {countSelectedRowKeys > 0 ? countSelectedRowKeys : ''} thành viên
              </Button>
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
              rowKey={record => (record.ID)}
              pagination={usersPagination}
              onChange={this.awardTable.handleUsersTableChange}
            />
          </Spin>
        </div>
      </Modal>
    )
  }

}