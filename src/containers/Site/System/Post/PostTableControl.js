import React, {Component} from 'react';
import {Button, Col, Form, Input, Row, Select, Switch} from 'antd';
import basicStyle from "../../../../config/basicStyle";
import {inject, observer} from "mobx-react";
import {Keys} from '../../../../stores/index';
import SelectDate from "../../Common/SelectDate/SelectDate";
import UserProvider from "../../Common/UserProvider/UserProvider";
import {defaultOptionsConfig} from "../../../../config";
import Expand from "../../../../components/Expand";
import EnumPostTypes from "../../Common/EnumProvider/PostTypes";
import EnumApproveType from "../../Common/EnumProvider/approveType";
import Permission from "../../../../permissions/index";
import GroupProvider from "../../Common/GroupProvider";
import EnumState from "../../Common/EnumProvider/state";
const {Option} = Select;
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
@inject(Keys.postTable)
@observer
export default class PostTableControl extends Component {

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      console.log('Form values: ', values);
      if (!err) {
        let {CreatedDate, UserID, UpdatedDate, GroupIds, NotInGroupIds, IsPin} = values;
        let credentials = {
          ...values,
          CreatedFrom: CreatedDate ? CreatedDate[0] : null,
          CreatedTo: CreatedDate ? CreatedDate[1] : null,
          UserID: UserID ? +UserID : null,
          UpdatedFrom: UpdatedDate ? UpdatedDate[0] : null,
          UpdatedTo: UpdatedDate ? UpdatedDate[1] : null,
          GroupIds: GroupIds ? GroupIds.map(val => +val) : null,
          NotInGroupIds: NotInGroupIds ? NotInGroupIds.map(val => +val) : null,
          IsPin: +IsPin === 0 ? null : (+IsPin === 1 ? true : false)
        };
        this.props.postTable.onFilter(credentials);
      }
    });
  };

  render() {
    const {countSelectedRowKeys} = this.props.postTable;
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
                    <Input placeholder={'Nhập tiêu đề, nội dung'}/>
                  )}
                </FormItem>
              </Col>

              <Col md={12} sm={24}>
                <FormItem
                  {...formItemLayout}
                  label={'Ngày tạo'}
                >
                  {getFieldDecorator('CreatedDate', {
                    initialValue: this.props.postTable.createdDateSelected
                  })(
                    <SelectDate defaultSelected={defaultOptionsConfig.date}/>
                  )}
                </FormItem>
              </Col>
            </Row>

            <Row gutter={basicStyle.gutter}>
              <Col md={12} sm={24}>
                <FormItem
                  {...formItemLayout}
                  label={'Trạng thái'}
                >
                  {getFieldDecorator('ApproveType')(
                    <EnumApproveType valueByCode/>
                  )}
                </FormItem>
              </Col>
              {
                Permission.allowApprovePostGroup() &&
                <Col md={12} sm={24}>
                  <FormItem
                    {...formItemLayout}
                    label={'Phê duyệt'}
                  >
                    <Button
                      icon={'check-circle-o'}
                      disabled={!(countSelectedRowKeys > 0)}
                      style={
                        countSelectedRowKeys > 0 ?
                          {...basicStyle.orangeBg, width: '100%'}
                          : {width: '100%'}
                      }
                      onClick={this.props.postTable.showApprovedPostModal}
                    >
                      Chọn trạng thái phê duyệt {countSelectedRowKeys > 0 ? `(${countSelectedRowKeys})` : ''}
                    </Button>
                  </FormItem>
                </Col>
              }
            </Row>

            {
              this.props.postTable.isExpandSearch &&
              <Row gutter={basicStyle.gutter}>
                <Col span={24}>
                  <Row gutter={basicStyle.gutter}>
                    <Col md={12} sm={24}>
                      <FormItem
                        {...formItemLayout}
                        label={'Người tạo'}
                      >
                        {getFieldDecorator('UserID')(
                          <UserProvider/>
                        )}
                      </FormItem>
                    </Col>

                    <Col md={12} sm={24}>
                      <FormItem
                        {...formItemLayout}
                        label={'Ngày cập nhật'}
                      >
                        {getFieldDecorator('UpdatedDate')(
                          <SelectDate/>
                        )}
                      </FormItem>
                    </Col>
                  </Row>

                  <Row gutter={basicStyle.gutter}>
                    <Col md={12} sm={24}>
                      <FormItem
                        {...formItemLayout}
                        label={'Thuộc nhóm'}
                      >
                        {getFieldDecorator('GroupIds')(
                          <GroupProvider mode={'multiple'}/>
                        )}
                      </FormItem>
                    </Col>

                    <Col md={12} sm={24}>
                      <FormItem
                        {...formItemLayout}
                        label={'Không thuộc nhóm'}
                      >
                        {getFieldDecorator('NotInGroupIds')(
                          <GroupProvider mode={'multiple'}/>
                        )}
                      </FormItem>
                    </Col>
                  </Row>

                  <Row gutter={basicStyle.gutter}>
                    <Col md={12} sm={24}>
                      <FormItem
                        {...formItemLayout}
                        label={'Ghim'}
                      >
                        {getFieldDecorator('IsPin', {
                          initialValue: '0'
                        })(
                          <Select
                            placeholder="Ghim"
                          >
                            <Option value={`0`}>Tất cả</Option>
                            <Option value={`1`}>Ghim</Option>
                            <Option value={`2`}>Không gim</Option>
                          </Select>
                        )}
                      </FormItem>
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
                expandable={this.props.postTable.isExpandSearch}
                onClick={this.props.postTable.onToggleExpandSearch}
              />
            </FormItem>

            <Row gutter={basicStyle.gutter}>
              <Col md={Permission.allowCreatePostGroup() ? 12 : 24} xs={24}>
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
                Permission.allowCreatePostGroup() &&
                <Col md={12} xs={24}>
                  <FormItem>
                    <Button
                      icon="plus"
                      type="primary"
                      style={{...basicStyle.greenBg, width: '100%'}}
                      onClick={this.props.postTable.showCreateModal}
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
    )
  }

}
