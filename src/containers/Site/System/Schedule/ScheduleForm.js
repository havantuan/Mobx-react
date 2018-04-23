import React from 'react';
import {Row, Col, Input, Button, Form, DatePicker, Switch, BackTop} from 'antd';
import moment from 'moment';
import basicStyle from '../../../../config/basicStyle';
import {inject, observer} from 'mobx-react';
import {Keys} from "../../../../stores";
import {withRouter} from "react-router-dom";
import PageHeaderLayout from "../../../../layouts/PageHeaderLayout";
import ContentHolder from "../../../../components/utility/ContentHolder";
import ObjectPath from "object-path";
import './Style.css';
import EnumState from "../../Common/EnumProvider/state";

const FormItem = Form.Item;
const {TextArea} = Input;
const RangePicker = DatePicker.RangePicker;

@Form.create()
@withRouter
@inject(Keys.schedule)
@observer
export default class ScheduleForm extends React.Component {

  constructor(props) {
    super(props);
    this.id = props.match.params.id;
    this.schedule = props.schedule;
  }

  componentWillUnmount() {
    this.schedule.clear();
  }

  componentDidMount() {
    if (this.schedule.isUpdateMode) {
      this.schedule.fetchByID(this.id);
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      console.log('%c values...', 'background: #009900; color: #fff', values)
      if (!err) {
        let {Title, DayStart, questions, State} = values;
        questions = questions.filter(() => true);
        let credentials = {
          Title,
          DayStart,
          Sessions: questions,
          State: +State
        };
        console.log('%c credentials...', 'background: #009900; color: #fff', credentials)
        if (this.props.schedule.isUpdateMode) {
          this.schedule.updateSchedule(this.id, credentials);
        }
        else {
          this.schedule.createSchedule(credentials);
        }
      }
    });
  };

  render() {
    const {singleData, questions, isUpdateMode} = this.schedule;
    const {getFieldDecorator} = this.props.form;

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

    return (
      <PageHeaderLayout title={`${isUpdateMode ? 'Chỉnh sửa' : 'Tạo'} sự kiện`}>
        <ContentHolder>
          <Form onSubmit={this.handleSubmit} className={'custom-form'}>
            <Row gutter={basicStyle.gutter} style={{marginBottom: 20}}>
              <Col md={18} sm={24}>
                <Row gutter={basicStyle.gutter}>
                  <Col md={18} sm={24}>
                    <FormItem
                      {...formItemLayout}
                      label='Tiêu đề'
                    >
                      {getFieldDecorator('Title', {
                        rules: [{
                          required: true,
                          message: 'Vui lòng nhập tiêu đề'
                        }],
                        initialValue: isUpdateMode ? singleData.Title : null
                      })(
                        <Input size='default' placeholder={'Tiêu đề sự kiện'}/>
                      )}
                    </FormItem>
                  </Col>

                  <Col md={6} sm={24}>
                    <FormItem
                      {...formItemLayout}
                      label='Thời gian'
                    >
                      {getFieldDecorator('DayStart', {
                        rules: [{
                          required: true,
                          message: 'Vui lòng chọn ngày'
                        }],
                        initialValue: isUpdateMode ?
                          moment(`${ObjectPath.get(singleData, 'DayStart.ISO', moment().format())}`, 'YYYY-MM-DD') : null
                      })(
                        <DatePicker
                          showTime
                          format="YYYY-MM-DD"
                          placeholder="Chọn thời gian"
                          style={{width: '100%'}}
                        />
                      )}
                    </FormItem>
                  </Col>
                </Row>

                <Row gutter={basicStyle.gutter}>
                  <Col md={18} xs={24}>
                    <FormItem
                      {...formItemLayout}
                      label='Trạng thái'
                    >
                      {getFieldDecorator('State', {
                        initialValue: isUpdateMode ? `${ObjectPath.get(singleData.State, "Value")}` : `1`,
                      })(
                        <EnumState placeholder={'Trạng thái'}/>
                      )}
                    </FormItem>
                  </Col>
                </Row>
              </Col>

              <Col md={6} sm={24} style={{textAlign: 'right'}}>
                <FormItem>
                  <Button
                    icon="plus"
                    type="primary"
                    style={basicStyle.greenBg}
                    onClick={this.schedule.addQuiz}
                  >
                    Thêm lịch
                  </Button>
                </FormItem>
              </Col>
            </Row>

            <Row justify="start" gutter={basicStyle.gutter}>
              <Col span={24}>
                {questions.map((val, idx) => {
                  return (
                    <Row key={idx} gutter={basicStyle.gutter} className={'schedule-row'}>
                      <Col span={24}>
                        <Row gutter={basicStyle.gutter}>
                          <Col md={3} sm={6} xs={24}>
                            <FormItem>
                              <h3>Lịch {idx + 1}:</h3>
                            </FormItem>
                          </Col>

                          <Col md={6} sm={12} xs={24}>
                            <FormItem>
                              {getFieldDecorator(`questions.${val.id}.Time`, {
                                rules: [{
                                  required: true,
                                  message: "Vui lòng nhập thời gian",
                                }],
                                initialValue: isUpdateMode ?
                                  singleData.Sessions && singleData.Sessions[val.id] && singleData.Sessions[val.id].Time
                                  : null
                              })(
                                <Input placeholder={'Nhập thời gian'}/>
                              )}
                            </FormItem>
                          </Col>

                          <Col md={15} sm={6} xs={24} style={{textAlign: 'right'}}>
                            <FormItem>
                              {questions.length > 1 ? (
                                <Button
                                  type="danger"
                                  ghost
                                  icon={'close'}
                                  size={'small'}
                                  style={{marginBottom: 10}}
                                  onClick={() => this.schedule.removeQuiz(val.id)}
                                >
                                  Xóa lịch
                                </Button>
                              ) : null}
                            </FormItem>
                          </Col>
                        </Row>
                      </Col>

                      <Col md={{span: 21, offset: 3}} sm={24}>
                        <FormItem>
                          {getFieldDecorator(`questions.${val.id}.Name`, {
                            validateTrigger: ['onChange', 'onBlur'],
                            rules: [{
                              required: true,
                              message: "Vui lòng nhập lịch",
                            }],
                            initialValue: isUpdateMode ? singleData.Sessions && singleData.Sessions[val.id] && singleData.Sessions[val.id].Name : null
                          })(
                            <TextArea
                              rows={2}
                              placeholder={`Nhập lịch ${idx + 1} ...`}
                            />
                          )}
                        </FormItem>
                      </Col>
                    </Row>
                  )
                })}
              </Col>
            </Row>

            <Row gutter={basicStyle.gutter} justify="start">
              <Col md={{span: 3}} sm={{span: 3}} xs={{span: 24}}>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={'double-right'}
                >
                  {this.props.schedule.isUpdateMode ? 'Cập nhật sự kiện' : 'Thêm sự kiện mới'}
                </Button>
              </Col>
            </Row>
            <BackTop/>
          </Form>
        </ContentHolder>
      </PageHeaderLayout>
    )
  }

}