import {action, observable} from 'mobx';
import {authRequest, errorMessage} from '../../request/index';
import apiUrl from "../../config/apiUrl";

export class UserProviderStore {
  @observable dataSource = [];
  @observable fetching = false;

  @action
  fetch = (filter) => {
    let query = `
        query Users($Page: Int, $Limit: Int, $Query: String) {
            Users(Pageable: {Page: $Page, Limit: $Limit}, Query: $Query) {
                Items {
                  ID
                  Code
                  Name
                  Phone
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
        this.dataSource = result.data.Users.Items;
      })).catch(action(e => {
        errorMessage(e);
        throw e;
      })).finally(action(() => {
        this.fetching = false;
      }));
  };

}

export default new UserProviderStore();