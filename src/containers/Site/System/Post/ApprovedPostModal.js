import React, {Component} from 'react';
import {Button, Form, Modal} from 'antd';
import {inject, observer} from "mobx-react";
import {Keys} from '../../../../stores/index';
import Editor from "../../../../components/Editor";
import EnumApproveType from "../../Common/EnumProvider/approveType";

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
const FormItem = Form.Item;

@Form.create()
@inject(Keys.postTable)
@observer
export default class ApprovedPostModal extends Component {

  handleCancel = () => {
    this.props.form.resetFields();
    this.props.postTable.onCancelModal();
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      console.log('Received values of form: ', values);
      if (!err) {
        let {ApproveType} = values;
        let credentials = {
          ApproveType: ApproveType ? +ApproveType : null,
          PostIDs: this.props.postTable.selectedRowKeys
        };
        console.log('%c credentials...', 'background: #009900; color: #fff', credentials)
        this.props.postTable.editApproveType(credentials).then(() => {
          this.handleCancel();
        });
      }
    });
  };

  render() {
    const {isUpdating, countSelectedRowKeys} = this.props.postTable;
    const {getFieldDecorator} = this.props.form;

    return (
      <Modal
        title={`Phê duyệt ${countSelectedRowKeys > 0 ? countSelectedRowKeys : ''} bài viết`}
        visible={this.props.postTable.isShowApprovedModal}
        onOk={this.handleSubmit}
        onCancel={this.handleCancel}
        footer={[
          <Button key="cancel" onClick={this.handleCancel}>Hủy</Button>,
          <Button key="submit" type="primary" loading={isUpdating} onClick={this.handleSubmit}>
            Cập nhật trạng thái
          </Button>
        ]}
      >
        <Form onSubmit={this.handleSubmit}>
          <FormItem
            {...formItemLayout}
            label={'Trạng thái phê duyệt'}
          >
            {getFieldDecorator('ApproveType', {
              rules: [
                {required: true, message: 'Vui lòng chọn trạng thái phê duyệt'}
              ]
            })(
              <EnumApproveType/>
            )}
          </FormItem>
        </Form>
      </Modal>
    )
  }

}
