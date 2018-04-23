import {action, observable, isObservableArray} from 'mobx';
import {authRequest, errorMessage} from '../request/index';
import apiUrl from "../config/apiUrl";
import permissionStore from './permissionStore';
import ObjectPath from 'object-path';

export class RoleStore {
  @observable dataSource = [];
  @observable fetching = false;
  @observable isUpdating = false;
  @observable selectedRowKeys = [];
  @observable currentRow = undefined;
  @observable isFetchingCurrentRow = false;
  @observable isFetchingRowID = 0;
  @observable isCreating = false;
  @observable UpdateMode = false;
  @observable Updating = false;
  @observable ShowModal = false;
  @observable isShowModal = false;

  @action
  onSelectedChange = (rowKeys) => {
    console.log('%c rowKeys', 'color: #00b33c', rowKeys)
    this.selectedRowKeys = rowKeys;
  };

  clear() {
    this.filter = {};
    this.dataSource = []
  }

  @action
  fetch = (filter) => {
    let query = `
      query Roles($RoleType:  EnumRoleType) {
        Roles (RoleType: $RoleType) {
          Name
          ID
          Code
          Type {
            Code
            Name
          }
          Permissions {
              Name
              Code
              ID
          }      
        }
      }
    `;

    this.fetching = true;
    let variables = {
    };
    if (filter) {
      let {RoleType} = filter;
      variables.RoleType = RoleType || null;
    }
    return authRequest
      .post(apiUrl.GRAPH_URL, {
        query,
        variables
      }).then(action((result) => {
        this.dataSource = result.data.Roles;
      })).catch(action(e => {
        errorMessage(e);
        throw e;
      })).finally(action(() => {
        this.fetching = false;
      }));
  };

  @action
  grantRoleByStaffID = (id) => {
    this.isUpdating = true;
    let IDs = this.selectedRowKeys;
    if (isObservableArray(IDs)) {
      return authRequest
        .put(apiUrl.GRANT_ROLE_URL.replace(':id', id), {IDs}).then(action((result) => {
          return result;
        })).catch(action(e => {
          errorMessage(e);
          throw e;
        })).finally(action(() => {
          this.isUpdating = false;
        }));
    }
  };
  @action
  deleteRole = (id) => {
    this.fetching = true;
    return authRequest
      .delete(apiUrl.DELETE_ROLE_URL.replace(':id', id)).then(action((result) => {
        return this.fetch();
      })).catch(action(e => {
        errorMessage(e);
        throw e;
      })).finally(action(() => {
        this.fetching = false;
      }));
  };

  @action
  showModal = (data) => {
    this.isShowModal = true;
    this.currentRow = data;
    this.isFetchingRowID = data ? data.ID : 0;
    let permissions = ObjectPath.get(data, 'Permissions', []);
    let permissionIDs = permissions.map(val => val.ID);
    permissionStore.onSelectedChange(permissionIDs);
  };

  @action
  cancelModal = () => {
    this.isShowModal = false;
    this.currentRow = null;
  };

  @action
  update = (id, data) => {
    this.Updating = true;
    return authRequest
      .put(apiUrl.UPDATE_ROLE_URL.replace(':id', id), data).then(action((result) => {
        this.fetch();
        return result;
      })).catch(action(e => {
        errorMessage(e);
        throw e;
      })).finally(action(() => {
        this.Updating = false;
      }));
  };

  @action
  create = (data) => {
    this.Creating = true;
    return authRequest
      .post(apiUrl.CREATE_ROLE_URL, data).then(action((result) => {
        this.fetch();
        return result
      })).catch(action(e => {
        errorMessage(e);
        throw e;
      })).finally(action(() => {
        this.Creating = false;
      }));
  };
  @action
  openModal = () => {
    this.ShowModal = true;
    this.UpdateMode = false;
  }
  @action
  onCloseModal = () => {
    this.currentRow = undefined;
    this.ShowModal = false;
  }
  @action
  onSubmitFormModal = (formData) => {
    if (this.UpdateMode) {
      return this.update(this.currentRow.ID, formData);
    } else {
      return this.create(formData);
    }
  };
  @action
  upDateRole = (id) => {
    this.ShowModal = true;
    this.UpdateMode = true;
    this.fetchByID(id);
  }
  @action
  fetchByID = (id) => {
    let query = `
        query Role($id: Int) {
          Role (ID: $id) {               
            Code
            ID
            Name                                                  
             Type {
            Name
            Value
            Code
          }            
          }
        }
        `;

    let variables = {
      id
    };
    this.isFetchingCurrentRow = true;
    return authRequest
      .post(apiUrl.GRAPH_URL, {
        query,
        variables
      }).then(action((result) => {
        this.currentRow = result.data.Role;
      })).catch(action(e => {
        errorMessage(e);
        throw e;
      })).finally(action(() => {
        this.isFetchingCurrentRow = false;
      }));
  };
}


export default new RoleStore();