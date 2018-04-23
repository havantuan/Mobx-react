import {action, isObservableArray, observable} from 'mobx';
import {authRequest, errorMessage} from '../request/index';
import apiUrl from "../config/apiUrl";
import {defaultPagination} from "../config";
import {convertToPagination, convertToSorter} from "../helpers/utility";
import roleStore from "./roleStore";
import appStore from "./appStore";
import ObjectPath from "object-path";

export class UserStore {
  @observable fetching = false;
  @observable isCreating = false;
  @observable isUpdateMode = false;
  @observable isUpdating = false;
  @observable isShowRoleModal = false;
  @observable dataSource = [];
  @observable currentRow = undefined;
  @observable isActiveFetching = false;
  @observable isActiveID = 0;
  @observable isFetchingCurrentRow = false;
  @observable isFetchingRowID = 0;
  @observable filter = {};
  @observable pagination = defaultPagination;
  @observable order = [];
  @observable stepIndex = 0;
  @observable temporaryData = {};
  @observable fetchingSingleData = false;
  @observable singleData = {};
  @observable isShowUpdateModal = false;
  @observable isExpandSearch = false;
  @observable avatar = {
    id: null,
    url: null
  };

  clear() {
    this.filter = {};
    this.pagination = defaultPagination;
    this.dataSource = [];
    this.order = [];
    this.avatar = {
      id: null,
      url: null
    }
  }

  @action
  reload = () => {
    this.fetch(this.filter, this.pagination, this.order)
  };

  @action
  handleTableChange = (pagination, filters, sort) => {
    this.pagination = convertToPagination(pagination, this.pagination);
    this.order = convertToSorter(sort);
    this.reload();
  };

  @action
  onFilter = (filter) => {
    this.filter = filter;
    this.pagination = defaultPagination;
    return this.reload();
  };

  @action
  fetch = (filter, pagination, order = []) => {
    let query = `
    query Users($Page: Int = 1, $Limit: Int = 10, $Order: [Sort], $RoleIds: [Int], $NotInRoleIds: [Int], $State: EnumState, $Query: String, $NotInHubIDs: [Int], $DistrictID: Int, $WardID: Int, $HubIDs: [Int], $CityID: Int) {
      Users(Pageable: {Page: $Page, Limit: $Limit, Sorts: $Order}, RoleIds: $RoleIds, NotInRoleIds: $NotInRoleIds, State: $State, Query: $Query, NotInHubIDs: $NotInHubIDs, DistrictID: $DistrictID, WardID: $WardID, HubIDs: $HubIDs, CityID: $CityID) {
        Items {
          Portrait {
              Thumb (Param: "100x") {       
            Url        
          }
            ID
            Url
          }
          Code
          CreatedAt {
            Pretty
          }
          Email
          Hub {
            ID
            Code
            Name
          }
          ID
          Name
          Phone
          Roles {
            ID
            Name
          }
          State {
            Code
            Name
          }
        }
        Pager {
            Limit
            NumberOfPages
            Page
            TotalOfItems
        }
      }
    }
    `;
    let {pageSize, current} = pagination;
    let variables = {
      Page: current,
      Limit: pageSize,
      Order: order || null,
    };
    if (filter) {
      let {RoleIds, NotInRoleIds, State, Query, NotInHubIDs, DistrictID, WardID, HubIDs, CityID} = filter;
      variables.RoleIds = RoleIds || null;
      variables.NotInRoleIds = NotInRoleIds || null;
      variables.State = State || null;
      variables.Query = Query || null;
      variables.NotInHubIDs = NotInHubIDs || null;
      variables.DistrictID = DistrictID || null;
      variables.WardID = WardID || null;
      variables.HubIDs = HubIDs || null;
      variables.CityID = CityID || null;
    }
    this.fetching = true;

    return authRequest
      .post(apiUrl.GRAPH_URL, {
        query,
        variables
      }).then(action((result) => {
        const data = result.data.Users;
        this.pagination = {
          ...pagination,
          total: data.Pager.TotalOfItems
        };
        this.dataSource = data.Items;
      })).catch(action(e => {
        errorMessage(e);
        throw e;
      })).finally(action(() => {
        this.fetching = false;
      }));
  };

  @action
  onActiveChange = (id, checked) => {
    this.isActiveID = id;
    if (checked === true) {
      this.active(id);
    }
    else {
      this.deactive(id);
    }
  };

  @action
  active = (id) => {
    this.isActiveFetching = true;
    return authRequest
      .put(apiUrl.ACTIVE_USER_URL.replace(':id', id)).then(action((result) => {
        this.reload();
        return result;
      })).catch(action(e => {
        errorMessage(e);
        throw e;
      })).finally(action(() => {
        this.isActiveFetching = false;
      }));
  };
  @action
  exportExcelUser = (data) => {
    window.open(apiUrl.EXPORT_USER_URL + `?access_token=` + appStore.token + `&query=` + encodeURIComponent(JSON.stringify(data)));
  }
  @action
  deactive = (id) => {
    this.isActiveFetching = true;
    return authRequest
      .put(apiUrl.DEACTIVE_USER_URL.replace(':id', id)).then(action((result) => {
        this.reload();
        return result;
      })).catch(action(e => {
        errorMessage(e);
        throw e;
      })).finally(action(() => {
        this.isActiveFetching = false;
      }));
  };

  @action
  update = (id, data) => {
    this.isUpdating = true;
    return authRequest
      .put(apiUrl.UPDATE_USER_URL.replace(':id', id), data).then(action((result) => {
        this.reload();
        return result;
      })).catch(action(e => {
        errorMessage(e);
        throw e;
      })).finally(action(() => {
        this.isUpdating = false;
      }));
  };

  @action
  create = (data) => {
    this.isCreating = true;
    return authRequest
      .post(apiUrl.CREATE_USER_URL, data).then(action((result) => {
        this.reload();
        return result
      })).catch(action(e => {
        errorMessage(e);
        throw e;
      })).finally(action(() => {
        this.isCreating = false;
      }));
  };

  @action
  showRoleModal = (currentData) => {
    this.isShowRoleModal = true;
    this.isFetchingRowID = currentData ? currentData.ID : null;
    this.currentRow = currentData;
    let roles = ObjectPath.get(currentData, 'Roles', []);
    console.log('%c roles', 'color: #00b33c', roles);
    let roleIDs = isObservableArray(roles) ? roles.slice().map(val => val.ID) : [];
    roleStore.onSelectedChange(roleIDs);
  };

  @action
  closeModal = () => {
    this.isShowRoleModal = false;
    this.isShowUpdateModal = false;
    this.currentRow = null;
    this.avatar = null;
  };

  @action
  showCreateModal = () => {
    this.isUpdateMode = false;
    this.isShowUpdateModal = true;
  };

  @action
  showUpdateModal = (currentData) => {
    this.isUpdateMode = true;
    this.isShowUpdateModal = true;
    this.isFetchingRowID = currentData ? currentData.ID : null;
    this.currentRow = currentData;
    this.avatar = {
      id: ObjectPath.get(currentData, 'Portrait.ID'),
      url: ObjectPath.get(currentData, 'Portrait.Url')
    };
  };

  @action
  toggleExpandSearch = () => {
    this.isExpandSearch = !this.isExpandSearch;
  };

  @action
  onAvatarChange = (id, url) => {
    this.avatar = {id, url};
  }
}

export default new UserStore();