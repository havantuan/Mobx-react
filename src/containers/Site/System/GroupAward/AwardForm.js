import React, {Component} from 'react';
import ObjectPath from "object-path";
import {Button, Col, Form, Input, Modal, Row, Spin} from 'antd';
import basicStyle from '../../../../config/basicStyle';
import {inject, observer} from "mobx-react";
import {Keys} from '../../../../stores/index';

const FormItem = Form.Item;
const {TextArea} = Input;
@Form.create()
@inject(Keys.groupAwardTable)
@observer
export default class GroupAwardForm extends Component {

  constructor(props) {
    super(props);
    this.state = {
      location: {}
    };
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        let {
          Description,
          Title,
        } = values;

        let credentials = {
          Description,
          Title,
        };

        this.props.groupAwardTable.onSubmitFormModal(credentials).then(() => {
          this.props.form.resetFields();
        });
      }
    });
  };

  render() {
    let {currentRow, isUpdateMode} = this.props.groupAwardTable;
    const {gutter, rowStyle} = basicStyle;
    const {getFieldDecorator} = this.props.form;
    let loading = this.props.groupAwardTable.isUpdating || this.props.groupAwardTable.isCreating;
    let fetching = this.props.groupAwardTable.isFetchingCurrentRow;
    let dataSource = currentRow;
    let fillEditData = isUpdateMode;

    return (
      <Modal
        title={`${isUpdateMode ? 'Cập nhật nhóm giải thưởng' : 'Tạo mới nhóm giải thưởng'}`}
        visible={this.props.groupAwardTable.isShowModal}
        onOk={this.handleSubmit}
        width='70%'
        onCancel={this.props.groupAwardTable.onCancelModal}
        footer={[
          <Button key="cancel" onClick={this.props.groupAwardTable.onCancelModal}>
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
              <Col md={24} sm={24} xs={24}>
                <FormItem>
                  {getFieldDecorator('Title', {
                    rules: [
                      {required: true, message: 'Vui lòng nhập tên nhóm giải thưởng'}
                    ],
                    initialValue: fillEditData ? ObjectPath.get(dataSource, "Title") : null
                  })(
                    <Input
                      placeholder="Tên nhóm giải thưởng"
                      size="default"
                    />
                  )}
                </FormItem>
              </Col>

              <Col md={24} sm={24} xs={24}>
                <FormItem>
                  {getFieldDecorator('Description', {
                    rules: [
                      {required: true, message: 'Vui lòng nhập mô tả'}
                    ],
                    initialValue: fillEditData ? ObjectPath.get(dataSource, "Description") : null
                  })(
                    <TextArea
                      rowSpan={4}
                      placeholder="Mô tả giải thưởng"
                      size="default"
                    />
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
