import {action, observable} from "mobx";

export class FileManagerStore {

  dataSource = [];
  @observable selectedFiles = [];

  @action
  onResourceChildrenChange = (resourceChildren) => {
    this.dataSource = resourceChildren;
    console.log('%c resource children...', 'background: #009900; color: #fff', resourceChildren)
  };

  onSelectionChange = (IDs) => {
    let files = [];
    if (Array.isArray(IDs) && IDs.length > 0) {
      files = this.dataSource.filter(file => IDs.find(id => id === file.id) !== undefined);
    }
    this.selectedFiles.replace(files);
    console.log('%c selectedFiles...', 'background: #009900; color: #fff', this.selectedFiles.toJS())
  };

}

export default new FileManagerStore()