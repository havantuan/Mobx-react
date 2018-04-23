import React, {PureComponent} from 'react';
import Enum from "./index";

export default class EnumGroupTypes extends PureComponent {
  render() {
    return (
      <Enum
        enumKey="GroupTypes"
        placeholder={this.props.placeholder || 'Kiểu nhóm'}
        defaultValue={this.props.defaultValue}
        valueByCode={this.props.valueByCode}
        value={this.props.value}
        style={this.props.style}
        onChange={this.props.onChange}
        disabled={this.props.disabled}
        clear={this.props.clear}
      />
    )
  }

}
