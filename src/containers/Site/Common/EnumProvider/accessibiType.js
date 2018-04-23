import React, {PureComponent} from 'react';
import Enum from "./index";

export default class ActionTypes extends PureComponent {
    render() {
        return (
            <Enum
                enumKey="Accessibilities"
                placeholder={this.props.placeholder}
                defaultValue={this.props.defaultValue}
                valueByCode={this.props.valueByCode}
                value={this.props.value}
                style={this.props.style}
                onChange={this.props.onChange}
                disabled={this.props.disabled}/>
        )
    }

}
