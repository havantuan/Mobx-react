import {action, observable} from "mobx";
import {authRequest, errorMessage} from '../../request/index';
import apiUrl from '../../config/apiUrl';
import {defaultPagination} from '../../config';
import {convertToPagination} from '../../helpers/utility';

export class CategoryTableStore {

  @observable fetching = false;
  @observable isCreating = false;
  @observable isUpdateMode = false;
  @observable isUpdating = false;
  @observable isShowModal = false;
  @observable dataSource = [];
  @observable currentRow = undefined;
  @observable CityID = 18;
  @observable DistrictID = null;
  @observable CityIDForm = 18;
  @observable DistrictIDForm = null;
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
    this.reload();
  };
  @action
  onFilter = (filter) => {
    this.filter = filter;
    this.pagination = defaultPagination;
    return this.reload();
  };

  @action
  setCityID = (CityID) => {
    this.CityID = CityID;
    this.DistrictID = null;
  }
  @action
  setDistrictID = (DistrictID) => {
    this.DistrictID = DistrictID;
  }

  @action
  setCityIDForm = (CityID) => {
    this.CityIDForm = CityID;
    this.DistrictIDForm = null;
  }
  @action
  setDistrictIDForm = (DistrictID) => {
    this.DistrictIDForm = DistrictID;
  }


  @action
  fetch = (filter, pagination, order = []) => {

    let query = `
        query DataSources {
            Categories (Leaf: false) {
              ID
              Name
                                          
              Children {
                ID  
                Depth
                Name                                
              }
              Depth
            }
        }
        `;
    // let {pageSize, current} = pagination;

    if (filter) {
    }
    this.fetching = true
    return authRequest
      .post(apiUrl.GRAPH_URL, {
        query,
      }).then(action((result) => {
        const data = result.data.Categories;
        this.dataSource = data;
      })).catch(action(e => {
        errorMessage(e);
        throw e;
      })).finally(action(() => {
        this.fetching = false;
      }));
  }

  @action
  update = (id, data) => {
    this.isUpdating = true
    return authRequest
      .put(apiUrl.UPDATE_HUB_URL.replace(':id', id), data).then(action((result) => {
        this.onCancelModal();
        this.reload();
        return result;
      })).catch(action(e => {
        errorMessage(e);
        throw e;
      })).finally(action(() => {
        this.isUpdating = false;
      }));
  }
  @action
  create = (data) => {
    this.isCreating = true;
    return authRequest
      .post(apiUrl.CREATE_HUB_URL, data).then(action((result) => {
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
      .put(data ? apiUrl.ACTIVE_HUB_URL.replace(':id', id) : apiUrl.DEACTIVE_HUB_URL.replace(':id', id)).then(action((result) => {
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
        query Hub($id: Int) {
          Hub (ID: $id) {
            Accessibility {
                    Code
                    Name
                    Value
                  }
            Address,
            City {
              Name
              ID
            },
            Code
            Name
              Phone
              CloudPrintID            
            District {
              Name
              ID
            }
            ID
            Type {
              Code
              Name
            }
            Ward {
              Name
              ID
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
        this.currentRow = result.data.Hub;
        this.CityIDForm = this.currentRow.City ? this.currentRow.City.ID : null;
        this.DistrictIDForm = this.currentRow.District ? this.currentRow.District.ID : null;
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
  }
  @action
  showCreateModal = () => {
    this.setCityIDForm(18);
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

export default new CategoryTableStore()