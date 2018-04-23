import React from 'react';
import {Spin} from 'antd';
import {Redirect, Route, withRouter} from 'react-router-dom';
import {App} from './containers/App';
import Page504 from './containers/Page/504';
import asyncComponent from './helpers/AsyncFunc';
import routerConfig from "./config/router";
import {Keys} from './stores/index';
import {inject, observer} from "mobx-react";
import {RestrictedRoute} from './containers/App/RestrictedRoute';

@inject(Keys.me)
@withRouter
@observer
export class PublicRoute extends React.Component {

  render() {
    const {component: Component, ...rest} = this.props;

    if (!this.props.me.current) {
      return <Route
        {...rest}
        render={props =>
          <Component {...props} />}/>
    } else {
      return <Route {...rest} render={props => <Redirect to={routerConfig.dashboard}/>}/>
    }

  }
}

@inject(Keys.app, Keys.me)
@withRouter
@observer
export class Routes extends React.Component {

  componentWillMount() {
    console.log(this.props);
    if (!this.props.app.token) {
      this.props.app.setAppLoaded();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.app.token && this.props.me.current) {
      this.props.me.forgetUser();
    }
  }

  componentDidMount() {
    if (this.props.app.token) {
      this.props.me.fetchMe().finally(() => {
        this.props.app.setAppLoaded();
      })
    } else {
      this.props.app.setAppLoaded();
    }
  }

  render() {
    if (this.props.app.page504) {
      return <Page504/>
    }
    if (!this.props.app.appLoaded) {
      return <Spin
        spinning
        size={'large'}
        tip={'Đang tải...'}
      >
        <div style={{height: '100vh', width: '100vw'}}>&nbsp;</div>
      </Spin>
    }
    return (
      <div>
        <PublicRoute
          exact
          path={`${routerConfig.home}`}
          component={asyncComponent(() => import('./containers/Page/signin'))}
        />
        <PublicRoute
          exact
          path={`${routerConfig.signIn}`}
          component={asyncComponent(() => import('./containers/Page/signin'))}
        />
        {/*<PublicRoute*/}
          {/*exact*/}
          {/*path={`${routerConfig.forgotPassword}`}*/}
          {/*component={asyncComponent(() =>*/}
            {/*import('./containers/Page/forgotPassword')*/}
          {/*)}*/}
        {/*/>*/}
        {/*<PublicRoute*/}
          {/*exact*/}
          {/*path={`${routerConfig.signUp}`}*/}
          {/*component={asyncComponent(() => import('./containers/Page/signup'))}*/}
        {/*/>*/}
        {/*<PublicRoute*/}
          {/*exact*/}
          {/*path={`${routerConfig.resetPassword}`}*/}
          {/*component={asyncComponent(() =>*/}
            {/*import('./containers/Page/resetPassword')*/}
          {/*)}*/}
        {/*/>*/}
        <RestrictedRoute
          path={`${routerConfig.dashboard}`}
          component={App}
        />

      </div>
    );
  }
}
