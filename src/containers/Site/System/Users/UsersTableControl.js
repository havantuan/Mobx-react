import React, {Component} from 'react';
import {Button, Col, Form, Input, Row} from 'antd';
import basicStyle from "../../../../config/basicStyle";
import HubList from '../../Common/HubProvider/hubList';
import EnumState from "../../Common/EnumProvider/state";
import {inject, observer} from "mobx-react";
import {Keys} from '../../../../stores/index';
import RoleProvider from "../../Common/RoleProvider";
import Expand from "../../../../components/Expand";
import City from "../../Common/Location/City";
import District from "../../Common/Location/District";
import Ward from "../../Common/Location/Ward";
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
@inject(Keys.user)
@observer
export default class UsersTableControl extends Component {

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let {Query, State, RoleIds, HubIDs, NotInRoleIds, NotInHubIDs} = values;
        let credentials = {
          Query,
          State,
          RoleIds: Array.isArray(RoleIds) ? RoleIds.map(val => +val) : null,
          HubIDs: Array.isArray(HubIDs) ? HubIDs.map(val => +val) : null,
          NotInRoleIds: Array.isArray(NotInRoleIds) ? NotInRoleIds.map(val => +val) : null,
          NotInHubIDs: Array.isArray(NotInHubIDs) ? NotInHubIDs.map(val => +val) : null,
        };
        this.props.user.onFilter(credentials);
      }
    });
  };
  exportExcel = () => {
    let values = this.props.form.getFieldsValue();
    let {Query, State, RoleIds, HubIDs, NotInRoleIds, NotInHubIDs} = values;
    let credentials = {
      Query,
      State,
      RoleIds: Array.isArray(RoleIds) ? RoleIds.map(val => +val) : null,
      HubIDs: Array.isArray(HubIDs) ? HubIDs.map(val => +val) : null,
      NotInRoleIds: Array.isArray(NotInRoleIds) ? NotInRoleIds.map(val => +val) : null,
      NotInHubIDs: Array.isArray(NotInHubIDs) ? NotInHubIDs.map(val => +val) : null,
    };
    this.props.user.exportExcelUser(credentials);
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
                  label={'Người dùng'}
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
                  label={'Thuộc vai trò'}
                >
                  {getFieldDecorator('RoleIds')(
                    <RoleProvider
                      placeholder={'Thuộc vai trò'}
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

              <Row gutter={basicStyle.gutter}>
                <Col span={24}>
                  <Row gutter={basicStyle.gutter}>
                    <Col md={12} sm={24}>
                      <FormItem
                        {...formItemLayout}
                        label={'Không thuộc vai trò'}
                      >
                        {getFieldDecorator('NotInRoleIds')(
                          <RoleProvider
                            placeholder={'Không thuộc vai trò'}
                          />
                        )}
                      </FormItem>
                    </Col>

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
                  </Row>
                </Col>
              </Row>

          </Col>

          <Col md={6} xs={24}>
            <FormItem>
              <Button
                icon={'file-excel'}
                style={{...basicStyle.orangeBg, width: '100%'}}
                onClick={this.exportExcel}
              >
                Xuất excel
              </Button>
            </FormItem>

            <Row gutter={basicStyle.gutter}>
              <Col md={12} xs={24}>
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

              <Col md={12} xs={24}>
                <FormItem>
                  {
                    Permission.allowCreateUser() &&
                    <Button
                      icon="plus"
                      type="primary"
                      style={{...basicStyle.greenButton, width: '100%'}}
                      onClick={this.props.user.showCreateModal}
                    >
                      Thêm mới
                    </Button>
                  }
                </FormItem>
              </Col>
            </Row>
          </Col>
        </Row>
      </Form>
    );
  }

}