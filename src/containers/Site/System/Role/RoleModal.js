import React from 'react';
import {Button, Col, Form, Input, Modal, Row} from 'antd';
import basicStyle from '../../../../config/basicStyle';
import {inject, observer} from "mobx-react";
import {Keys} from '../../../../stores/index';
import RoleTypes from '../../Common/EnumProvider/roleTypes';
import ObjectPath from "object-path";

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
@inject(Keys.role)
@observer
export default class RoleModal extends React.Component {

  handleCancel = () => {
    this.props.role.onCloseModal();
    this.props.form.resetFields();
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {

      if (!err) {
        let {
          Name,
          Type,
          Code,
        } = values;
        let credentials = {
          Code,
          Name,
          Type: +Type,
        };
        this.props.role.onSubmitFormModal(credentials).then(() => {
          this.handleCancel();
        });
      }
    });
  };

  render() {
    const {rowStyle, gutter} = basicStyle;
    const {getFieldDecorator} = this.props.form;
    const {loading} = this.props.role.isCreating;
    const {UpdateMode, currentRow} = this.props.role;
    return (
      <Modal
        title={`${UpdateMode ? 'Cập nhật vai trò' : 'Tạo mới vai trò'}`}
        visible={this.props.role.ShowModal}
        onOk={this.handleSubmit}
        onCancel={this.props.role.onCloseModal}
        footer={[
          <Button key="cancel" onClick={this.handleCancel}>
            Hủy
          </Button>,
          <Button key="submit" type="primary" loading={loading} onClick={this.handleSubmit}>
            Tạo
          </Button>
        ]}
      >
        <Form onSubmit={this.handleSubmit}>
          <Row style={rowStyle} gutter={gutter} justify="start">
            <Col span={24}>
              <FormItem
                {...formItemLayout}
                label="Mã"
              >
                {getFieldDecorator('Code', {
                  rules: [
                    {required: true, message: 'Vui lòng nhập mã vai trò'}
                  ],
                  initialValue: UpdateMode ? ObjectPath.get(currentRow, "Code") : null
                })(
                  <Input
                    size="default"
                    disabled={UpdateMode}
                  />
                )}
              </FormItem>

              <FormItem
                {...formItemLayout}
                label="Tên vai trò"
              >
                {getFieldDecorator('Name', {
                  rules: [
                    {required: true, message: 'Vui lòng nhập tên vai trò'}

                  ],
                  initialValue: UpdateMode ? ObjectPath.get(currentRow, "Name") : null
                })(
                  <Input
                    size="default"
                  />
                )}
              </FormItem>
            </Col>
          </Row>

          <Row style={rowStyle} gutter={gutter} justify="start">
            <Col span={24}>
              <FormItem
                {...formItemLayout}
                label="Kiểu vai trò"
              >
                {getFieldDecorator('Type', {
                  rules: [
                    {required: true, message: 'Loại vai trò'}
                  ],
                  initialValue: UpdateMode ? ObjectPath.get(currentRow, "Type.Value") : '2'
                })(
                  <RoleTypes/>
                )}
              </FormItem>
            </Col>
          </Row>

        </Form>
      </Modal>
    )
  }

}