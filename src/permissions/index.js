// import {store} from "../redux/store";
import permissions from './permissions';
import roles from './roles';
import ObjectPath from "object-path";
import meStore from '../stores/meStore';

class Permission {
  // check permission and role utilities

  getUserPermission() {
    // console.log('%c permission', 'background: #00b33c; color: #fff;', meStore.current.Permissions);
    return ObjectPath.get(meStore, 'current.Permissions', []);

    // let data = store.getState().getMe.get('data');
    // return ObjectPath.get(data, "Me.Permissions", []);

    // return JSON.parse(localStorage.getItem('Permissions'));
  }

  getUserRoles() {
    return meStore.current.Roles;
  }

  allowPermission(neededPermission) {
    return this.getUserPermission().indexOf(neededPermission) >= 0;
  }

  allowRole(neededRole) {
    return this.getUserRoles().indexOf(neededRole) >= 0;
  }

  allowHub() {
    return this.allowRole(roles.hub);
  }

  allowManager() {
    return this.allowRole(roles.manager);
  }

  allowAccountant() {
    return this.allowRole(roles.accountant);
  }

  allowShipper() {
    return this.allowRole(roles.shipper);
  }

  allowGrantPermissionRole() {
    return this.allowPermission(permissions.grantPermissionRole);
  }

  allowCreateHub() {
    return this.allowPermission(permissions.createHub);
  }

  allowUpdateHub() {
    return this.allowPermission(permissions.updateHub);
  }

  allowUpdateStateHub() {
    return this.allowPermission(permissions.updateStateHub);
  }

  allowCreateUser() {
    return this.allowPermission(permissions.createUser);
  }

  allowReadUser() {
    return this.allowPermission(permissions.readUser);
  }

  allowUpdateUser() {
    return this.allowPermission(permissions.updateUser);
  }
  allowUpdateStateUser() {
    return this.allowPermission(permissions.updateStateUser);
  }

  allowCreateRole() {
    return this.allowPermission(permissions.createRole);
  }

  allowReadRole() {
    return this.allowPermission(permissions.readRole);
  }

  allowUpdateRole() {
    return this.allowPermission(permissions.updateRole);
  }

  allowDeleteRole() {
    return this.allowPermission(permissions.deleteRole);
  }

  allowUpdateNotification() {
    return this.allowPermission(permissions.updateNotification);
  }

  allowGrantRoleUser() {
    return this.allowPermission(permissions.grantRoleUser);
  }

  allowConfigSystem() {
    return this.allowPermission(permissions.configSystem);
  }

  allowUpdateCheckIn() {
    return this.allowPermission(permissions.updateCheckIn);
  }

  allowUpdateQuizz() {
    return this.allowPermission(permissions.updateQuizz);
  }

  allowUpdateSchedule() {
    return this.allowPermission(permissions.updateSchedule);
  }

  allowCreatePostGroup() {
    return this.allowPermission(permissions.createGroup);
  }

  allowUpdatePostGroup() {
    return this.allowPermission(permissions.updateGroup);
  }

  allowDeletePostGroup() {
    return this.allowPermission(permissions.deletePostGroup);
  }

  allowPinPostGroup() {
    return this.allowPermission(permissions.pinPostGroup);
  }

  allowReactPostGroup() {
    return this.allowPermission(permissions.reactPostGroup);
  }

  allowApprovePostGroup() {
    return this.allowPermission(permissions.approvePostGroup);
  }

  allowViewPostGroup() {
    return this.allowPermission(permissions.viewPostGroup);
  }

  allowDeleteDocument() {
    return this.allowPermission(permissions.deleteDocument);
  }

  allowCreateGroup() {
    return this.allowPermission(permissions.createGroup);
  }

  allowUpdateGroup() {
    return this.allowPermission(permissions.updateGroup);
  }

  allowUpdateMembersGroup() {
    return this.allowPermission(permissions.updateMembersGroup);
  }
}

export default new Permission()