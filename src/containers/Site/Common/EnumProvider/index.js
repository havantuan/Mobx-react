import React, {Component} from 'react';
import {Select, Spin} from 'antd';
import {inject, observer} from 'mobx-react';
import {Keys} from "../../../../stores/index";

const {Option} = Select;

@inject(Keys.enumProvider)
@observer
export default class Enum extends Component {

  constructor(props) {
    super(props);
    this.enumProvider = props.enumProvider;
  }

  componentDidMount() {
    this.enumProvider.getDataSource();
  }

  handleChange = (changedValue) => {
    const onChange = this.props.onChange;
    const onValueChange = this.props.onValueChange;
    if (onChange) {
      onChange(changedValue);
    }
    if (onValueChange) {
      onValueChange(changedValue)
    }
  };

  render() {
    let {enumKey, valueByCode, placeholder, defaultValue, style, value, disabled, clear, filterOption, showSearch} = this.props;
    let {dataSource, fetching} = this.enumProvider;
    let valueKey = valueByCode ? "Code" : "Value";

    return (
      <Spin spinning={fetching}>
        <Select
          showSearch={showSearch ? false : true}
          className="selectBox-width"
          placeholder={placeholder}
          defaultValue={defaultValue}
          value={value ? `${value}` : undefined}
          style={style}
          disabled={disabled ? disabled : false}
          optionFilterProp="children"
          allowClear={!!(clear)}
          onChange={this.handleChange}
          filterOption={filterOption ? filterOption : (input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 }
        >
          {dataSource[enumKey] && dataSource[enumKey].map((enumVal, index) => (
            <Option
              value={`${enumVal[valueKey]}`}
              key={index}
            >
              {`${enumVal.Name}`}
            </Option>
          ))}
        </Select>
      </Spin>
    )
  }

}
