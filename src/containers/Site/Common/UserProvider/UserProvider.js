import React, {Component} from 'react';
import {Select} from 'antd';
import _ from 'lodash';
import {UserProviderStore} from "../../../../stores/common/userProviderStore";
import {observer} from 'mobx-react';

const {Option} = Select;

@observer
export default class UserProvider extends Component {

  constructor(props) {
    super(props);
    this.userProvider = new UserProviderStore();
  }

  componentDidMount() {
    this.userProvider.fetch(null);
  }

  onSearch = _.debounce((value) => {
    let query = {
      Query: value
    };
    this.userProvider.fetch(query);
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
    let {placeholder, mode, maxTagCount, value, code} = this.props;
    const {dataSource} = this.userProvider;

    return (
      <Select
        showSearch
        mode={mode || 'default'}
        maxTagCount={maxTagCount || 1}
        className="selectBox-width"
        placeholder={placeholder || "Chọn người dùng"}
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
            value={code ? `${item.Code}` :`${item.ID}`}
            key={index}
          >
            {`${item.Name} - ${item.Phone}`}
          </Option>
        ))}
      </Select>
    )
  }

}