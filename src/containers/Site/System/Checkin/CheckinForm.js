import React, {Component} from 'react';
import {Button, Col, Form, Input, Modal, Row, Spin, DatePicker, Switch} from 'antd';
import basicStyle from '../../../../config/basicStyle';
import {inject, observer} from "mobx-react";
import {Keys} from '../../../../stores/index';
import ObjectPath from "object-path";
import moment from 'moment';
const formItemLayout = {
  labelCol: {
    xs: {span: 24},
    sm: {span: 4},
  },
  wrapperCol: {
    xs: {span: 24},
    sm: {span: 20},
  },
};
const TextArea = Input;
const FormItem = Form.Item;
@Form.create()
@inject(Keys.checkinTable)
@observer
export default class CheckinForm extends Component {

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        let {

          Title,
          Date,
          State
        } = values;

        let credentials = {
          Title,
          Date,
          State: State === true ? 1 : 0
        };

        this.props.checkinTable.onSubmitFormModal(credentials).then(() => {
          this.props.form.resetFields();
        });
      }
    });
  };

  render() {
    let {currentRow, isUpdateMode} = this.props.checkinTable;
    const {gutter, rowStyle} = basicStyle;
    const {getFieldDecorator} = this.props.form;
    let loading = this.props.checkinTable.isUpdating || this.props.checkinTable.isCreating;
    let fetching = this.props.checkinTable.isFetchingCurrentRow;
    let dataSource = currentRow;
    let fillEditData = isUpdateMode;

    return (
      <Modal
        title={`${isUpdateMode ? 'Cập nhật điểm danh' : 'Tạo mới điểm danh'}`}
        visible={this.props.checkinTable.isShowModal}
        onOk={this.handleSubmit}
        width='70%'
        onCancel={this.props.checkinTable.onCancelModal}
        footer={[
          <Button key="cancel" onClick={this.props.checkinTable.onCancelModal}>
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
              <Col span={24}>
                <FormItem
                  {...formItemLayout}
                  label="Tiêu đề"
                >
                  {getFieldDecorator('Title', {
                    rules: [
                      {required: true, message: 'Vui lòng nhập tiêu đề'}
                    ],
                    initialValue: isUpdateMode ? dataSource.Title : ''
                  })(
                    <Input placeholder="Nhập tiêu đề điểm danh"/>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row style={rowStyle} gutter={gutter} justify="start">
              <Col span={24}>
                <FormItem
                  {...formItemLayout}
                  label="Thời gian"
                >
                  {getFieldDecorator('Date', {
                    rules: [
                      {required: true, message: 'Vui lòng nhập thời gian'}
                    ],
                    initialValue: isUpdateMode ?
                      moment(`${ObjectPath.get(dataSource, 'Date.ISO', moment().format())}`, 'YYYY-MM-DD HH:mm') : null
                  })(
                    <DatePicker
                      showTime
                      format="YYYY-MM-DD HH:mm:ss"
                      placeholder="Chọn thời gian"
                      style={{width: '100%'}}
                    />
                  )}
                </FormItem>

              </Col>
            </Row>
            <Row style={rowStyle} gutter={gutter} justify="start">
              <Col span={24}>
                <FormItem
                  {...formItemLayout}
                  label='Trạng thái'
                >
                  {getFieldDecorator('State', {
                    initialValue: isUpdateMode ? dataSource.State && ObjectPath.get(dataSource.State, "Value") === 1 : true,
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
