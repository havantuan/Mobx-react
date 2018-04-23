import React, {Component} from 'react';
import ObjectPath from "object-path";
import {Button, Col, Form, Input, Modal, Row, Spin, Switch} from 'antd';
import basicStyle from '../../../../config/basicStyle';
import AccesbiType from "../../Common/EnumProvider/accessibiType";
import HubType from "../../Common/EnumProvider/hubType";
import {inject, observer} from "mobx-react";
import {Keys} from '../../../../stores/index';

const FormItem = Form.Item;
const {TextArea} = Input;
@Form.create()
@inject(Keys.hubTable)
@observer
export default class HubForm extends Component {

  constructor(props) {
    super(props);
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        let {

          Code,
          Name,
          Accessibility,

          Phone,
          Type,
        } = values;

        let credentials = {

          Code,
          Name,
          Phone,
          Type: +Type,
          Accessibility: +Accessibility,
        };

        this.props.hubTable.onSubmitFormModal(credentials).then(() => {
          this.props.form.resetFields();
        });
      }
    });
  };
  onChangeNumber = (e) => {

  }

  render() {
    let {currentRow, isUpdateMode} = this.props.hubTable;
    const {gutter, rowStyle} = basicStyle;
    const {getFieldDecorator} = this.props.form;
    let loading = this.props.hubTable.isUpdating || this.props.hubTable.isCreating;
    let fetching = this.props.hubTable.isFetchingCurrentRow;
    let dataSource = currentRow;
    let fillEditData = isUpdateMode;

    return (
      <Modal
        title={`${isUpdateMode ? 'Cập nhật liên đoàn' : 'Tạo mới liên đoàn'}`}
        visible={this.props.hubTable.isShowModal}
        onOk={this.handleSubmit}
        width='70%'
        onCancel={this.props.hubTable.onCancelModal}
        footer={[
          <Button key="cancel" onClick={this.props.hubTable.onCancelModal}>
            Hủy
          </Button>,
          <Button key="submit" type="primary" loading={loading} onClick={this.handleSubmit}>
            {isUpdateMode ? 'Cập nhật' : 'Tạo'}
          </Button>
        ]}
      >
        {fetching ? <Spin spinning/> :

          <Form onSubmit={this.handleSubmit}>
            <Row style={rowStyle} gutter={gutter} justify="start">
              <Col md={12} sm={12} xs={12}>
                <FormItem>
                  {getFieldDecorator('Code', {
                    rules: [
                      {required: true, message: 'Vui lòng nhập mã liên đoàn'}
                    ],
                    initialValue: fillEditData ? ObjectPath.get(dataSource, "Code") : null
                  })(
                    <Input
                      placeholder="Mã liên đoàn"
                      size="default"
                    />
                  )}
                </FormItem>

                <FormItem>
                  {getFieldDecorator('Name', {
                    rules: [
                      {required: true, message: 'Vui lòng nhập tên liên đoàn'}
                    ],
                    initialValue: fillEditData ? ObjectPath.get(dataSource, "Name") : null
                  })(
                    <Input
                      placeholder="Tên liên đoàn"
                      size="default"
                    />
                  )}
                </FormItem>

                <FormItem>
                  {getFieldDecorator('Type', {
                    rules: [
                      {required: true, message: 'Vui lòng chọn loại liên đoàn'}
                    ],
                    initialValue: fillEditData ? ObjectPath.get(dataSource, "Type.Value") : null
                  })(
                    <HubType placeholder={"Loại liên đoàn"}/>
                  )}
                </FormItem>

              </Col>

              <Col md={12} sm={12} xs={12}>
                <FormItem>
                  {getFieldDecorator('Phone', {
                    initialValue: fillEditData ? ObjectPath.get(dataSource, "Phone") : null
                  })(
                    <Input placeholder="Số điện thoại"/>
                  )}
                </FormItem>
                <FormItem>
                  {getFieldDecorator('Accessibility', {
                    initialValue: fillEditData ? ObjectPath.get(dataSource.Accessibility, "Value") : 0,
                  })(
                    <AccesbiType placeholder="Public/Bí mật"/>
                  )}
                </FormItem>
                <FormItem>
                  {getFieldDecorator('State', {
                    initialValue: fillEditData ? dataSource.State && ObjectPath.get(dataSource.State, "Value") === 1 : true,
                    valuePropName: 'checked'
                  })(
                    <Switch checkedChildren="Hoạt động" unCheckedChildren="Ngừng hoạt động"/>
                  )}
                </FormItem>
              </Col>
            </Row>

          </Form>
        }
      </Modal>
    )
  }

}
