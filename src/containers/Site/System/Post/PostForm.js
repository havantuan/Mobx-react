import React, {Component} from 'react';
import {Button, Col, Form, Input, Modal, Row, Spin, Select} from 'antd';
import PostTypes from "../../Common/EnumProvider/PostTypes";
import {inject, observer} from "mobx-react";
import {Keys} from '../../../../stores/index';
import ObjectPath from "object-path";
import Editor from "../../../../components/Editor";
import basicStyle from "../../../../config/basicStyle";
import UploadFileList from "../../Common/Upload/UploadFileList";
import apiUrl from "../../../../config/apiUrl";
import GroupProvider from "../../Common/GroupProvider";
import {replaceHtmlTag} from "../../../../helpers/utility";
const {Option} = Select;
const {TextArea} = Input;
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
const FormItem = Form.Item;

@Form.create()
@inject(Keys.postTable, Keys.document)
@observer
export default class PostForm extends Component {
    handleCancel = () => {
    this.props.form.resetFields();
    this.props.postTable.onCancelModal();
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      console.log('Received values of form: ', values);
      if (!err) {
        let {GroupID, ContentFormat, Content, PureContent} = values;
        let credentials = {
          ...values,
          GroupID: GroupID ? +GroupID : null,
          ContentFormat: +ContentFormat,
          Content: +ContentFormat === 0 ? replaceHtmlTag(PureContent) : Content,
        };
        this.props.postTable.onSubmitFormModal(credentials).then(() => {
          this.handleCancel();
        });
      }
    });
  };
  render() {
    let {currentRow, isUpdateMode, isFetchingRowID} = this.props.postTable;
    const {getFieldDecorator} = this.props.form;
    let loading = this.props.postTable.isUpdating || this.props.postTable.isCreating;
    let fetching = this.props.postTable.isFetchingCurrentRow;
    return (
      <Modal
        title={`${isUpdateMode ? 'Cập nhật bài viết ' + (isFetchingRowID ? isFetchingRowID : '') : 'Thêm bài viết mới'}`}
        visible={this.props.postTable.isShowModal}
        onOk={this.handleSubmit}
        width={'1000px'}
        onCancel={this.handleCancel}
        footer={[
          <Button key="cancel" onClick={this.handleCancel}>
            Hủy
          </Button>,
          <Button key="submit" type="primary" loading={loading} onClick={this.handleSubmit}>
            {isUpdateMode ? 'Cập nhật' : 'Tạo'}
          </Button>
        ]}
      >
        {fetching ? <Spin spinning/> :
          <Form onSubmit={this.handleSubmit}>
            {this.props.postTable.groupType !== `Discussion` &&
            <FormItem
              {...tailFormItemLayout}
              label="Tiêu đề"
            >
              {getFieldDecorator('Title', {
                rules: [
                  {required: false, message: 'Vui lòng nhập tiêu đề'}
                ],
                initialValue: isUpdateMode ? currentRow && currentRow.Title : null
              })(
                <Input
                  size="default"
                  placeholder="Nhập tiêu đề"
                />
              )}
            </FormItem>
            }
            <FormItem
              {...tailFormItemLayout}
              label="Nhóm"
            >
              {getFieldDecorator('GroupID', {
                rules: [
                  {required: true, message: 'Vui lòng chọn nhóm'}
                ],
                initialValue: isUpdateMode ? currentRow && ObjectPath.get(currentRow, "Group.ID") && `${currentRow.Group.ID}` : null
              })(
                <GroupProvider GroupType={this.props.postTable.groupType}/>
              )}
            </FormItem>

            <Row gutter={basicStyle.gutter}>
              <Col span={12}>
                <FormItem
                  {...formItemLayout}
                  label={'Upload ảnh'}
                >
                  {getFieldDecorator('ImagesIDs', {
                    initialValue: isUpdateMode ? this.props.postTable.getImageIDs(currentRow) : null
                  })(
                    <UploadFileList
                      listType={'picture'}
                      action={apiUrl.UPLOAD_IMAGE_URL}
                      placeholder={'Tải ảnh lên'}
                      fileList={this.props.postTable.imageFileListToJS}
                      onValueChange={this.props.postTable.onImagesChange}
                    />
                  )}
                </FormItem>
              </Col>

              <Col span={12}>
                <FormItem
                  {...formItemLayout}
                  label={'Upload tệp'}
                >
                  {getFieldDecorator('DocumentsIDs', {
                    initialValue: isUpdateMode ? this.props.postTable.getDocumentIDs(currentRow) : null
                  })(
                    <UploadFileList
                      showEditModal
                      action={apiUrl.UPLOAD_DOCUMENT_URL}
                      placeholder={'Tải tệp lên'}
                      fileList={this.props.postTable.documentFileListToJS}
                      onValueChange={this.props.postTable.onDocumentsChange}
                      onEditSuccess={this.props.postTable.reload}
                    />
                  )}
                </FormItem>
              </Col>
            </Row>

            <FormItem
              {...tailFormItemLayout}
              label={'Định dạng văn bản'}
            >
              {getFieldDecorator('ContentFormat', {
                initialValue: isUpdateMode ? currentRow && `${currentRow.ContentFormat}` : `1`
              })(
                <Select
                  onChange={this.props.postTable.handleChangeFormat}
                >
                  <Option value='0'>Văn bản</Option>
                  <Option value='1'>Html</Option>
                </Select>
              )}
            </FormItem>
            {this.props.postTable.formatContent === `1` ?
              <FormItem
                {...tailFormItemLayout}
                label={'Nội dung'}
              >
                {getFieldDecorator('Content', {
                  initialValue: isUpdateMode ? currentRow && currentRow.Content : null
                })(
                  <Editor placeholder={'Nhập nội dung bài viết'}/>
                )}
              </FormItem> :
              <FormItem
                {...tailFormItemLayout}
                label={'Nội dung'}
              >
                {getFieldDecorator('PureContent', {
                  initialValue: isUpdateMode ? currentRow && replaceHtmlTag(currentRow.Content) : null
                })(
                  <TextArea
                    rows={4}
                    placeholder={'Nhập nội dung bài viết'}/>
                )}
              </FormItem>
            }

          </Form>
        }
      </Modal>
    )
  }

}
