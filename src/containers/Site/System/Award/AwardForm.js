import React, {Component} from 'react';
import ObjectPath from "object-path";
import {Button, Col, Form, Input, Modal, Row, Spin} from 'antd';
import basicStyle from '../../../../config/basicStyle';
import {inject, observer} from "mobx-react";
import {Keys} from '../../../../stores/index';
import GroupAwardProvider from "../../Common/GroupAwardProvider/index";

const FormItem = Form.Item;
const {TextArea} = Input;
@Form.create()
@inject(Keys.awardTable)
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
          AwardGroupID
        } = values;

        let credentials = {
          Description,
          Title,
          AwardGroupID: +AwardGroupID
        };

        this.props.awardTable.onSubmitFormModal(credentials).then(() => {
          this.props.form.resetFields();
        });
      }
    });
  };

  render() {
    let {currentRow, isUpdateMode} = this.props.awardTable;
    const {gutter, rowStyle} = basicStyle;
    const {getFieldDecorator} = this.props.form;
    let loading = this.props.awardTable.isUpdating || this.props.awardTable.isCreating;
    let fetching = this.props.awardTable.isFetchingCurrentRow;
    let dataSource = currentRow;
    let fillEditData = isUpdateMode;

    return (
      <Modal
        title={`${isUpdateMode ? 'Cập nhật giải thưởng' : 'Tạo mới giải thưởng'}`}
        visible={this.props.awardTable.isShowModal}
        onOk={this.handleSubmit}
        width='70%'
        onCancel={this.props.awardTable.onCancelModal}
        footer={[
          <Button key="cancel" onClick={this.props.awardTable.onCancelModal}>
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
                      {required: true, message: 'Vui lòng nhập tên giải thưởng'}
                    ],
                    initialValue: fillEditData ? ObjectPath.get(dataSource, "Title") : null
                  })(
                    <Input
                      placeholder="Tên giải thưởng"
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
              <Col md={24} sm={24} xs={24}>
                <FormItem>
                  {getFieldDecorator('AwardGroupID', {
                    rules: [
                      {required: true, message: 'Nhóm giải thưởng'}
                    ],
                    initialValue: fillEditData ? `${ObjectPath.get(dataSource, "AwardGroup.ID")}` : null
                  })(
                    <GroupAwardProvider/>
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
