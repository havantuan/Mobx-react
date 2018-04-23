import React, {Component} from 'react';
import {Select} from 'antd';
import {observer} from 'mobx-react';
import {GroupAwardProviderStore} from "../../../../stores/common/GroupAwardProviderStore";
import _ from "lodash";

const {Option} = Select;

@observer
export default class GroupAwardProvider extends Component {

  constructor(props) {
    super(props);
    this.groupAwardProvider = new GroupAwardProviderStore();
  }

  componentDidMount() {
    this.groupAwardProvider.fetch(null);
  }

  onSearch = _.debounce((value) => {
    let query = {
      Query: value
    };
    this.groupAwardProvider.fetch(query);
  }, 350);

  onSelect = (value, option) => {
    if (this.props.mode === 'multiple') {
      return;
    }
    const {onValueChange, onChange} = this.props;
    if (onValueChange) {
      onValueChange(value);
    }
    if (onChange) {
      onChange(value);
    }
  };

  handleChange = (changedValue) => {
    if (this.props.mode === 'multiple') {
      const {onChange} = this.props;
      if (onChange) {
        onChange(changedValue);
      }
      return;
    }
    if (changedValue === undefined) {
      const {onChange} = this.props;
      if (onChange) {
        onChange(changedValue);
      }
    }
  };

  render() {
    let {placeholder, mode, maxTagCount, value} = this.props;
    const {dataSource} = this.groupAwardProvider;

    return (
      <Select
        showSearch
        mode={mode || 'default'}
        maxTagCount={maxTagCount || 1}
        className="selectBox-width"
        placeholder={placeholder || "Nhóm giải thưởng"}
        optionFilterProp="children"
        value={value || undefined}
        showArrow={false}
        filterOption={false}
        allowClear
        onChange={this.handleChange}
        onSearch={this.onSearch}
        onSelect={this.onSelect}
      >
        {dataSource.map((item, index) => (
          <Option
            value={`${item.ID}`}
            key={index}
          >
            {`${item.Title}`}
          </Option>
        ))}
      </Select>
    )
  }

}