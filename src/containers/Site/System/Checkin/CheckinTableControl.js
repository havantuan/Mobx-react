import React, {Component} from 'react';
import {Button, Col, Form, Row, Input} from 'antd';
import basicStyle from "../../../../config/basicStyle";
import EnumState from "../../Common/EnumProvider/state";
import {inject, observer} from "mobx-react";
import {Keys} from '../../../../stores/index';
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
@inject(Keys.checkinTable)
@observer
export default class CheckinTableControl extends Component {

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      console.log('Form values: ', values);
      if (!err) {
        let {Query, FilterState} = values;
        let credentials = {
          State: FilterState,
          Query
        };
        this.props.checkinTable.onFilter(credentials);
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
              <Col md={12} sm={24}>
                <FormItem
                  {...formItemLayout}
                  label={'Tìm kiết'}
                >
                  {getFieldDecorator('Query')(
                    <Input placeholder='Tìm kiếm tiêu đề'/>
                  )}
                </FormItem>
              </Col>
              <Col md={12} sm={24}>
                <FormItem
                  {...formItemLayout}
                  label={'Trạng thái'}
                >
                  {getFieldDecorator('FilterState')(
                    <EnumState valueByCode={true}/>
                  )}
                </FormItem>
              </Col>
            </Row>
          </Col>

          <Col md={6} xs={24}>
            <Row gutter={basicStyle.gutter}>
              <Col md={12} xs={24}>
                <FormItem>
                  <Button
                    icon={'search'}
                    type="primary"
                    htmlType="submit"
                    style={{width: '100%'}}
                  >
                    Lọc
                  </Button>
                </FormItem>
              </Col>

              <Col md={12} xs={24}>
                {Permission.allowUpdateCheckIn() &&
                <FormItem>
                  <Button
                    icon="plus"
                    type="primary"
                    style={{...basicStyle.greenBg, width: '100%'}}
                    onClick={this.props.checkinTable.showCreateModal}
                  >
                    Thêm mới
                  </Button>
                </FormItem>
                }
              </Col>
            </Row>
          </Col>
        </Row>
      </Form>
    )
  }

}
