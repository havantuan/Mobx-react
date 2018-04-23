import {action, observable} from 'mobx';
import {authRequest, errorMessage} from '../../request/index';
import apiUrl from "../../config/apiUrl";
import memoize from 'memoizee';

export class RoleProviderStore {

  @observable dataSource = [];
  @observable fetching = false;

  @action
  getDataSource = (filter) => {
    this.cacheFetch(filter).then(action((result) => {
      this.dataSource = result.data.Roles;
    })).catch(action(e => {
      errorMessage(e);
      throw e;
    })).finally(action(() => {
      this.fetching = false;
    }));
  };

  @action
  cacheFetch = memoize((filter) => {
    let query = `
      query Roles($RoleType:  EnumRoleType) {
        Roles (RoleType: $RoleType) {
          ID
          Name
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
      });
  }, {length: 5, promise: true});

}

export default new RoleProviderStore();