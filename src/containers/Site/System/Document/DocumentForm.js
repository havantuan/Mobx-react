import React from 'react';
import {Row, Col, Form, Input, Button, Select} from 'antd';
import basicStyle from '../../../../config/basicStyle';
import {inject, observer} from 'mobx-react';
import {Keys} from "../../../../stores";
import {withRouter} from "react-router-dom";
import PageHeaderLayout from "../../../../layouts/PageHeaderLayout";
import ContentHolder from "../../../../components/utility/ContentHolder";

const FormItem = Form.Item;
const Option = Select.Option;
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

@Form.create()
@withRouter
@inject(Keys.document)
@observer
export default class DocumentForm extends React.Component {

  constructor(props) {
    super(props);
    this.id = props.match.params.id;
    this.document = props.document;
    this.state = {
      tags: [],
      inputVisible: false,
      inputValue: '',
      load: true,
      imageUrl: '',
      videoUrl: '',
      musicUrl: '',
      documentUrl: '',
      youtube: '',
      spin: false
    };
  }

  setAttachment = (content, name, type) => {
    return {
      contents: {
        vi: content
      },
      name: name,
      type: type
    }
  };

  componentWillUnmount() {
    this.document.clear();
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let {storyText, youtubeID} = values;
        if (storyText === null) {
          // notification.error('Nội dung không được để trống');
          return
        }
        let titleText = this.setAttachment(values.titleText, "titleText", "text");
        let tags = [values.tags];
        let image = this.setAttachment(this.state.imageUrl, "image", "url");
        let video = this.state.videoUrl ? this.setAttachment(this.state.videoUrl, "video", "url") : null;
        let youtube = youtubeID ? this.setAttachment(youtubeID, "youtube", "text") : null;
        let music = this.state.musicUrl ? this.setAttachment(this.state.musicUrl, "music", "url") : null;
        let document = this.state.documentUrl ? this.setAttachment(this.state.documentUrl, "document", "url") : null;

        storyText = this.setAttachment(storyText, "storyText", "text");

        let attachments = [titleText, image, storyText];
        if (video) {
          attachments.push(video)
        }
        if (music) {
          attachments.push(music)
        }
        if (youtube) {
          attachments.push(youtube)
        }
        if (document) {
          attachments.push(document)
        }
        let credentials = {attachments, tags, visibility: +30, post_type: 'tg_document'};
        console.log('%c credentials...', 'background: #009900; color: #fff', credentials)
        // if (this.mode === formModeConfig.update) {
        //   this.props.updatePost(this.id, credentials, redirect);
        // }
        // else {
        //   this.props.createPost(credentials, redirect);
        // }
      }
    });
  };

  render() {
    const {rowStyle, gutter} = basicStyle;
    const {getFieldDecorator} = this.props.form;
    const {isUpdateMode} = this.document;
    const dataSource = {};
    const attachments = {};

    return (
      <PageHeaderLayout title={`${isUpdateMode ? 'Chỉnh sửa' : 'Tạo'} tài liệu`}>
        <ContentHolder>
          <Form onSubmit={this.handleSubmit}>
            <Row style={rowStyle} gutter={gutter} justify="start">
              <Col span={24}>
                <FormItem
                  {...formItemLayout}
                  label="Tiêu đề"
                >
                  {getFieldDecorator('titleText', {
                    rules: [
                      {required: true, message: 'Vui lòng nhập tiêu đề'}
                    ],
                    initialValue: isUpdateMode ? attachments && attachments.titleText : null
                  })(
                    <Input
                      size="default"
                    />
                  )}
                </FormItem>
              </Col>
            </Row>

            <Row style={rowStyle} gutter={gutter} justify="start">
              <Col span={8}>
                {/*<FormItem*/}
                {/*{...formImageLayout}*/}
                {/*label="Hình ảnh"*/}
                {/*>*/}
                {/*{getFieldDecorator('image', {*/}
                {/*rules: [*/}
                {/*{*/}
                {/*// required: !this.state.imageUrl,*/}
                {/*message: 'Vui lòng chọn hình ảnh hiển thị'*/}
                {/*}*/}
                {/*]*/}
                {/*})(*/}
                {/*<Image*/}
                {/*imageUrl={this.state.imageUrl}*/}
                {/*onchange={this.changeImage}*/}
                {/*type="?tp=post"*/}
                {/*onSpin={this.changeSpin}*/}
                {/*spin={this.state.spin}*/}
                {/*/>*/}
                {/*)}*/}
                {/*</FormItem>*/}
              </Col>

            </Row>
            <Row style={rowStyle} gutter={gutter} justify="start">
              <Col span={24}>
                {/*<FormItem*/}
                {/*{...formItemLayout}*/}
                {/*label="Music"*/}
                {/*>*/}
                {/*{getFieldDecorator('music', {*/}
                {/*rules: [*/}
                {/*{*/}
                {/*required: false,*/}
                {/*message: 'Vui lòng chọn hình ảnh hiển thị'*/}
                {/*}*/}
                {/*]*/}
                {/*})(*/}
                {/*<div>*/}
                {/*<Music imageUrl={this.state.musicUrl}*/}
                {/*onchange={this.changeMusic} type="?tp=post"/>*/}
                {/*</div>*/}
                {/*)}*/}
                {/*</FormItem>*/}
              </Col>
            </Row>

            <Row style={rowStyle} gutter={gutter} justify="start">
              <Col span={24}>
                <FormItem
                  {...formItemLayout}
                  label="Youtube ID"
                >
                  {getFieldDecorator('youtubeID', {
                    rules: [
                      {required: false, message: 'Vui lòng chọn hình ảnh hiển thị'}
                    ],
                    initialValue: isUpdateMode ? attachments && attachments.youtube : null
                  })(
                    <Input placeholder="ID video Youtube"/>
                  )}
                </FormItem>
              </Col>
            </Row>

            <Row style={rowStyle} gutter={gutter} justify="start">
              <Col span={24}>
                {/*<FormItem*/}
                  {/*{...formItemLayout}*/}
                  {/*label="Tài liệu"*/}
                {/*>*/}
                  {/*{getFieldDecorator('document', {*/}
                    {/*rules: [*/}
                      {/*{required: false, message: 'Vui lòng chọn hình ảnh hiển thị'}*/}
                    {/*]*/}
                  {/*})(*/}
                    {/*<Mutifile*/}
                      {/*onchange={this.changeDocument}*/}
                      {/*type="?tp=post"*/}
                      {/*documentUrl={this.state.documentUrl}*/}
                    {/*/>*/}
                  {/*)}*/}
                {/*</FormItem>*/}
              </Col>
            </Row>

            <Row style={rowStyle} gutter={gutter} justify="start">
              <Col span={24}>
                {/*<FormItem*/}
                  {/*{...formItemLayout}*/}
                  {/*label="Nội dung"*/}
                {/*>*/}
                  {/*{getFieldDecorator('storyText', {*/}
                    {/*rules: [*/}
                      {/*{required: true, message: 'Vui lòng nhập nội dung'}*/}
                    {/*],*/}
                    {/*initialValue: isUpdateMode ? attachments && attachments.storyText : null*/}
                  {/*})(*/}
                    {/*<Editor/>*/}
                  {/*)}*/}
                {/*</FormItem>*/}
              </Col>
            </Row>

            <Row style={rowStyle} gutter={gutter} justify="start">
              <Col span={24}>
                <FormItem
                  {...formItemLayout}
                  label="Tag"
                >
                  {getFieldDecorator('tags', {
                    rules: [
                      {required: true, message: 'Vui lòng chọn mức hiển thị'}
                    ],
                    initialValue: isUpdateMode ? `${dataSource.tags}` : 'media'
                  })(
                    <Select>
                      <Option value="media">Nhạc và video</Option>
                      <Option value="music">Ca khúc đại hội</Option>
                      <Option value="document">Văn kiện đại hội</Option>
                      <Option value="books">Sách đại hội</Option>
                      <Option value="photos">Ảnh phóng viên</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>

            <Row style={rowStyle} gutter={gutter}>
              <Col sm={24} xs={24}>
                <FormItem>
                  <Button
                    type="primary"
                    icon="double-right"
                    htmlType="submit"
                  >
                    {isUpdateMode ? 'Cập nhật tài liệu' : 'Thêm tài liệu mới'}
                  </Button>
                </FormItem>
              </Col>
            </Row>

          </Form>
        </ContentHolder>
      </PageHeaderLayout>
    )
  }

}
