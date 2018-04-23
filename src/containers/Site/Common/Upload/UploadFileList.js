import React from 'react';
import {Upload, Button, Modal, Icon, Input, Form} from 'antd';
import {inject, observer} from 'mobx-react';
import {Keys} from "../../../../stores";
import {isObservableArray} from 'mobx';

const formItemLayout = {
  labelCol: {
    xs: {span: 24},
    sm: {span: 5},
  },
  wrapperCol: {
    xs: {span: 24},
    sm: {span: 19},
  },
};

@Form.create()
@inject(Keys.app, Keys.document)
@observer
export default class UploadFileList extends React.Component {

  state = {
    modalVisible: false,
    currentFile: null,
    currentFileID: null
  };

  handleChange = (info) => {
    let fileList = info.fileList;
    let fileIDs = [];
    // 2. read from response and show file link
    fileList = fileList.map((file) => {
      if (file && file.response && (Array.isArray(file.response.files) || isObservableArray(file.response.files))) {
        // Component will show file.url as link
        file.url = file.response.files[0].url;
        file.response.files.forEach(val => val.ID && fileIDs.push(val.ID));
      }
      return file;
    });

    console.log('%c fileIDs...', 'background: #009900; color: #fff', fileIDs);
    const onChange = this.props.onChange;
    const onValueChange = this.props.onValueChange;
    if (onChange) {
      onChange(fileIDs);
    }
    if (onValueChange) {
      onValueChange(fileList)
    }
  };

  onPreview = (file) => {
    console.log('%c onPreview...', 'background: #009900; color: #fff', file);
    if (this.props.showEditModal) {
      let fileID = null;
      if (file && file.response && (Array.isArray(file.response.files) || isObservableArray(file.response.files))) {
        let tmp = file.response.files[0];
        fileID = tmp ? tmp.ID : null;
      }
      this.setState({
        modalVisible: true,
        currentFile: file,
        currentFileID: fileID
      }, () => {
        let fileName = file ? file.name : null;
        this.props.form.setFieldsValue({Title: fileName});
      });
    }
    else {
      window.open(file.url);
    }
  };

  handleModalCancel = () => {
    this.props.form.resetFields();
    this.setState({modalVisible: false});
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      console.log('Received values of form: ', values);
      if (!err) {
        if (this.props.onSubmitEditModal) {
          this.props.document(this.state.currentFileID, values).then(() => {
            this.setState({modalVisible: false});
            if (this.props.onEditSuccess) {
              this.props.onEditSuccess();
            }
          });
        }
      }
    });
  };

  render() {
    const {getFieldDecorator} = this.props.form;
    let {placeholder, action, listType, fileList} = this.props;
    return (
      <div>
        <Upload
          action={action}
          listType={listType || 'text'}
          fileList={[...fileList]}
          headers={{
            "Authorization": `Bearer ${this.props.app.token}`
          }}
          onChange={this.handleChange}
          onPreview={this.onPreview}
        >
          <Button>
            <Icon type={'upload'}/> {placeholder || 'Upload'}
          </Button>
        </Upload>

        <Modal
          title={'Hành động'}
          visible={this.state.modalVisible}
          wrapClassName={'vertical-center-modal'}
          onOk={this.handleModalCancel}
          onCancel={this.handleModalCancel}
          footer={[
            <Button key="back" onClick={this.handleModalCancel}>Hủy</Button>,
            <Button key="submit" type={'primary'} loading={this.props.document.isUpdating} onClick={this.handleSubmit}>
              Cập nhật
            </Button>,
          ]}
        >
          {
            this.state.currentFile &&
            <div>
              <Form.Item
                {...formItemLayout}
                label={'Tên tệp'}
              >
                {getFieldDecorator('Title', {
                  rules: [
                    {required: true, message: 'Vui lòng nhập tên tệp'}
                  ]
                })(
                  <Input placeholder={'Tên tệp'}/>
                )}
              </Form.Item>

              <Form.Item
                {...formItemLayout}
                label={'Đường dẫn'}
              >
                <a href={this.state.currentFile.url} target={'_blank'}>
                  {this.state.currentFile.url}
                </a>
              </Form.Item>
            </div>
          }
        </Modal>
      </div>
    )
  }

}