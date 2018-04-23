import React, {Component} from 'react';
import {Select, Spin} from 'antd';
import {inject, observer} from 'mobx-react';
import {Keys} from "../../../../stores/index";
import {remove_mark} from "../../../../helpers/utility";

const {Option} = Select;

@inject(Keys.hubProvider)
@observer
export default class HubList extends Component {

  constructor(props) {
    super(props);
    this.hubProvider = this.props.hubProvider;
  }

  componentDidMount() {
    let filter = null;
    if (this.props.isActive) {
      filter = {State: 'Active'}
    }
    this.hubProvider.getDataSource(filter);
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
    let {disabled, placeholder, value, style, mode, maxTagCount} = this.props;
    let {dataSource, fetching} = this.hubProvider;

    return (
      <Spin spinning={fetching}>
        <Select
          showSearch
          mode={mode || 'multiple'}
          maxTagCount={maxTagCount || 1}
          placeholder={placeholder || 'Liên đoàn'}
          optionFilterProp="children"
          style={{width: '100%', ...style}}
          allowClear
          value={(value && `${value}`) || undefined}
          disabled={disabled}
          onChange={this.handleChange}
          filterOption={(input, option) => remove_mark(option.props.children).toLowerCase().indexOf(remove_mark(input).toLowerCase()) >= 0}
        >
          {dataSource && dataSource.map((item, index) => (
            <Option
              value={`${item.ID}`}
              key={index}
            >
              {`${item.DisplayName}`}
            </Option>
          ))}
        </Select>
      </Spin>
    )
  }

}