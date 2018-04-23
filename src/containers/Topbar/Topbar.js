import React, {Component} from 'react';
import {Icon, Layout} from 'antd';
import './index.less';
import {TopbarUser} from '../../components/topbar';
import {Keys} from '../../stores/index';
import {inject, observer} from "mobx-react";

const {Header} = Layout;

@inject(Keys.app, Keys.router)
@observer
export default class Topbar extends Component {

  constructor(props) {
    super(props);
    this.app = props.app;
  }

  render() {
    const {toggleCollapsed} = this.app;
    const collapsed = this.app.collapsed && !this.openDrawer;
    return (
      <Header style={{background: '#fff', padding: 0}}>

        <div className={'header'}>
          <Icon
            className="trigger"
            type={collapsed ? 'menu-unfold' : 'menu-fold'}
            onClick={toggleCollapsed}
          />

          <div className={'right'}>
            <span className={'action account'}>
              <TopbarUser/>
            </span>
          </div>
        </div>

      </Header>
    );
  }
}