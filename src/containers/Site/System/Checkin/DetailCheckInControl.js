import React, {Component} from 'react';
import {Button, Col, Form, Input, Row} from 'antd';
import basicStyle from "../../../../config/basicStyle";
import HubList from '../../Common/HubProvider/hubList';
import EnumState from "../../Common/EnumProvider/state";
import {inject, observer} from "mobx-react";
import {Keys} from '../../../../stores/index';
import {withRouter} from 'react-router-dom';
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
@inject(Keys.checkInDetail, Keys.router)
@withRouter
@observer

export default class DetailCheckInControl extends Component {
  constructor(props) {
    super(props);
    this.code = this.props.match.params.code
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let {Query, State, HubIDs , NotInHubIDs,} = values;
        let credentials = {
          Query,
          State,
          HubIDs: Array.isArray(HubIDs) ? HubIDs.map(val => +val) : null,
          NotInHubIDs: Array.isArray(NotInHubIDs) ? NotInHubIDs.map(val => +val) : null,
        };
        this.props.checkInDetail.onFilter(this.code, credentials);
      }
    });
  };
  exportUserCheckIn = (e) => {
    let values = this.props.form.getFieldsValue();
    let {Query, State, HubIDs , NotInHubIDs,} = values;
    let credentials = {
      Query,
      State,
      HubIDs: Array.isArray(HubIDs) ? HubIDs.map(val => +val) : null,
      NotInHubIDs: Array.isArray(NotInHubIDs) ? NotInHubIDs.map(val => +val) : null,
    };
    this.props.checkInDetail.exportCheckIn(this.code, credentials);
  }
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
                  label={'Tìm kiếm'}
                >
                  {getFieldDecorator('Query')(
                    <Input placeholder="Nhập Mã, SĐT, Tên người dùng"/>
                  )}
                </FormItem>
              </Col>

              <Col md={12} sm={24}>
                <FormItem
                  {...formItemLayout}
                  label={'Trạng thái'}
                >
                  {getFieldDecorator('State')(
                    <EnumState
                      style={{width: '100%'}}
                      placeholder="Trạng thái"
                      valueByCode={true}
                    />
                  )}
                </FormItem>
              </Col>
            </Row>

            <Row gutter={basicStyle.gutter}>
              <Col md={12} sm={24}>
                <FormItem
                  {...formItemLayout}
                  label={'Không thuộc liên đoàn'}
                >
                  {getFieldDecorator('NotInHubIDs')(
                    <HubList
                      placeholder={'Không thuộc liên đoàn'}
                    />
                  )}
                </FormItem>
              </Col>

              <Col md={12} sm={24}>
                <FormItem
                  {...formItemLayout}
                  label={'Thuộc liên đoàn'}
                >
                  {getFieldDecorator('HubIDs')(
                    <HubList
                      placeholder={'Thuộc liên đoàn'}
                    />
                  )}
                </FormItem>
              </Col>
            </Row>

          </Col>

          <Col md={6} xs={24}>
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
            { Permission.allowUpdateCheckIn() &&
            <Row gutter={basicStyle.gutter}>
              <Col md={12} xs={24}>
                <FormItem>
                  <Button
                    icon="tool"
                    type="primary"
                    style={{...basicStyle.blueButton, width: '100%'}}
                    onClick={() => this.props.checkInDetail.addSeat(this.code)}
                  >
                    Lưu Ghế
                  </Button>
                </FormItem>
              </Col>
              <Col md={12} xs={24}>
                <FormItem>
                  <Button
                    icon="excel"
                    type="primary"
                    style={{...basicStyle.orangeBg, width: '100%'}}
                    onClick={this.exportUserCheckIn}
                  >
                    Xuất Excel
                  </Button>
                </FormItem>
              </Col>
            </Row>
            }
          </Col>
        </Row>
      </Form>
    );
  }

}