import {action, observable} from 'mobx';
import {authRequest, errorMessage} from '../../request/index';
import apiUrl from "../../config/apiUrl";
import memoize from 'memoizee';

export class EnumProviderStore {

  @observable dataSource = [];
  @observable fetching = false;

  @action
  getDataSource = () => {
    this.cacheFetch().then(action((result) => {
      this.dataSource = result.data.Enum;
    })).catch(action(e => {
      errorMessage(e);
      throw e;
    })).finally(action(() => {
      this.fetching = false;
    }));
  };

  @action
  cacheFetch = memoize(() => {
    let query = `
        query Enum {
          Enum {            
            ActionTypes {
              Code
              Name
              Value
            }
            AppTypes {
              Code
              Name
              Value
            }
            States {
              Code
              Value
              Name      
            }
            Scopes {
              Code
            
              Name      
            }
            HubTypes {
              Code
              Name
              Value
            }
            UserTypes{
              Code
              Value
              Name      
            }
            NotificationTypes {
              Code
              Name
              Value
            }
            RoleTypes {
              Code
              Name
              Value
            }
            Accessibilities {
              Code
              Value
              Name
            }
            GroupAccessibilities {
              Code
              Value
              Name
            }
            GroupTypes {
              Code
              Name
              Value
            }
            ApproveType {
              Code
              Name
              Value
            }
          }
        }
    `;

    this.fetching = true;

    return authRequest
      .post(apiUrl.GRAPH_URL, {
        query
      });
  }, {length: 5, promise: true})

}

export default new EnumProviderStore();