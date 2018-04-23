import {action, observable} from 'mobx';
import {authRequest, errorMessage} from '../../request/index';
import apiUrl from "../../config/apiUrl";
import memoize from 'memoizee';

export class HubProviderStore {

  @observable dataSource = [];
  @observable fetching = false;

  @action
  getDataSource = (filter) => {
    this.cacheFetch(filter).then(action((result) => {
      this.dataSource = result.data.Hubs.Items;
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
        query Hubs($State: EnumState) {
          Hubs(State: $State) {
            Items {
              ID
              DisplayName
              Name
            }
          }
        }
    `;
    let variables = {};
    if (filter) {
      let {State} = filter;
      variables.State = State || null;
    }
    this.fetching = true;

    return authRequest
      .post(apiUrl.GRAPH_URL, {
        query,
        variables
      });
  }, {length: 5, promise: true})

}

export default new HubProviderStore();