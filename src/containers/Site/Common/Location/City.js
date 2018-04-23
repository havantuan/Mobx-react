import React, {Component} from 'react';
import {Select, Spin} from 'antd';
import {observer, inject} from 'mobx-react';
import {Keys} from "../../../../stores/index";
import {remove_mark} from "../../../../helpers/utility";

const {Option} = Select;

@inject(Keys.cityProvider)
@observer
export default class City extends Component {

  componentDidMount() {
    this.props.cityProvider.getDataSource();
  }

  handleChange = (changedValue) => {
    const onChange = this.props.onChange;
    const onValueChange = this.props.onValueChange;
    if (onChange) {
      onChange(changedValue);
    }
    if (onValueChange) {
      onValueChange(changedValue);
    }

    let resetFields = this.props.resetFields;

    if (resetFields) {
      let setValues = {};
      resetFields.map((key) => {
        return setValues[key] = null
      });
      this.props.form.setFieldsValue(setValues);
    }
  };

  handleFocus = () => {
    let id = this.props.id || 'citySelect';
    const selector = document.getElementById(id);
    if (selector) {
      selector.click();
    }
  };

  render() {
    let {disabled, placeholder, value} = this.props;
    let {dataSource, fetching} = this.props.cityProvider;

    return (
      <Spin spinning={fetching}>
        <Select
          showSearch
          className="selectBox-width"
          placeholder={placeholder || "Tỉnh/Thành"}
          optionFilterProp="children"
          value={(value && `${value}`) || undefined}
          allowClear
          disabled={disabled}
          onChange={this.handleChange}
          filterOption={(input, option) => remove_mark(option.props.children).toLowerCase().indexOf(remove_mark(input).toLowerCase()) >= 0}
          id={this.props.id || 'citySelect'}
          onFocus={this.handleFocus}
        >
          {dataSource.map((item, index) => (
            <Option
              value={`${item.ID}`}
              key={index}
            >
              {`${item.Name}`}
            </Option>
          ))}
        </Select>
      </Spin>
    )
  }
}