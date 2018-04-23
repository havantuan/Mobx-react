import {action, observable, isObservableArray, computed} from "mobx";
import {authRequest, errorMessage} from '../../request/index';
import apiUrl from '../../config/apiUrl';
import {defaultPagination} from '../../config';
import {convertToPagination, convertToSorter, filterDateTime, setDefaultDate} from '../../helpers/utility';

export class PostTableStore {

  @observable fetching = false;
  @observable isCreating = false;
  @observable isUpdateMode = false;
  @observable isUpdating = false;
  @observable isShowModal = false;
  @observable dataSource = [];
  @observable currentRow = undefined;
  @observable isFetchingCurrentRow = false;
  @observable isFetchingRowID = 0;
  @observable filter = {
    ...setDefaultDate('CreatedFrom', 'CreatedTo')
  };
  @observable pagination = defaultPagination;
  @observable order = [];
  @observable imageFileList = [];
  @observable documentFileList = [];
  @observable isExpandSearch = false;
  @observable selectedRowKeys = [];
  @observable isShowApprovedModal = false;
  @observable formatContent = `1`;
  @observable groupType = ``;
  @observable groupTypeValue = '';
  @observable postTitle = 'bài viết';
  @computed
  get createdDateSelected() {
    let {CreatedFrom, CreatedTo} = this.filter;
    if (CreatedFrom && CreatedTo) {
      return [CreatedFrom, CreatedTo];
    }
  }
  @action
  handleChangeFormat = (val) => {
    console.log('%c val', 'color: #00b33c', val)
    this.formatContent = val;
  }
  @action
  clear = () => {
    this.filter = {
      ...setDefaultDate('CreatedFrom', 'CreatedTo')
    };
    this.pagination = defaultPagination;
    this.dataSource = [];
    this.order = [];
    this.groupType = ``;
    this.groupTypeValue = ``;
    this.postTitle = 'bài viết';
  }
  @action
  setGroupType = (name, val, title) => {
    this.groupType = name;
    this.groupTypeValue = val;
    this.postTitle = title;
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
      query Posts($Page: Int = 1, $Limit: Int = 10, $Order: [Sort], $UserID: Int, $CreatedFrom: DateTime${filterDateTime(filter.CreatedFrom)}, $CreatedTo: DateTime${filterDateTime(filter.CreatedTo)}, $UpdatedFrom: DateTime${filterDateTime(filter.UpdatedFrom)}, $UpdatedTo: DateTime${filterDateTime(filter.UpdatedTo)}, $GroupType: EnumGroupType, $Query: String, $ApproveType: ApproveType, $GroupIds: [Int], $NotInGroupIds: [Int], $State: EnumState, $IsPin: Boolean) {
        Posts(Pageable: {Page: $Page, Limit: $Limit, Sorts: $Order}, UserID: $UserID, CreatedFrom: $CreatedFrom, CreatedTo: $CreatedTo, UpdatedFrom: $UpdatedFrom, UpdatedTo: $UpdatedTo, GroupType: $GroupType, Query: $Query, ApproveType: $ApproveType, GroupIds: $GroupIds, NotInGroupIds: $NotInGroupIds, State: $State, IsPin: $IsPin) {
            Items {
              ApproveType {
                Name
              }
              Content
              CreatedBy {
                Name
              }
              CreatedAt {
                Pretty
              }
              ID
              ContentFormat
              Images(Param: "150x") {
                ID
                Url
              }
              Documents {
                ID
                Title
                Url
              }
              Pin
              Group {
                ID
                Title
              }
              Title           
              UpdatedAt {
                Pretty
              }
              UpdatedBy {
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
      variables.UserID = filter.UserID;
      variables.GroupType = this.groupType || filter.GroupType;
      variables.Query = filter.Query;
      variables.ApproveType = filter.ApproveType;
      variables.GroupIds = filter.GroupIds;
      variables.NotInGroupIds = filter.NotInGroupIds;
      variables.State = filter.State;
      variables.IsPin = filter.IsPin;
    }
    this.fetching = true;

    return authRequest
      .post(apiUrl.GRAPH_URL, {
        query,
        variables
      }).then(action((result) => {
        const data = result.data.Posts;
        this.dataSource = data.Items;
        this.pagination = {
          ...pagination,
          total: data.Pager.TotalOfItems
        };
        this.order = order;
      })).catch(action(e => {
        errorMessage(e);
        throw e;
      })).finally(action(() => {
        this.fetching = false;
      }));
  };

  @action
  update = (id, data) => {
    this.isUpdating = true;
    return authRequest
      .put(apiUrl.UPDATE_POST_URL.replace(':id', id), data).then(action((result) => {
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
  deletePost = (id) => {
    this.isUpdating = true;
    return authRequest
      .delete(apiUrl.DELETE_POST_URL.replace(':id', id)).then(action((result) => {
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
      .post(apiUrl.CREATE_POST_URL, data).then(action((result) => {
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
  };

  @action
  showUpdateModal = (rowData) => {
    this.isShowModal = true;
    this.isUpdateMode = true;
    this.isFetchingRowID = rowData ? rowData.ID : null;
    this.formatContent = `${rowData.ContentFormat}`;
    this.currentRow = rowData;
    this.imageFileList = rowData ? this.formatFileList(rowData.Images) : [];
    this.documentFileList = rowData ? this.formatFileList(rowData.Documents) : [];
  };

  @action
  onCancelModal = () => {
    this.isShowModal = false;
    this.currentRow = null;
    this.isFetchingRowID = null;
    this.imageFileList = [];
    this.documentFileList = [];
    this.isShowApprovedModal = false;
    this.formatContent = `1`;
    this.groupType = null;
  };

  formatFileList = (fileList) => {
    if (isObservableArray(fileList) || Array.isArray(fileList)) {
      return fileList.map((val, idx) => {
        return {
          uid: idx,
          name: val.Title || val.Url,
          status: 'done',
          response: {
            files: [{
              ID: val.ID,
              url: val.Url,
            }]
          },
          url: val.Url,
        }
      });
    }
    return [];
  };

  @computed get imageFileListToJS() {
    return this.imageFileList.map(file => file);
  };

  @computed get documentFileListToJS() {
    return this.documentFileList.map(file => file);
  };

  getImageIDs = (data) => {
    let images = data ? data.Images : null;
    if (images && (isObservableArray(images) || Array.isArray(images))) {
      return images.map((val) => val.ID);
    }
    return [];
  };

  getDocumentIDs = (data) => {
    let documents = data ? data.Documents : null;
    if (documents && (isObservableArray(documents) || Array.isArray(documents))) {
      return documents.map((val) => val.ID);
    }
    return [];
  };

  onImagesChange = (fileList) => {
    this.imageFileList.replace(fileList);
  };

  onDocumentsChange = (fileList) => {
    this.documentFileList.replace(fileList);
  };

  @action
  onToggleExpandSearch = () => {
    this.isExpandSearch = !this.isExpandSearch;
  };

  onRowSelectionChange = (selectedRowKeys) => {
    this.selectedRowKeys.replace(selectedRowKeys);
  };

  @action
  editApproveType = (data) => {
    this.isUpdating = true;
    return authRequest
      .post(apiUrl.EDIT_APPROVE_TYPE_FOR_POST_URL, data).then(action((result) => {
        this.selectedRowKeys.clear();
        this.reload();
        return result;
      })).catch(action(e => {
        errorMessage(e);
        throw e;
      })).finally(action(() => {
        this.isUpdating = false;
      }));
  };

  @computed get countSelectedRowKeys() {
    if (isObservableArray(this.selectedRowKeys)) {
      return this.selectedRowKeys.toJS().length;
    }
    return 0;
  };

  @action
  showApprovedPostModal = () => {
    this.isShowApprovedModal = true;
  };

  @computed get getSelectedRowKeys() {
    if (isObservableArray(this.selectedRowKeys)) {
      return this.selectedRowKeys.toJS();
    }
    return [];
  };

  @action
  pinAPost = (data, id) => {
    this.isUpdating = true;
    return authRequest
      .post(apiUrl.PIN_A_POST_URL.replace(':id', id),{Pin: data ? 0 : 1}).then(action((result) => {
        this.reload();
        return result;
      })).catch(action(e => {
        errorMessage(e);
        throw e;
      })).finally(action(() => {
        this.isUpdating = false;
      }));
  };

}

export default new PostTableStore()