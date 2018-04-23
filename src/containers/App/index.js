import React, {Component} from 'react';
import {Layout} from 'antd';
import {siteConfig} from '../../config.js';
import Sidebar from '../Sidebar/Sidebar';
import Topbar from '../Topbar/Topbar';
import moment from 'moment';
import 'moment/locale/vi';
import {Keys} from '../../stores/index';
import {inject, observer} from "mobx-react";
import {AppRouter} from './AppRouter';

moment.locale('vi');

const {Content, Footer} = Layout;

@inject(Keys.app)
@observer
export class App extends Component {

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  handleResize = () => {
    setTimeout(() => {
      this.props.app.toggleAll(window.innerWidth, window.innerHeight);
    }, 1000);
  };

  render() {
    const {url} = this.props.match;

    return (
      <Layout>
        <Sidebar url={url}/>

        <Layout>
          <Topbar url={url}/>
          <Layout>
            <Content style={{margin: '24px 24px 0', height: '100%'}}>
              <AppRouter url={url}/>
            </Content>
            <Footer
              style={{
                background: '#ffffff',
                textAlign: 'center',
                borderTop: '1px solid #ededed'
              }}
            >
              {siteConfig.footerText}
            </Footer>
          </Layout>
        </Layout>
      </Layout>
    );
  }
}