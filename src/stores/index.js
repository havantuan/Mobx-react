// Use require.context to require reducers automatically
// Ref: https://webpack.github.io/docs/context.html
// const context = require.context('./', false, /\.js$/);
// const keys = context.keys().filter(item => item !== './index.js');

import appStore from './appStore';
import routerStore from './routerStore';
import authStore from './authStore';
import meStore from './meStore';
import cityProviderStore from "./common/cityProviderStore";
import districtProviderStore from "./common/districtProviderStore";
import wardProviderStore from "./common/wardProviderStore";
import enumProviderStore from "./common/enumProviderStore";
import hubProviderStore from "./common/hubProviderStore";
import roleProviderStore from "./common/roleProviderStore";
import groupProviderStore from "./common/groupProviderStore";
import roleStore from "./roleStore";
import permissionStore from "./permissionStore";
import notificationsStore from './notification/notificationsStore';
import quizStore from './quiz/quizStore';
import scheduleStore from './schedule/scheduleStore';
import documentStore from './document/documentStore';
import fileManagerStore from './fileManagerStore';
import hubTableStore from './hubTableStore';
import userStore from './userStore';
import groupStore from './groupStore';
import categoryTableStore from "./category/categoryTableStore";
import postTableStore from "./post/postTableStore";
import checkinTableStore from "./checkin/checkinTableStore";
import checkInDetail from "./checkin/checkInDetail";
import updateCustomer from "./updateCustomerStore";
import groupAwardTableStore from "./award/groupAwardTableStore";
import awardTableStore from "./award/awardTableStore";

const Keys = {
  app: 'app',
  auth: 'auth',
  router: 'router',
  me: 'me',
  cityProvider: 'cityProvider',
  districtProvider: 'districtProvider',
  wardProvider: 'wardProvider',
  enumProvider: 'enumProvider',
  hubProvider: 'hubProvider',
  roleProvider: 'roleProvider',
  role: 'role',
  permission: 'permission',
  notification: 'notification',
  quiz: 'quiz',
  document: 'document',
  fileManager: 'fileManager',
  hubTable: 'hubTable',
  user: 'user',
  group: 'group',
  schedule: 'schedule',
  categoryTable: 'categoryTable',
  checkin: 'checkin',
  postTable: 'postTable',
  checkinTable: 'checkinTable',
  groupProvider: 'groupProvider',
  checkInDetail: 'checkInDetail',
  updateCustomer: 'updateCustomer',
  groupAwardTable: 'groupAwardTable',
  awardTable: 'awardTable',
};

const stores = {
  app: appStore,
  auth: authStore,
  router: routerStore,
  me: meStore,
  cityProvider: cityProviderStore,
  districtProvider: districtProviderStore,
  wardProvider: wardProviderStore,
  enumProvider: enumProviderStore,
  hubProvider: hubProviderStore,
  roleProvider: roleProviderStore,
  role: roleStore,
  permission: permissionStore,
  notification: notificationsStore,
  quiz: quizStore,
  document: documentStore,
  fileManager: fileManagerStore,
  hubTable: hubTableStore,
  user: userStore,
  group: groupStore,
  schedule: scheduleStore,
  categoryTable: categoryTableStore,
  checkinTable: checkinTableStore,
  postTable: postTableStore,
  groupProvider: groupProviderStore,
  checkInDetail: checkInDetail,
  updateCustomer: updateCustomer,
  groupAwardTable: groupAwardTableStore,
  awardTable: awardTableStore,
};

export {Keys, stores}
