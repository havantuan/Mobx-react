import {action, observable} from "mobx";
import {authRequest, errorMessage} from '../../request/index';
import apiUrl from '../../config/apiUrl';
import {defaultPagination} from '../../config';
import {convertToPagination, convertToSorter} from '../../helpers/utility';

export class GroupAwardTableStore {

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
            AwardGroups(Pageable: {Page: $Page, Limit: $Limit, Sorts: $Order}, Query: $Query) {
                Items {
                  ID
                  Title
                  Description      
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
        const data = result.data.AwardGroups;
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
      .put(apiUrl.UPDATE_GROUP_AWARD_URL.replace(':id', id), data).then(action((result) => {
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
      .post(apiUrl.CREATE_GROUP_AWARD_URL, data).then(action((result) => {
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
  active = (id, data) => {
    this.isFetchingRowID = id;
    return authRequest
      .put(data ? apiUrl.ACTIVE_GroupAward_URL.replace(':id', id) : apiUrl.DEACTIVE_GroupAward_URL.replace(':id', id)).then(action((result) => {
        return this.reload();
      })).catch(action(e => {
        errorMessage(e);
        throw e;
      })).finally(action(() => {
        this.isFetchingRowID = 0;
      }));
  }

  @action
  fetchByID = (id) => {
    let query = `
        query AwardGroup($id: Int) {
          AwardGroup (ID: $id) {
            ID
            Title
            Description           
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
        this.currentRow = result.data.AwardGroup;
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

}

export default new GroupAwardTableStore()