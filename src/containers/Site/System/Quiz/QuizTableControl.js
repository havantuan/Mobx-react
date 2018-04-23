import React, {Component} from 'react';
import {Button, Col, Form, Row, Input} from 'antd';
import basicStyle from "../../../../config/basicStyle";
import {inject, observer} from "mobx-react";
import {Keys} from '../../../../stores/index';
import EnumState from "../../Common/EnumProvider/state";
import routerConfig from "../../../../config/router";
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
@inject(Keys.quiz, Keys.router)
@observer
export default class QuizTableControl extends Component {

  redirectToCreateQuiz = () => {
    this.props.router.push(routerConfig.createQuiz);
  };
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let {State, Query} = values;
        let credentials = {
          State: State || undefined,
          Query: Query,
        };
        this.props.quiz.onFilter(credentials);
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
              {Permission.allowUpdateQuizz() &&
              <Col md={12} sm={24}>
                <FormItem>
                  <Button
                    icon="plus"
                    type="primary"
                    style={{...basicStyle.greenBg, width: '100%'}}
                    onClick={this.redirectToCreateQuiz}
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