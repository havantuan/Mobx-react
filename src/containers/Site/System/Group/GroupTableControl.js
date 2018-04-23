import React, {Component} from 'react';
import {Button, Col, Form, Input, Row} from 'antd';
import basicStyle from "../../../../config/basicStyle";
import EnumState from "../../Common/EnumProvider/state";
import {inject, observer} from "mobx-react";
import {Keys} from '../../../../stores/index';
import UserProvider from "../../Common/UserProvider/UserProvider";
import GroupProvider from "../../Common/GroupProvider";
import Expand from "../../../../components/Expand";
import EnumGroupTypes from "../../Common/EnumProvider/groupTypes";
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
@inject(Keys.group)
@observer
export default class GroupTableControl extends Component {

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let {UserID, ParentID, GroupType} = values;
        let credentials = {
          ...values,
          UserID: UserID ? +UserID : null,
          ParentID: ParentID ? +ParentID : null,
          GroupType
          // IDs: IDs ? IDs.map(val => +val) : null
        };
        console.log('%c credentials', 'color: #00b33c', credentials)
        this.props.group.onFilter(credentials);
      }
    });
  };

  render() {
    const {getFieldDecorator} = this.props.form;
    console.log('%cthis.props.group.groupType', 'color: #00b33c', this.props.group.groupTypeCode)
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
                    <Input placeholder="Nhập tiêu đề nhóm"/>
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
                      valueByCode
                      style={{width: '100%'}}
                      placeholder="Trạng thái"
                    />
                  )}
                </FormItem>
              </Col>
            </Row>

            <Row gutter={basicStyle.gutter}>
              <Col md={12} sm={24}>
                <FormItem
                  {...formItemLayout}
                  label={'Kiểu'}
                >
                  {getFieldDecorator('GroupType', {
                    initialValue: this.props.group.groupTypeCode
                  })(
                    <EnumGroupTypes valueByCode={true} placeholder={'Kiểu nhóm'} disabled={!!(this.props.group.groupType)}/>
                  )}
                </FormItem>
              </Col>

              <Col md={12} sm={24}>
                <FormItem
                  {...formItemLayout}
                  label={'Nhóm cha'}
                >
                  {getFieldDecorator('ParentID')(
                    <GroupProvider placeholder={'Nhóm cha'}/>
                  )}
                </FormItem>
              </Col>
            </Row>

            {
              this.props.group.isExpandSearch &&
              <Row gutter={basicStyle.gutter}>
                <Col span={24}>
                  <Row gutter={basicStyle.gutter}>
                    <Col md={12} sm={24}>
                      <FormItem
                        {...formItemLayout}
                        label={'Người dùng'}
                      >
                        {getFieldDecorator('UserID')(
                          <UserProvider/>
                        )}
                      </FormItem>
                    </Col>

                    <Col md={12} sm={24}>

                    </Col>
                  </Row>
                </Col>
              </Row>
            }
          </Col>

          <Col md={6} xs={24}>
            <FormItem>
              <Expand
                style={{width: '100%'}}
                expandable={this.props.group.isExpandSearch}
                onClick={this.props.group.onToggleExpandSearch}
              />
            </FormItem>

            <Row gutter={basicStyle.gutter}>
              <Col md={Permission.allowCreateUser() ? 12 : 24} xs={24}>
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

              {
                Permission.allowCreateUser() &&
                <Col md={12} xs={24}>
                  <FormItem>
                    <Button
                      icon="plus"
                      type="primary"
                      style={{...basicStyle.greenBg, width: '100%'}}
                      onClick={this.props.group.showCreateModal}
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