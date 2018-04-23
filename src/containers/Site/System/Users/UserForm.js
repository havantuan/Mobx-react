import React from 'react';
import {Modal, Form, Input, Button, Upload, Icon} from 'antd';
import {inject, observer} from 'mobx-react';
import {Keys} from "../../../../stores";
import HubList from "../../Common/HubProvider/hubList";
import ObjectPath from 'object-path';
import apiUrl from "../../../../config/apiUrl";

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
@inject(Keys.user, Keys.app)
@observer
export default class UserForm extends React.Component {

  state = {
    loading: false
  };

  constructor(props) {
    super(props);
    this.user = props.user;
  }

  handleCancel = () => {
    this.props.form.resetFields();
    this.user.closeModal();
  };

  handleChange = (info) => {
    if (info.file.status === 'uploading') {
      this.setState({loading: true});
      return;
    }
    if (info.file.status === 'done') {
      console.log('%c done...', 'background: #009900; color: #fff', info.file);
      let {response} = info.file;
      this.setState({
        loading: false
      }, () => {
        if (response && Array.isArray(response.files)) {
          let file = response.files[0];
          this.user.onAvatarChange(file.ID, file.url);
        }
      });
    }
    if (info.file.status === 'error') {
      console.log('%c error...', 'background: #009900; color: #fff',);
      this.setState({loading: false});
    }
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let {HubID} = values;
        let credentials = {
          ...values,
          HubID: HubID ? +HubID : null,
          PortraitID: this.user.avatar ? this.user.avatar.id : null
        };
        console.log('Received values of form: ', credentials);
        if (this.user.isUpdateMode) {
          this.user.update(this.user.isFetchingRowID, credentials).then(() => {
            this.handleCancel();
          });
        }
        else {
          this.user.create(credentials).then(() => {
            this.handleCancel();
            this.props.form.resetFields();
          });
        }
      }
    });
  };
  closeModal = () => {
    this.user.closeModal();
    this.props.form.resetFields();
  }
  render() {
    const {getFieldDecorator} = this.props.form;
    const {isUpdateMode, currentRow} = this.user;
    return (
      <Modal
        title={`${isUpdateMode ? 'Cập nhật' : 'Thêm mới'} người dùng`}
        visible={this.user.isShowUpdateModal}
        onOk={this.handleSubmit}
        onCancel={this.closeModal}
        footer={[
          <Button key="back" onClick={this.handleCancel}>Hủy</Button>,
          <Button key="submit" type="primary" loading={this.props.user.isCreating || this.props.user.isUpdating}
                  onClick={this.handleSubmit}>
            {`${isUpdateMode ? 'Cập nhật' : 'Thêm mới'}`}
          </Button>,
        ]}
      >
        <Form onSubmit={this.handleSubmit}>
          <FormItem
            {...formItemLayout}
            label={'Ảnh đại diện'}
          >
            <Upload
              name="avatar"
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
              action={apiUrl.UPLOAD_AVATAR_URL}
              onChange={(info) => this.handleChange(info)}
              headers={{
                Authorization: `Bearer ${this.props.app.token}`
              }}
            >
              {(this.user.avatar && this.user.avatar.url) ?
                <img src={this.user.avatar.url} alt="" style={{maxWidth: '100%'}}/>
                : (
                  <div>
                    <Icon type={this.state.loading ? 'loading' : 'plus'}/>
                    <div className="ant-upload-text">Upload</div>
                  </div>
                )}
            </Upload>
          </FormItem>

          <FormItem
            {...formItemLayout}
            label={'Tên người dùng'}
          >
            {getFieldDecorator('Name', {
              rules: [
                {required: true, message: 'Vui lòng nhập người dùng'}
              ],
              initialValue: isUpdateMode ? ObjectPath.get(currentRow, 'Name') : null
            })(
              <Input placeholder={'Nhập tên người dùng'} autoComplete={"new-name"}/>
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label={'Email'}
          >
            {getFieldDecorator('Email', {
              rules: [
                {required: true, message: 'Vui lòng nhập email'}
              ],
              initialValue: isUpdateMode ? ObjectPath.get(currentRow, 'Email') : null
            })(
              <Input placeholder={'Nhập Email'}/>
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label={'Mật khẩu'}
          >
            {getFieldDecorator('Password', {
              rules: [
                {required: !isUpdateMode, message: 'Vui lòng nhập mật khẩu'}
              ]
            })(
              <Input placeholder={isUpdateMode ? 'Bỏ trống nếu không muốn cập nhật' : 'Nhập mật khẩu'} type="password"
                     autoComplete={"new-password"}/>
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label={'Số điện thoại'}
          >
            {getFieldDecorator('Phone', {
              rules: [
                {required: true, message: 'Vui lòng nhập số điện thoại'}
              ],
              initialValue: isUpdateMode ? ObjectPath.get(currentRow, 'Phone') : null
            })(
              <Input placeholder={'Nhập số điện thoại'}/>
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label={'Liên đoàn'}
          >
            {getFieldDecorator('HubID', {
              initialValue: isUpdateMode ? `${ObjectPath.get(currentRow, 'Hub.ID')}` : null
            })(
              <HubList
                isActive
                mode={'default'}
              />
            )}
          </FormItem>
        </Form>
      </Modal>
    )
  }

}