import {action, observable, isObservableArray, computed} from "mobx";
import {authRequest, errorMessage} from '../request';
import apiUrl from '../config/apiUrl';
import {defaultPagination} from '../config';
import {convertToPagination, convertToSorter} from '../helpers/utility';
import ObjectPath from 'object-path';

export class GroupStore {
  @observable fetching = false;
  @observable isCreating = false;
  @observable isUpdateMode = false;
  @observable isUpdating = false;
  @observable isShowModal = false;
  @observable dataSource = [];
  @observable currentRow = undefined;
  @observable isFetchingCurrentRow = false;
  @observable isFetchingRowID = 0;
  @observable filter = {};
  @observable pagination = defaultPagination;
  @observable order = [];
  @observable isShowUsersModal = false;
  @observable usersCurrentRow = null;
  @observable isFetchingRowName = null;
  @observable usersPagination = {
    current: 1,
    pageSize: 5,
    total: 0,
  };
  @observable usersSort = [];
  @observable iconUrl = null;
  @observable isExpandSearch = false;
  @observable selectedRowKeys = [];
  @observable groupType = ``;
  @observable groupTypeCode = null;
  @observable groupTitle = 'bài viết';

  clear() {
    this.filter = {};
    this.pagination = defaultPagination;
    this.dataSource = [];
    this.order = [];
    this.groupType = ``;
    this.groupTypeCode = null;
    this.groupTitle = 'bài viết';
    console.log('%cgroup type.......', 'color: #00b33c', this.groupTypeCode)
  }
  @action
  setGroupType = (name, val, title) => {
    this.groupType = val;
    this.groupTypeCode = name;
    this.groupTitle = title;
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
    query Groups($Page: Int, $Limit: Int, $Order: [Sort], $State: EnumState, $Query: String, $UserID: Int, $ParentID: Int, $GroupType: EnumGroupType, $IDs: [Int]) {
      Groups(Pageable: {Page: $Page, Limit: $Limit, Sorts: $Order}, State: $State, Query: $Query, UserID: $UserID, ParentID: $ParentID, GroupType: $GroupType, IDs: $IDs) {
        Items {
          GroupAccessibility {
            Code
            Name
            Value
          }
          GroupType {
            Code
            Name
            Value
          }
          CreatedAt {
            Pretty
          }
          Description
          Icon {
            ID
            Url
            Thumb(Param: "100x") {
              Url
            }
          }
          ID
          State {
            Code
            Name
            Value
          }
          Title
          Code
          UpdatedAt {
            Pretty
          }
          Order
          Parent {
            ID
          }
          Users {
            Pager {
              Limit
              NumberOfPages
              Page
              TotalOfItems
            }
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
      let {State, Query, UserID, ParentID, IDs, GroupType} = filter;
      variables.State = State || null;
      variables.Query = Query || null;
      variables.UserID = UserID || null;
      variables.ParentID = ParentID || null;
      variables.GroupType = this.groupTypeCode ||GroupType;
      variables.IDs = filter.IDs;
    }
    this.fetching = true;

    return authRequest
      .post(apiUrl.GRAPH_URL, {
        query,
        variables
      }).then(action((result) => {
        const data = result.data.Groups;
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
  reloadUsersByGroupID = () => {
    this.fetchUsersByGroupID(this.isFetchingRowID, this.usersPagination, this.usersSort);
  };

  @action
  handleUsersTableChange = (pagination, filters, sort) => {
    this.usersPagination = convertToPagination(pagination, this.usersPagination);
    this.usersSort = convertToSorter(sort);
    this.reloadUsersByGroupID();
  };

  @action
  fetchUsersByGroupID = (groupID, pagination, order = []) => {
    let query = `
    query Group($Page: Int, $Limit: Int, $ID: Int, $Order: [Sort]) {
      Group(ID: $ID) {
        Title
        Code
        Parent {
          Title
        }
        Users (Pageable: {Page: $Page, Limit: $Limit, Sorts: $Order}) {
          Items {
            CreatedAt {
              Pretty
            }
            Role {
              Name
            }
            User {
              Avatar {
                Url
                Thumb(Param: "100x") {
                  Url
                }
              }
              Code
              Email
              ID
              Name
              Phone
              State {
                Code
                Name
              }
              Hub {
                Name
                Code
              }
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
    }
    `;
    let {pageSize, current} = pagination;
    let variables = {
      Page: current,
      Limit: pageSize,
      Order: order || null,
      ID: groupID
    };
    this.isFetchingCurrentRow = true;

    return authRequest
      .post(apiUrl.GRAPH_URL, {
        query,
        variables
      }).then(action((result) => {
        let group = result.data.Group;
        if (group) {
          const data = group.Users;
          this.isFetchingRowName = group.Title;
          this.usersPagination = {
            ...pagination,
            total: data.Pager.TotalOfItems
          };
          this.usersCurrentRow = data.Items;
        }
      })).catch(action(e => {
        errorMessage(e);
        throw e;
      })).finally(action(() => {
        this.isFetchingCurrentRow = false;
      }));
  };

  @action
  update = (id, data) => {
    this.isUpdating = true;
    return authRequest
      .put(apiUrl.UPDATE_GROUP_URL.replace(':id', id), data).then(action((result) => {
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
      .post(apiUrl.CREATE_GROUP_URL, data).then(action((result) => {
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
  addPeopleToGroup = (groupID, data) => {
    this.isCreating = true;
    return authRequest
      .put(apiUrl.ADD_PEOPLE_TO_GROUP_URL.replace(':id', groupID), data).then(action((result) => {
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
  showUpdateModal = (currentData) => {
    this.isUpdateMode = true;
    this.isShowModal = true;
    this.isFetchingRowID = currentData ? currentData.ID : null;
    this.currentRow = currentData;
    this.iconUrl = ObjectPath.get(currentData, 'Icon.Url', null);
  };

  @action
  showCreateModal = () => {
    this.isUpdateMode = false;
    this.isShowModal = true;
  };

  @action
  showUsersModal = (currentData) => {
    this.isShowUsersModal = true;
    this.isFetchingRowID = currentData ? currentData.ID : null;
    this.reloadUsersByGroupID();
  };

  @action
  cancelModal = () => {
    this.isShowModal = false;
    this.isShowUsersModal = false;
    this.isFetchingRowID = null;
    this.currentRow = null;
    this.usersCurrentRow = null;
    this.usersPagination = {
      current: 1,
      pageSize: 5,
      total: 0,
    };
    this.usersSort = [];
    this.iconUrl = null;
  };

  @action
  onImageUrlChange = (image) => {
    let files = ObjectPath.get(image, 'response.files');
    console.log('%c files...', 'background: #009900; color: #fff', image, files)
    if (Array.isArray(files) || isObservableArray(files)) {
      let file = files[0];
      this.iconUrl = file ? file.url : null;
    }
  };

  @action
  onToggleExpandSearch = () => {
    this.isExpandSearch = !this.isExpandSearch;
  };

  onRowSelectionChange = (selectedRowKeys) => {
    this.selectedRowKeys.replace(selectedRowKeys);
  };

  @computed get countSelectedRowKeys() {
    if (isObservableArray(this.selectedRowKeys)) {
      return this.selectedRowKeys.toJS().length;
    }
    return 0;
  };

  @computed get getSelectedRowKeys() {
    if (isObservableArray(this.selectedRowKeys)) {
      return this.selectedRowKeys.toJS();
    }
    return [];
  };

  @action
  onSubmitRemovePeople = () => {
    this.removePeopleFromGroup(this.isFetchingRowID, {UserIDs: this.selectedRowKeys});
  };

  @action
  removePeopleFromGroup = (groupID, data) => {
    this.isUpdating = true;
    return authRequest
      .put(apiUrl.REMOVE_PEOPLE_FROM_GROUP_URL.replace(':id', groupID), data).then(action((result) => {
        this.reload();
        this.reloadUsersByGroupID();
        this.selectedRowKeys.clear();
        return result
      })).catch(action(e => {
        errorMessage(e);
        throw e;
      })).finally(action(() => {
        this.isUpdating = false;
      }));
  };

}

export default new GroupStore()