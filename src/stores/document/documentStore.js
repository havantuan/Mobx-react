import {action, observable, computed} from 'mobx';
import {authRequest, errorMessage} from '../../request/index';
import apiUrl from "../../config/apiUrl";

export class DocumentStore {
  @observable filter = {};
  @observable dataSource = [];
  @observable fetching = false;
  @observable isUpdateMode = false;
  @observable isUpdating = false;
  @observable isCreating = false;
  @observable order = [];

  @computed
  get dataSourceToJS() {
    return this.dataSource.map(val => val.toJS());
  }

  clear = () => {
    this.filter = {};
    this.dataSource = [];
  };

  @action
  editDocument = (id, data) => {
    this.isUpdating = true;
    return authRequest
      .post(apiUrl.EDIT_DOCUMENT_URL.replace(':id', id), data).then(action((result) => {
        return result;
      })).catch(action(e => {
        errorMessage(e);
        throw e;
      })).finally(action(() => {
        this.isUpdating = false;
      }));
  };

  @action
  onChangeUpdateMode = (isUpdateMode = true) => {
    this.isUpdateMode = isUpdateMode;
  };

}

export default new DocumentStore();