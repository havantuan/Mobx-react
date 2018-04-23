import React from 'react';
import {Row, Col, Icon, Form, Button, Checkbox, Input} from 'antd';
import {inject, observer} from 'mobx-react';
import {Keys} from "../../../../stores";
import ObjectPath from 'object-path';

const FormItem = Form.Item;

@inject(Keys.quiz)
@observer
export default class QuizItem extends React.Component {

  constructor(props) {
    super(props);
    this.quiz = props.quiz;
  }

  // componentDidMount() {
  //   if (this.mode === formModeConfig.update && this.props.dataSource) {
  //     let {dataSource} = this.props;
  //     this.setState({data: dataSource});
  //     let keys = dataSource.Answers.map((e, i) => {
  //       return e !== null && i;
  //     });
  //     this.setState({keys});
  //     uuid = dataSource.Answers.length + 1;
  //   }
  // }

  // componentWillReceiveProps(nextProps, nextState) {
  //   if (this.mode === formModeConfig.update && this.state.load) {
  //     let {dataSource} = nextProps;
  //     if (this.props.dataSource !== dataSource) {
  //       this.setState({load: false})
  //     }
  //     if (dataSource && dataSource.Answers && dataSource.Answers.length > 1) {
  //       let keys = dataSource.Answers.map((e, i) => {
  //         return e !== null && i;
  //       });
  //       this.setState({keys});
  //       uuid = dataSource.Answers.length + 1;
  //     }
  //   }
  // }

  render() {
    const dataSource = this.props.quiz.singleData && this.props.quiz.singleData.Question &&  this.props.quiz.singleData.Question[this.props.questionID];
    const {isUpdateMode} = this.props.quiz;
    const {questionID, Answers} = this.props;
    const {getFieldDecorator} = this.props.form;
    const contentAnswers = Answers ? ObjectPath.get(Answers, 'IDs') : [];
    return (
      <div>
        {contentAnswers && contentAnswers.map((val, idx) => {
          return (
            <Row justify="start" key={idx}>
              <Col sm={1} xs={4} style={{textAlign: 'center'}}>
                <FormItem>
                  {getFieldDecorator(`questions.${questionID}.Corrects.${val}`, {
                    valuePropName: 'checked',
                    initialValue: isUpdateMode ? this.props.quiz.getCorrectsQuestion(questionID, val) : false
                  })(
                    <Checkbox/>
                  )}
                </FormItem>
              </Col>

              <Col sm={23} xs={20}>
                <FormItem>
                  {getFieldDecorator(`questions.${questionID}.Answers.${val}`, {
                    validateTrigger: ['onChange', 'onBlur'],
                    rules: [{
                      required: true,
                      whitespace: true,
                      message: "Vui lòng nhập câu trả lời",
                    }],
                    initialValue: isUpdateMode ? this.props.quiz.getAnswersQuestion(questionID, val) : null
                  })(
                    <Input
                      placeholder={`Nhập câu trả lời ${idx + 1}`}
                      style={{width: '60%', marginRight: 8}}
                    />
                  )}
                  {contentAnswers.length > 2 ? (
                    <Icon
                      className="dynamic-delete-button"
                      type="minus-circle-o"
                      onClick={() => this.quiz.removeAnswer(val, questionID)}
                    />
                  ) : null}
                </FormItem>
              </Col>
            </Row>
          )
        })}

        <FormItem>
          <Button
            icon={'plus'}
            type="dashed"
            onClick={() => this.quiz.addAnswer(questionID)}
            style={{width: '70%'}}
          >
            Thêm câu trả lời
          </Button>
        </FormItem>
      </div>
    )
  }

}
