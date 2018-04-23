import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';
import {formModeConfig} from "../../../../config";

import {Row, Col, Icon, TimePicker} from 'antd';
import moment from 'moment';
import Form from '../../../../components/uielements/form';
import Input from '../../../../components/uielements/input';
import Button from '../../../../components/uielements/button';
import './Style.css';

const FormItem = Form.Item;
const propTypes = {
  mode: PropTypes.string
};
const defaultProps = {
  mode: formModeConfig.create
};

class TimeEvent extends Component {

  render() {
    const {dataSource} = this.props;
    const {getFieldDecorator} = this.props.form;
    const {day, events} = this.props;
    let tmp = events.filter(element => element.day === day);
    let keys = (tmp && tmp[0] && tmp[0].keys) || [];

    const formItems = keys.map((val, i) => {
      return (
        <Row justify="start" key={val}>
          <Col xs={3} style={{textAlign: 'center'}}>
            <FormItem>
              {getFieldDecorator(`days.${day}.sessions.${val}.time`, {
                validateTrigger: ['onChange', 'onBlur'],
                rules: [{
                  required: true,
                  message: "Vui lòng nhập thời gian chương trình",
                }],
                initialValue: dataSource && dataSource.sessions && dataSource.sessions[val] && dataSource.sessions[val].time && moment(`${dataSource.sessions[val].time}`, 'YYYY-MM-DD HH:mm:ss')
              })(
                <TimePicker
                  placeholder={'Chọn thời gian'}
                  format={'HH:mm:ss'}
                />
              )}
            </FormItem>
          </Col>
          <Col xs={20}>
            <FormItem>
              {getFieldDecorator(`days.${day}.sessions.${val}.name`, {
                validateTrigger: ['onChange', 'onBlur'],
                rules: [{
                  required: true,
                  whitespace: true,
                  message: "Vui lòng nhập tên chương trình",
                }],
                initialValue: dataSource && dataSource.sessions && dataSource.sessions[val] && dataSource.sessions[val].name
              })(
                <Input placeholder={`Nhập chương trình ${i + 1}`}
                       style={{width: '60%', marginRight: 8}} />
              )}
              {keys.length > 1 ? (
                <Icon
                  className="dynamic-delete-button"
                  type="minus-circle-o"
                  disabled={keys.length === 1}
                  onClick={() => this.props.remove(day, val)}
                />
              ) : null}
            </FormItem>
          </Col>
        </Row>
      );
    });

    return (
      <div>
        {formItems}
        <FormItem>
          <Button type="dashed" onClick={() => this.props.add(day)} style={{width: '70%'}}>
            <Icon type="plus"/> Thêm chương trình
          </Button>
        </FormItem>
      </div>
    )
  }

}

TimeEvent.propTypes = propTypes;
TimeEvent.defaultProps = defaultProps;

export default connect()(withRouter(TimeEvent));
