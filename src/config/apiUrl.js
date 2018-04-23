const REST_API_URL = "/api/v1";
const apiUrl = {
  LOGIN: `${REST_API_URL}/oauth/token`,
  REVOKE: `${REST_API_URL}/oauth/revoke`,
  GRAPH_URL: `${REST_API_URL}/graph`,
  RESET_PASSWORD_URL: `${REST_API_URL}/user/resetPassword`,
  UPDATE_INFORMATION_URL: `${REST_API_URL}/user/updateInformation`,
  CREATE_NOTIFICATION_URL: `${REST_API_URL}/notification/create`,
  //hub
  CREATE_HUB_URL: `${REST_API_URL}/hub`,
  UPDATE_HUB_URL: `${REST_API_URL}/hub/:id`,
  ACTIVE_HUB_URL: `${REST_API_URL}/hub/:id/active`,
  DEACTIVE_HUB_URL: `${REST_API_URL}/hub/:id/deactive`,
  // user
  CREATE_USER_URL: `${REST_API_URL}/user/create`,
  UPDATE_USER_URL: `${REST_API_URL}/user/update/:id`,
  ACTIVE_USER_URL: `${REST_API_URL}/user/:id/activate`,
  DEACTIVE_USER_URL: `${REST_API_URL}/user/:id/deactivate`,
  GRANT_ROLE_URL: `${REST_API_URL}/user/:id/grant/roles`,
  GRANT_PERMISSION_URL: `${REST_API_URL}/role/:id/grant/permissions`,
  UPDATE_USER_IMAGE_URL: `${REST_API_URL}/user/:id/portrait`,
  //quiz
  CREATE_QUIZ_URL: `${REST_API_URL}/quiz`,
  UPDATE_QUIZ_URL: `${REST_API_URL}/quiz/:id`,
  //group
  CREATE_GROUP_URL: `${REST_API_URL}/group`,
  UPDATE_GROUP_URL: `${REST_API_URL}/group/:id`,
  ADD_PEOPLE_TO_GROUP_URL: `${REST_API_URL}/group/:id/addPeople`,
  REMOVE_PEOPLE_FROM_GROUP_URL: `${REST_API_URL}/group/:id/removePeople`,
  //schedule
  CREATE_SCHEDULE_URL: `${REST_API_URL}/schedule`,
  UPDATE_SCHEDULE_URL: `${REST_API_URL}/schedule/:id`,
  //upload
  UPLOAD_AVATAR_URL: `${REST_API_URL}/upload/avatar`,
  UPLOAD_IMAGE_URL: `${REST_API_URL}/upload/image`,
  UPLOAD_DOCUMENT_URL: `${REST_API_URL}/upload/document`,
  //post
  CREATE_POST_URL: `${REST_API_URL}/post`,
  UPDATE_POST_URL: `${REST_API_URL}/post/:id`,
  DELETE_POST_URL: `${REST_API_URL}/post/:id`,
  EDIT_APPROVE_TYPE_FOR_POST_URL: `${REST_API_URL}/post/approve`,
  PIN_A_POST_URL: `${REST_API_URL}/post/:id/pin`,
  //checkin
  CREATE_CHECKIN_URL: `${REST_API_URL}/checkin`,
  UPDATE_CHECKIN_URL: `${REST_API_URL}/checkin/:id`,
  CHECK_IN_URL: `${REST_API_URL}/checkin/:check-id/check/:user-code`,
  CHECK_SEATS_URL: `${REST_API_URL}/checkin/:id/item`,
  DELETE_ROLE_URL: `${REST_API_URL}/role/:id/delete`,
  CREATE_ROLE_URL: `${REST_API_URL}/role/create`,
  UPDATE_ROLE_URL: `${REST_API_URL}/role/:id/update`,
  //doument
  EDIT_DOCUMENT_URL: `${REST_API_URL}/document/:id`,
  UPDATE_GROUP_AWARD_URL: `${REST_API_URL}/awardGroup/:id`,
  CREATE_GROUP_AWARD_URL: `${REST_API_URL}/awardGroup`,
  UPDATE_AWARD_URL: `${REST_API_URL}/award/:id`,
  CREATE_AWARD_URL: `${REST_API_URL}/award`,
  ADD_PEOPLE_TO_AWARD_URL: `${REST_API_URL}/award/:id/addPeople`,
  REMOVE_PEOPLE_FROM_AWARD_URL: `${REST_API_URL}/award/:id/removePeople`,
  EXPORT_USER_URL: `${REST_API_URL}/user/export`,
  EXPORT_CHECKIN_ITEM_URL: `${REST_API_URL}/checkin/export/:id/checkItem`,
};
export default apiUrl