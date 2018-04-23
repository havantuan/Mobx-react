import {action, observable} from "mobx";
import {authRequest, errorMessage} from '../../request';
import apiUrl from '../../config/apiUrl';
import {defaultPagination} from '../../config';
import {convertToPagination, convertToSorter} from '../../helpers/utility';
import ObjectPath from 'object-path';

export class MyNotificationsStore {

  @observable fetching = false;
  @observable dataSource = [];
  @observable filter = {};
  @observable pagination = defaultPagination;
  @observable order = [];

  @action
  reload = () => {
    this.fetch(this.filter, this.pagination, this.order)
  };

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
        query MyNotifications($Page: Int = 1, $Limit: Int = 10, $Order: [Sort], $Query: String, $AppType: EnumAppType, $IsPush: Boolean) {
          Me {
            Notifications(Pageable: {Page: $Page, Limit: $Limit, Sorts: $Order}, Query: $Query, AppType: $AppType, IsPush: $IsPush) {
              Items {
                Body
                JsonContent
                Title
                CreatedAt {
                  Deadline
                  ISO
                  Pretty
                }
                Date {
                  Deadline
                  ISO
                  Pretty
                }
                ID
              }
              Pager {
                Limit
                NumberOfPages
                Page
                TotalOfItems
              }
            }
          }
        }
    `;
    let {pageSize, current} = pagination;
    let variables = {
      Page: current,
      Limit: pageSize,
      Order: order || null,
      IsPush: true
    };
    if (filter) {
      let {AppType, Query} = filter;
      variables.Query = Query || null;
      variables.AppType = AppType || null;
    }
    this.fetching = true;

    return authRequest
      .post(apiUrl.GRAPH_URL, {
        query,
        variables
      }).then(action((result) => {
        const keys = ObjectPath.get(result, 'data.Me.Notifications', {});
        this.dataSource = keys.Items;
        this.pagination = {
          ...pagination,
          total: keys.Pager ? keys.Pager.TotalOfItems : 0
        };
      })).catch(action(e => {
        errorMessage(e);
        throw e;
      })).finally(action(() => {
        this.fetching = false;
      }));
  };

  @action
  clear = () => {
    this.dataSource = [];
    this.filter = {};
    this.pagination = defaultPagination;
    this.order = [];
  };

}

export default new MyNotificationsStore()