import React, {Component} from 'react';
import {Select, Spin} from 'antd';
import {inject, observer} from 'mobx-react';
import {Keys} from "../../../../stores/index";
import {remove_mark} from "../../../../helpers/utility";

const {Option} = Select;

@inject(Keys.roleProvider)
@observer
export default class RoleProvider extends Component {

  constructor(props) {
    super(props);
    this.roleProvider = this.props.roleProvider;
  }

  componentDidMount() {
    this.roleProvider.getDataSource({RoleType: this.props.RoleType || null});
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
    let {disabled, placeholder, value, mode, maxTagCount} = this.props;
    let {dataSource, fetching} = this.roleProvider;

    return (
      <Spin spinning={fetching}>
        <Select
          showSearch
          mode={mode || 'multiple'}
          className="selectBox-width"
          placeholder={placeholder || "Vai trò"}
          optionFilterProp="children"
          value={value || undefined}
          allowClear
          disabled={disabled}
          onChange={this.handleChange}
          filterOption={(input, option) => remove_mark(option.props.children).toLowerCase().indexOf(remove_mark(input).toLowerCase()) >= 0}
          maxTagCount={maxTagCount || 1}
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