import {action, observable} from 'mobx';
import {authRequest, errorMessage} from '../../request/index';
import apiUrl from "../../config/apiUrl";

export class GroupProviderStore {
  @observable dataSource = [];
  @observable fetching = false;

  @action
  fetch = (filter) => {
    let query = `
      query Groups($Page: Int, $Limit: Int, $Query: String, $GroupType: EnumGroupType) {
          Groups(Pageable: {Page: $Page, Limit: $Limit}, Query: $Query, GroupType: $GroupType) {
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
      let {Query, GroupType} = filter;
      variables.GroupType = GroupType || null;
      variables.Query = Query || null;
    }

    return authRequest
      .post(apiUrl.GRAPH_URL, {
        query,
        variables
      }).then(action((result) => {
        this.dataSource = result.data.Groups.Items;
      })).catch(action(e => {
        errorMessage(e);
        throw e;
      })).finally(action(() => {
        this.fetching = false;
      }));
  };

}

export default new GroupProviderStore();