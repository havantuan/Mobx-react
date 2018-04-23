import {action, observable} from 'mobx';
import {authRequest, errorMessage} from '../../request/index';
import apiUrl from "../../config/apiUrl";

export class GroupAwardProviderStore {
  @observable dataSource = [];
  @observable fetching = false;

  @action
  fetch = (filter) => {
    let query = `
      query AwardGroups($Page: Int, $Limit: Int, $Query: String) {
          AwardGroups(Pageable: {Page: $Page, Limit: $Limit}, Query: $Query) {
            Items {
              ID
              Title
            }
          }
      }
    `;
    let variables = {
      Page: 1,
      Limit: 30
    };
    if (filter) {
      let {Query} = filter;
      variables.Query = Query || null;
    }

    return authRequest
      .post(apiUrl.GRAPH_URL, {
        query,
        variables
      }).then(action((result) => {
        this.dataSource = result.data.AwardGroups.Items;
      })).catch(action(e => {
        errorMessage(e);
        throw e;
      })).finally(action(() => {
        this.fetching = false;
      }));
  };

}

export default new GroupAwardProviderStore();