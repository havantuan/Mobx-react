import React from 'react';
import {Modal, Form, Input, Button, InputNumber, Col, Row} from 'antd';
import {inject, observer} from 'mobx-react';
import {Keys} from "../../../../stores";
import ObjectPath from 'object-path';
import EnumState from "../../Common/EnumProvider/state";
import EnumGroupAccessibilities from "../../Common/EnumProvider/groupAccessibilities";
import UploadImage from "../../Common/Upload/UploadImage";
import apiUrl from "../../../../config/apiUrl";
import GroupProvider from "../../Common/GroupProvider";
import EnumGroupTypes from "../../Common/EnumProvider/groupTypes";
import basicStyle from "../../../../config/basicStyle";

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

@Form.create()
@inject(Keys.group)
@observer
export default class GroupForm extends React.Component {

  constructor(props) {
    super(props);
    this.group = props.group;
  }

  handleCancel = () => {
    this.props.form.resetFields();
    this.group.cancelModal();
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      console.log('Received values of form: ', values);
      if (!err) {
        let {Code, State, GroupAccessibility, ParentID, Order, GroupType} = values;
        let credentials = {
          ...values,
          State: State ? +State : null,
          Code,
          GroupAccessibility: GroupAccessibility ? +GroupAccessibility : null,
          ParentID: ParentID ? +ParentID : null,
          Order: Order ? +Order : null,
          GroupType: GroupType ? +GroupType : null
        };
        if (this.group.isUpdateMode) {
          this.group.update(this.group.isFetchingRowID, credentials).then(() => {
            this.handleCancel();
          });
        }
        else {
          this.group.create(credentials).then(() => {
            this.handleCancel();
          });
        }
      }
    });
  };

  render() {
    const {getFieldDecorator} = this.props.form;
    const {isUpdateMode, currentRow, isFetchingRowID} = this.group;
    const {gutter, rowStyle} = basicStyle;
    return (
      <Modal
        title={`${isUpdateMode ? 'Cập nhật nhóm ' + (isFetchingRowID ? isFetchingRowID : '') : 'Thêm nhóm mới'}`}
        visible={this.group.isShowModal}
        onOk={this.handleSubmit}
        onCancel={this.handleCancel}
        width='1000px'
        footer={[
          <Button key="back" onClick={this.handleCancel}>Hủy</Button>,
          <Button key="submit" type="primary" loading={this.group.isCreating || this.group.isUpdating}
                  onClick={this.handleSubmit}>
            {`${isUpdateMode ? 'Cập nhật' : 'Thêm mới'}`}
          </Button>,
        ]}
      >
        <Form onSubmit={this.handleSubmit}>
          <Row style={rowStyle} gutter={gutter} justify="start">
            <Col md={12} sm={12} xs={12}>
              <FormItem
                {...formItemLayout}
                label={'Icon nhóm'}
              >
                {getFieldDecorator('IconID', {
                  initialValue: isUpdateMode ? ObjectPath.get(currentRow, 'Icon.ID') : null
                })(
                  <UploadImage
                    action={apiUrl.UPLOAD_IMAGE_URL}
                    imageUrl={isUpdateMode ? this.group.iconUrl : null}
                    onValueChange={this.group.onImageUrlChange}
                  />
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label={'Mô tả'}
              >
                {getFieldDecorator('Description', {
                  initialValue: isUpdateMode ? ObjectPath.get(currentRow, 'Description') : null
                })(
                  <Input placeholder={'Nhập mô tả'}/>
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label={'Phân quyền'}
              >
                {getFieldDecorator('GroupAccessibility', {
                  rules: [
                    {required: true, message: 'Vui lòng chọn phân quyền'}
                  ],
                  initialValue: isUpdateMode ? ObjectPath.get(currentRow, 'GroupAccessibility.Value') : '3'
                })(
                  <EnumGroupAccessibilities placeholder={'Khả năng truy cập'} clear={false}/>
                )}
              </FormItem>


              <FormItem
                {...formItemLayout}
                label={'Kiểu'}
              >
                {getFieldDecorator('GroupType', {
                  rules: [
                    {required: true, message: 'Vui lòng chọn kiểu nhóm nhóm'}
                  ],
                  initialValue: isUpdateMode ? `${ObjectPath.get(currentRow, 'GroupType.Value')}` : `${this.props.group.groupType}`
                })(
                  <EnumGroupTypes disabled={!!(this.props.group.groupType)} clear={false}/>
                )}
              </FormItem>
            </Col>
            <Col md={12} sm={12} xs={12}>
              <FormItem
                {...formItemLayout}
                label={'Mã nhóm'}
              >
                {getFieldDecorator('Code', {
                  rules: [
                    {required: true, message: 'Vui lòng nhập tên nhóm'}
                  ],
                  initialValue: isUpdateMode ? ObjectPath.get(currentRow, 'Code') : null
                })(
                  <Input placeholder={'Nhập mã nhóm'}/>
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label={'Tên nhóm'}
              >
                {getFieldDecorator('Title', {
                  rules: [
                    {required: true, message: 'Vui lòng nhập tên nhóm'}
                  ],
                  initialValue: isUpdateMode ? ObjectPath.get(currentRow, 'Title') : null
                })(
                  <Input placeholder={'Nhập tên nhóm'}/>
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label={'Số thứ tự'}
              >
                {getFieldDecorator('Order', {
                  initialValue: isUpdateMode ? ObjectPath.get(currentRow, 'Order') : null
                })(
                  <InputNumber placeholder={'Nhập số thứ tự'} min={0} style={{width: '100%'}}/>
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label={'Nhóm cha'}
              >
                {getFieldDecorator('ParentID', {
                  initialValue: isUpdateMode ? ObjectPath.get(currentRow, 'Parent.ID') && `${currentRow.Parent.ID}` : null
                })(
                  <GroupProvider GroupType={this.props.group.groupTypeCode}/>
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label={'Trạng thái'}
              >
                {getFieldDecorator('State', {
                  initialValue: isUpdateMode ? ObjectPath.get(currentRow, 'State.Value') : '1'
                })(
                  <EnumState placeholder={'Chọn trạng thái'}/>
                )}
              </FormItem>
            </Col>
          </Row>

        </Form>
      </Modal>
    )
  }

}