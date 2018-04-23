import React from "react";
import {Route, Switch, withRouter} from "react-router-dom";
import asyncComponent from "../../helpers/AsyncFunc";
import permissionsConfig from "../../permissions/permissions";
import routerConfig from "../../config/router";
import {RestrictedRoute} from './RestrictedRoute';

@withRouter
export class AppRouter extends React.Component {

  render() {
    return (
      <Switch>
        <RestrictedRoute
          exact
          path={`${routerConfig.userConfig}`}
          component={asyncComponent(() => import("../Site/System/User/UserConfig"))}
        />
        <RestrictedRoute
          exact
          path={`${routerConfig.quiz}`}
          component={asyncComponent(() => import("../Site/System/Quiz/QuizTable"))}
        />
        <RestrictedRoute
          exact
          path={`${routerConfig.createQuiz}`}
          component={asyncComponent(() => import("../Site/System/Quiz/CreateQuiz"))}
        />
        <RestrictedRoute
          exact
          path={`${routerConfig.updateQuiz}`}
          component={asyncComponent(() => import("../Site/System/Quiz/UpdateQuiz"))}
        />
        {/*<RestrictedRoute*/}
        {/*exact*/}
        {/*path={`${routerConfig.document}`}*/}
        {/*component={asyncComponent(() => import("../Site/System/Document/DocumentTable"))}*/}
        {/*/>*/}
        {/*<RestrictedRoute*/}
        {/*exact*/}
        {/*path={`${routerConfig.createDocument}`}*/}
        {/*component={asyncComponent(() => import("../Site/System/Document/CreateDocument"))}*/}
        {/*/>*/}
        <RestrictedRoute
          exact
          path={`${routerConfig.notification}`}
          component={asyncComponent(() => import("../Site/System/Notification/NotificationTable"))}
        />
        <RestrictedRoute
          exact
          path={`${routerConfig.fileManager}`}
          component={asyncComponent(() => import("../Site/System/FileManager/index"))}
        />
        <RestrictedRoute
          exact
          path={`${routerConfig.hub}`}
          component={asyncComponent(() => import("../Site/System/Hub/HubTable"))}
        />
        <RestrictedRoute
          exact
          path={`${routerConfig.role}`}
          component={asyncComponent(() => import("../Site/System/Role/RoleTable"))}
          permission={permissionsConfig.readRole}
        />
        <RestrictedRoute
          exact
          path={`${routerConfig.users}`}
          component={asyncComponent(() => import("../Site/System/Users/UsersTable"))}
          permission={permissionsConfig.readUser}
        />
        <RestrictedRoute
          exact
          path={`${routerConfig.group}`}
          component={asyncComponent(() => import("../Site/System/Group/GroupTable"))}
        />
        <RestrictedRoute
          exact
          path={`${routerConfig.dashboard}`}
          component={asyncComponent(() => import("../Site/System/Schedule/ScheduleTable"))}
        />
        <RestrictedRoute
          exact
          path={`${routerConfig.updateSchedule}`}
          component={asyncComponent(() => import("../Site/System/Schedule/UpdateSchedule"))}
        />
        <RestrictedRoute
          exact
          path={`${routerConfig.createSchedule}`}
          component={asyncComponent(() => import("../Site/System/Schedule/CreateSchedule"))}
        />
        <RestrictedRoute
          exact
          path={`${routerConfig.checkin}`}
          component={asyncComponent(() => import("../Site/System/Checkin/CheckinTable"))}
          // permission={permissionsConfig.readStaff}
        />
        <RestrictedRoute
          exact
          path={`${routerConfig.detailCheckIn}`}
          component={asyncComponent(() => import("../Site/System/Checkin/CheckInDetail"))}
          // permission={permissionsConfig.readStaff}
        />
        <RestrictedRoute
          exact
          path={`${routerConfig.post}`}
          component={asyncComponent(() => import("../Site/System/Post/PostTable"))}
        />

        <RestrictedRoute
          exact
          path={`${routerConfig.award}`}
          component={asyncComponent(() => import("../Site/System/TabAward/index"))}
        />
        <RestrictedRoute
          exact
          path={`${routerConfig.news}`}
          component={asyncComponent(() => import("../Site/System/News/index"))}
        />
          <RestrictedRoute
            exact
            path={`${routerConfig.document}`}
            component={asyncComponent(() => import("../Site/System/Documents/index"))}
          />
          <RestrictedRoute
            exact
            path={`${routerConfig.discussion}`}
            component={asyncComponent(() => import("../Site/System/Discussions/index"))}
          />

        {/* lastest route */}
        <Route
          exact
          path={"*"}
          component={asyncComponent(() => import("../Page/404"))}
        />
      </Switch>
    );
  }
}