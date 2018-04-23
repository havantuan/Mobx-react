import React from 'react';
import {Button, Col, Form, Input, Row} from 'antd';
import basicStyle from "../../../../config/basicStyle";
import {inject, observer} from "mobx-react";
import {Keys} from '../../../../stores/index';
import AppTypes from "../../Common/EnumProvider/appTypes";
import Permission from '../../../../permissions/index';

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
@inject(Keys.notification)
@observer
export default class NotificationTableControl extends React.Component {

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let {Query, AppType} = values;
        let credentials = {
          Query,
          AppType: AppType,
        };
        this.props.notification.onFilter(credentials);
      }
    });
  };

  render() {
    const {getFieldDecorator} = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit} className={'custom-form'}>
        <Row gutter={basicStyle.gutter}>
          <Col md={9} sm={24}>
            <FormItem
              {...formItemLayout}
              label={'Nhập chuỗi'}
            >
              {getFieldDecorator('Query')(
                <Input placeholder="Nhập ID/Tiêu đề/Chi tiết"/>
              )}
            </FormItem>
          </Col>

          <Col md={9} sm={24}>
            <FormItem
              {...formItemLayout}
              label={'Đối tượng'}
            >
              {getFieldDecorator('AppType')(
                <AppTypes placeholder="Đối tượng nhận thông báo" valueByCode={true}/>
              )}
            </FormItem>
          </Col>

          <Col md={3} sm={12} xs={24}>
            <FormItem>
              <Button
                icon={'search'}
                type="primary"
                htmlType="submit"
                style={{width: '100%'}}
              >
                Tìm kiếm
              </Button>
            </FormItem>
          </Col>

          <Col md={3} sm={12} xs={24}>
            <FormItem>
              {
                Permission.allowUpdateNotification() &&
                <Button
                  icon="plus"
                  type="primary"
                  style={{...basicStyle.greenBg, width: '100%'}}
                  onClick={this.props.notification.showCreateModal}
                >
                  Thêm mới
                </Button>
              }
            </FormItem>
          </Col>
        </Row>
      </Form>
    )
  }

}