const routerPrefix = {
  home: '/',
  dashboard: '/dashboard'
};

const routerConfig = {
  home: routerPrefix.home,
  signIn: '/signin',
  page504: '/504',
  // signUp: '/signup',
  // forgotPassword: '/forgotpassword',
  // resetPassword: '/resetpassword',
  dashboard: routerPrefix.dashboard,
  userConfig: routerPrefix.dashboard + '/user/config',
  quiz: routerPrefix.dashboard + '/quiz',
  createQuiz: routerPrefix.dashboard + '/quiz/create',
  updateQuiz: routerPrefix.dashboard + '/quiz/update/:id',
  // document: routerPrefix.dashboard + '/document',
  // createDocument: routerPrefix.dashboard + '/document/create',
  fileManager: routerPrefix.dashboard + '/file-manager',
  notification: routerPrefix.dashboard + '/notification',
  hub: routerPrefix.dashboard + '/trade-union',
  users: routerPrefix.dashboard + '/users',
  role: routerPrefix.dashboard + '/role',
  // schedule: routerPrefix.dashboard + '/schedule',
  group: routerPrefix.dashboard + '/group',
  createSchedule: routerPrefix.dashboard + '/schedule/create',
  updateSchedule: routerPrefix.dashboard + '/schedule/update/:id',
  categories: routerPrefix.dashboard + '/categories',
  checkin: routerPrefix.dashboard + '/checkin',
  detailCheckIn: routerPrefix.dashboard + '/checkin/:code',
  post: routerPrefix.dashboard + '/post',
  award: routerPrefix.dashboard + '/award',
  news: routerPrefix.dashboard + '/news',
  document: routerPrefix.dashboard + '/document',
  discussion: routerPrefix.dashboard + '/discussion',
};

export default routerConfig;