import React from 'react';
import {Upload, Icon} from 'antd';
import {inject, observer} from 'mobx-react';
import {Keys} from "../../../../stores";
import {isObservableArray} from 'mobx';

@inject(Keys.app)
@observer
export default class UploadImage extends React.Component {

  state = {
    loading: false
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
        if (response && (Array.isArray(response.files) || isObservableArray(response.files))) {
          let file = response.files[0];
          const onChange = this.props.onChange;
          if (onChange) {
            onChange(file.ID);
          }
        }
        const onValueChange = this.props.onValueChange;
        if (onValueChange) {
          onValueChange(info.file)
        }
      });
    }
    if (info.file.status === 'error') {
      console.log('%c error...', 'background: #009900; color: #fff',);
      this.setState({loading: false});
    }
  };

  render() {
    let {placeholder, action, imageUrl} = this.props;
    return (
      <Upload
        name="avatar"
        listType="picture-card"
        className="avatar-uploader"
        showUploadList={false}
        action={action}
        onChange={(info) => this.handleChange(info)}
        headers={{
          Authorization: `Bearer ${this.props.app.token}`
        }}
      >
        {imageUrl ?
          <img src={imageUrl} alt="" style={{maxWidth: '100%'}}/>
          : (
            <div>
              <Icon type={this.state.loading ? 'loading' : 'plus'}/>
              <div className="ant-upload-text">{placeholder || 'Upload'}</div>
            </div>
          )}
      </Upload>
    )
  }

}