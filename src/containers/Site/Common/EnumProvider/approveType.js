import React, {PureComponent} from 'react';
import Enum from "./index";

export default class EnumApproveType extends PureComponent {
  render() {
    return (
      <Enum
        enumKey="ApproveType"
        placeholder={this.props.placeholder || 'Trạng thái phê duyệt'}
        defaultValue={this.props.defaultValue}
        valueByCode={this.props.valueByCode}
        value={this.props.value}
        style={this.props.style}
        onChange={this.props.onChange}
        disabled={this.props.disabled}/>
    )
  }

}
