import React, {PureComponent} from 'react';
import Enum from "./index";

export default class EnumPostTypes extends PureComponent {
  render() {
    return (
      <Enum
        enumKey="PostTypes"
        placeholder={this.props.placeholder || 'Loại bài viết'}
        defaultValue={this.props.defaultValue}
        valueByCode={this.props.valueByCode}
        value={this.props.value}
        style={this.props.style}
        onChange={this.props.onChange}
        disabled={this.props.disabled}/>
    )
  }

}
