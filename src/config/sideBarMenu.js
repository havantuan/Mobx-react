import permissions from "../permissions/permissions";

const sideBarMenuConfig = {
  accountant: {
    group_00: {
      title: 'Sự kiện',
      key: 'group_00',
      icon: 'schedule',
      url: ''
    },
    group_0: {
      title: 'Trắc nghiệm',
      key: 'group_0',
      icon: 'question-circle-o',
      url: '/quiz'
    },
    // group_1: {
    //   title: 'Tài liệu',
    //   key: 'group_1',
    //   icon: 'file-text',
    //   url: '/document'
    // },
    group_2: {
      title: 'Thông báo',
      key: 'group_2',
      icon: 'notification',
      url: '/notification'
    },
    group_3: {
      title: 'Người dùng',
      key: 'group_3',
      icon: 'user',
      url: '/users',
      permission: permissions.readUser
    },
    user_group: {
      title: 'Nhóm',
      key: 'user_group',
      icon: 'team',
      url: '/group'
    },
    post: {
      title: 'Cộng đồng',
      key: 'Post',
      icon: 'file-text',
      url: '/post'
    },
    group_5: {
      title: 'Vai trò',
      key: 'group_5',
      icon: 'tags-o',
      url: '/role',
      permission: permissions.readRole
    },
    group_4: {
      title: 'Liên đoàn',
      key: 'group_4',
      icon: 'home',
      url: '/trade-union'
    },
    group_11: {
      title: 'Giải thưởng',
      key: 'group_11',
      icon: 'gift',
      url: '/award'
    },
    group_12: {
      title: 'Điểm danh',
      key: 'group_12',
      icon: 'down-square-o',
      url: '/checkin'
    },
    group_13: {
      title: 'Tin tức',
      key: 'group_13',
      icon: 'down-square-o',
      url: '/news'
    },
    group_14: {
      title: 'Thảo luận',
      key: 'group_14',
      icon: 'down-square-o',
      url: '/discussion'
    },
    group_15: {
      title: 'Tài liệu',
      key: 'group_15',
      icon: 'down-square-o',
      url: '/document'
    },
  }
};

export default sideBarMenuConfig;