import React, {Component} from 'react';
import {Button, Col, Form, Row, Input} from 'antd';
import basicStyle from "../../../../config/basicStyle";
import {inject, observer} from "mobx-react";
import {Keys} from '../../../../stores/index';
import routerConfig from "../../../../config/router";
import EnumState from "../../Common/EnumProvider/state";
import Permission from "../../../../permissions/index";
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
@inject(Keys.schedule, Keys.router)
@observer
export default class QuizTableControl extends Component {

  redirectToCreateSchedule = () => {
    this.props.router.push(routerConfig.createSchedule);
  };
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let {State, Query, CreatedDate} = values;
        let credentials = {
          State: State || undefined,
          Query: Query,
          TimeStart: CreatedDate ? CreatedDate[0] : undefined,
          TimeEnd: CreatedDate ? CreatedDate[1] : undefined,
        };
        this.props.schedule.onFilter(credentials);
      }
    });
  };

  render() {
    const {getFieldDecorator} = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit} className={'custom-form'}>
        <Row gutter={basicStyle.gutter}>
          <Col md={18} sm={24}>
            <Row gutter={basicStyle.gutter}>
              <Col sm={12} xs={24}>
                <FormItem
                  {...formItemLayout}
                  label={'Tiêu đề'}
                >
                  {getFieldDecorator('Query')(
                    <Input placeholder="Nhập tiêu đề"/>
                  )}
                </FormItem>
              </Col>

              <Col sm={12} xs={24}>
                <FormItem
                  {...formItemLayout}
                  label={'Trạng thái'}
                >
                  {getFieldDecorator('State')(
                    <EnumState valueByCode={true}/>
                  )}
                </FormItem>
              </Col>
            </Row>
          </Col>

          <Col md={6} xs={24}>
            <Row gutter={basicStyle.gutter}>
              <Col md={12} sm={24}>
                <FormItem>
                  <Button
                    style={{width: '100%'}}
                    icon={'search'}
                    type="primary"
                    htmlType="submit"
                  >
                    Tìm kiếm
                  </Button>
                </FormItem>
              </Col>
              {Permission.allowUpdateSchedule() &&
                <Col md={12} sm={24}>
                  <FormItem>
                    <Button
                      icon="plus"
                      type="primary"
                      style={{...basicStyle.greenBg, width: '100%'}}
                      onClick={this.redirectToCreateSchedule}
                    >
                      Thêm mới
                    </Button>
                  </FormItem>
                </Col>
              }
            </Row>
          </Col>
        </Row>
      </Form>
    );
  }

}