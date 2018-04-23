import React from 'react';
import {Row, Col, Input, Button, Form, DatePicker, Switch, BackTop } from 'antd';
import moment from 'moment';
import basicStyle from '../../../../config/basicStyle';
import QuizItem from './QuizItem';
import './Style.css';
import {inject, observer} from 'mobx-react';
import {Keys} from "../../../../stores";
import {withRouter} from "react-router-dom";
import PageHeaderLayout from "../../../../layouts/PageHeaderLayout";
import ContentHolder from "../../../../components/utility/ContentHolder";
import ObjectPath from "object-path";
import EnumState from "../../Common/EnumProvider/state";
const FormItem = Form.Item;
const {TextArea} = Input;
const RangePicker = DatePicker.RangePicker;

@Form.create()
@withRouter
@inject(Keys.quiz)
@observer
export default class QuizForm extends React.Component {

  constructor(props) {
    super(props);
    this.id = props.match.params.id;
    this.quiz = props.quiz;
  }

  componentWillUnmount() {
    this.quiz.clear();
  }
  componentDidMount () {
    if(this.props.quiz.isUpdateMode) {
      this.quiz.fetchByID(this.id);
    }
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      console.log('%c values...', 'background: #009900; color: #fff', values)
      if (!err) {
        let {Title, time, questions, State} = values;
        let TimeStart = time[0].format();
        let TimeEnd = time[1].format();
        console.log('%c questionsquestions', 'color: #00b33c', questions)
        questions = questions.filter(() => true);
        questions.forEach(val => {
          val.Answers = val.Answers.filter(val => val);
          val.Corrects = val.Corrects.filter(() => true);
          val.Corrects = val.Corrects.map((val, index) => val === true )
        });
        let credentials = {
          Title,
          TimeStart,
          TimeEnd,
          Questions: questions,
          State: +State
        };
        if (this.props.quiz.isUpdateMode) {
          this.quiz.updateQuiz(this.id, credentials);
        }
        else {
          this.quiz.createQuiz(credentials);
        }
      }
    });
  };

  render() {
    const {singleData, questions, isUpdateMode} = this.quiz;
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
    console.log('%c singleData.Question', 'color: #00b33c', singleData.Question)
    return (
      <PageHeaderLayout Title={`${isUpdateMode ? 'Chỉnh sửa' : 'Tạo'} bộ câu hỏi`}>
        <ContentHolder>
          <Form onSubmit={this.handleSubmit}>
            <Row gutter={basicStyle.gutter}>
              <Col md={9} sm={24}>
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
                    <Input size='default' placeholder={'Tiêu đề cho bộ câu hỏi'}/>
                  )}
                </FormItem>
              </Col>

              <Col md={9} sm={24}>
                <FormItem
                  {...formItemLayout}
                  label='Thời gian'
                >
                  {getFieldDecorator('time', {
                    rules: [{
                      required: true,
                      message: 'Vui lòng chọn ngày'
                    }],
                    initialValue: isUpdateMode ? [
                      moment(`${ObjectPath.get(singleData, 'Start.ISO', moment().format())}`, 'YYYY-MM-DD HH:mm'),
                      moment(`${ObjectPath.get(singleData, 'End.ISO', moment().format())}`, 'YYYY-MM-DD HH:mm')
                    ] : null
                  })(
                    <RangePicker
                      size="default"
                      style={{width: '100%'}}
                      showTime={{format: 'HH:mm'}}
                      format="YYYY-MM-DD HH:mm"
                      placeholder={['Bắt đầu', 'Kết thúc']}
                    />
                  )}
                </FormItem>
              </Col>

              <Col md={6} sm={24} style={{textAlign: 'right'}}>
                <Button
                  icon="plus"
                  type="primary"
                  style={basicStyle.greenBg}
                  onClick={this.quiz.addQuiz}
                >
                  Thêm câu hỏi
                </Button>
              </Col>
            </Row>
            <Row gutter={basicStyle.gutter}>
              <Col md={9} sm={24}>
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
            <Row justify="start">
              <Col span={24}>
                {questions.map((val, idx) => {
                  return (
                    <Row key={idx}>
                      <Col span={24}>
                        <Row>
                          <Col md={18} sm={24}>
                            <h3>Câu hỏi {idx + 1}:</h3>
                          </Col>

                          <Col md={6} sm={24} style={{textAlign: 'right'}}>
                            {questions.length > 1 ? (
                              <Button
                                type="danger"
                                ghost
                                icon={'close'}
                                size={'small'}
                                style={{marginBottom: 10}}
                                onClick={() => this.quiz.removeQuiz(val.id)}
                              >
                                Xóa câu hỏi
                              </Button>
                            ) : null}
                          </Col>
                        </Row>

                        <Row>
                          <Col span={24}>
                            <FormItem>
                              {getFieldDecorator(`questions.${val.id}.Title`, {
                                validateTrigger: ['onChange', 'onBlur'],
                                rules: [{
                                  required: true,
                                  message: "Vui lòng nhập câu hỏi",
                                }],
                                initialValue: isUpdateMode ? this.quiz.getTitleQuestion(val.id) : null
                              })(
                                <TextArea
                                  rows={4}
                                  placeholder={`Nhập câu hỏi ${idx + 1} ...`}
                                />
                              )}
                            </FormItem>
                          </Col>
                        </Row>

                        <QuizItem
                          questionID={val.id}
                          Answers={val.Answers}
                          form={this.props.form}
                        />
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
                  loading={this.quiz.isUpdating || this.quiz.isCreating}
                >
                  {isUpdateMode ? 'Cập nhật câu hỏi' : 'Thêm bộ câu hỏi mới'}
                </Button>
              </Col>
            </Row>
            <BackTop />
          </Form>
        </ContentHolder>
      </PageHeaderLayout>
    )
  }

}