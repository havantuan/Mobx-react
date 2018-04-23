import {action, observable, isObservableArray, computed} from "mobx";
import {authRequest, errorMessage} from '../../request/index';
import apiUrl from '../../config/apiUrl';
import {defaultPagination} from '../../config';
import {convertToPagination, convertToSorter} from '../../helpers/utility';

export class AwardTableStore {

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
  @observable usersCurrentRow = null;
  @observable isFetchingRowName = null;
  @observable usersPagination = {
    current: 1,
    pageSize: 5,
    total: 0,
  };
  @observable isShowUsersModal = false;
  @observable usersSort = [];
  @observable iconUrl = null;
  @observable selectedRowKeys = [];
  @action
  clear = () => {
    this.filter = {};
    this.pagination = defaultPagination;
    this.dataSource = [];
    this.order = [];
  }

  @action
  reload = () => {
    this.fetch(this.filter, this.pagination, this.order)
  }

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
        query DataSources($Page: Int = 1, $Limit: Int = 10, $Order: [Sort], $Query: String) {
            Awards(Pageable: {Page: $Page, Limit: $Limit, Sorts: $Order}, Query: $Query) {
                Items {
                  ID
                  Title
                  Description    
                     AwardGroup {
                    ID
                    Title
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
      let {Query} = filter;
      variables.Query = Query || null;
    }
    this.fetching = true;

    return authRequest
      .post(apiUrl.GRAPH_URL, {
        query,
        variables
      }).then(action((result) => {
        const data = result.data.Awards;
        this.dataSource = data.Items;
        this.pagination.total = data.Pager.TotalOfItems;

        this.pagination = pagination;
        this.order = order;
        this.filter = filter;
      })).catch(action(e => {
        errorMessage(e);
        throw e;
      })).finally(action(() => {
        this.fetching = false;
      }));
  }

  @action
  update = (id, data) => {
    this.isUpdating = true;
    return authRequest
      .put(apiUrl.UPDATE_AWARD_URL.replace(':id', id), data).then(action((result) => {
        this.onCancelModal();
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
      .post(apiUrl.CREATE_AWARD_URL, data).then(action((result) => {
        this.onCancelModal();
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
  fetchByID = (id) => {
    let query = `
        query GroupAward($id: Int) {
          Award (ID: $id) {
            ID
            Title
            Description    
             AwardGroup {
              ID
              Title
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
        this.currentRow = result.data.Award;
      })).catch(action(e => {
        errorMessage(e);
        throw e;
      })).finally(action(() => {
        this.isFetchingCurrentRow = false;
      }));
  };

  @action
  onCancelModal = () => {
    this.isShowModal = false;
  };

  @action
  onSubmitFormModal = (formData) => {
    if (this.isUpdateMode) {
      return this.update(this.currentRow.ID, formData);
    } else {
      return this.create(formData);
    }
  };

  @action
  showCreateModal = () => {
    this.currentRow = undefined;
    this.isShowModal = true;
    this.isUpdateMode = false;
  }

  @action
  showUpdateModal = (id) => {
    this.isShowModal = true;
    this.isUpdateMode = true;
    this.fetchByID(id);
  }
  @action
  reloadUsersByGroupID = () => {
    this.fetchUsersByGroupID(this.isFetchingRowID, this.usersPagination, this.usersSort);
  };
  @action
  fetchUsersByGroupID = (groupID, pagination, order = []) => {
    let query = `
    query Award($Page: Int, $Limit: Int, $ID: Int, $Order: [Sort]) {
      Award(ID: $ID) {
        Title
        Users (Pageable: {Page: $Page, Limit: $Limit, Sorts: $Order}) {
          Items {
            CreatedAt {
              Pretty
            }                       
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
        let group = result.data.Award;
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
  addPeopleToGroup = (groupID, data) => {
    this.isCreating = true;
    return authRequest
      .put(apiUrl.ADD_PEOPLE_TO_AWARD_URL.replace(':id', groupID), data).then(action((result) => {
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
  showUsersModal = (currentData) => {
    this.isShowUsersModal = true;
    this.isFetchingRowID = currentData ? currentData : null;
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
      .put(apiUrl.REMOVE_PEOPLE_FROM_AWARD_URL.replace(':id', groupID), data).then(action((result) => {
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

export default new AwardTableStore()