import {action, observable} from "mobx";
import {authRequest, errorMessage} from '../../request';
import apiUrl from '../../config/apiUrl';
import {defaultPagination} from "../../config";
import {convertToPagination} from "../../helpers/utility";
import {successMessage} from "../../request/utils";
import appStore from "../appStore";
import ObjectPath from "object-path";
export class CheckinDetail {
  @observable fetching = false;
  @observable dataSource = {};
  @observable checkInData = [];
  @observable filter = {};
  @observable pagination = defaultPagination;
  @observable order = [];
  @observable isExpandSearch = false;
  @action
  clear = () => {
    this.dataSource = {};
    this.fetching = false;
    this.filter = {};
    this.pagination = defaultPagination;
    this.order = [];
    this.checkInData = [];
  }
  @action
  reload = (id) => {
    this.fetchByID(id, this.filter, this.pagination, this.order);
  }
  @action
  handleTableChange = (code, pagination, filters, sort) => {
    this.pagination = convertToPagination(pagination, this.pagination);
    this.reload(code);
  };
  @action
  checkInUser = (code, user_code) => {
    return authRequest
      .post(apiUrl.CHECK_IN_URL.replace(':check-id', code).replace(':user-code', user_code)).then(action((result) => {
        successMessage('CheckIn thành công')
        this.reload(code);
        return result;
      })).catch(action(e => {
        errorMessage(e);
        throw e;
      })).finally(action(() => {
      }));
  }
  @action
  toggleExpandSearch = () => {
    this.isExpandSearch = !this.isExpandSearch;
  }
  @action
  checkSeat = (code, data) => {
    return authRequest
      .post(apiUrl.CHECK_SEATS_URL.replace(':id', code), {CheckinItems: data}).then(action((result) => {
        successMessage('Tạo ghế thành công')
        this.reload(code);
        return result;
      })).catch(action(e => {
        errorMessage(e);
        throw e;
      })).finally(action(() => {
      }));
  }
  @action
  onFilter = (code, filter) => {
    this.filter = filter;
    this.pagination = defaultPagination;
    return this.reload(code);
  };
  @action
  fetchByID = (id, filter, pagination, order = []) => {
    let query = `
          query DataSource($id: Int, $Page: Int, $Limit: Int, $Order: [Sort], $State: EnumState, $Query: String, $NotInHubIDs: [Int], $HubIDs: [Int]) {
                Checkin(ID: $id) {
                  ID
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
                  Title
                  State {
                    Code
                    Name
                  }
                  CheckinItems (Pageable: {Page: $Page, Limit: $Limit, Sorts: $Order}, State: $State, Query: $Query, NotInHubIDs: $NotInHubIDs,HubIDs: $HubIDs) {
                    Items {                  
                      Seat                      
                      User {
                        Hub {
                          Name
                        }
                       ID
                       Name
                       Code 
                       Avatar{            
                        Thumb(Param: "100x") {
                          Url
                        }            
                        }
                      }
                    CheckInDate {                    
                      Pretty
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
            }
        `;

    let variables = {id};
    if (filter) {
      let {State, Query, NotInHubIDs,HubIDs} = filter;
      variables.State = State || null;
      variables.Query = Query || null;
      variables.NotInHubIDs = NotInHubIDs || null;
      variables.HubIDs = HubIDs || null;

    }
    this.fetching = true;
    return authRequest
      .post(apiUrl.GRAPH_URL, {
        query,
        variables
      }).then(action((result) => {
        this.dataSource = result.data.Checkin;
        this.checkInData = result.data.Checkin.CheckinItems.Items;
        this.fetching = false;
        this.filter = filter;
        this.pagination = pagination;
        this.order = order;
      })).catch(action(e => {
        errorMessage(e);
        throw e;
      })).finally(action(() => {
      }));
  };

  onChangeSeat = (value, id) => {
    let tmp = this.checkInData && this.checkInData.map(val => {
      if (val && val.User && val.User.ID === id) {
        return {
          ...val,
          Seat: value
        }
      }
      return val;
    })
    this.checkInData.replace(tmp);
  }
  addSeat = (code) => {
    let data = [];
    this.checkInData && this.checkInData.forEach(val => {
      if (val && val.User && val.User.ID && val.Seat.trim().length > 0) {
        let credentials = {
          SeatNumber: val.Seat.trim(),
          UserID: +val.User.ID
        };
        data.push(credentials);


      }
    });
     this.checkSeat(code, data);
  }
  exportCheckIn = (code, data) => {
    window.open(apiUrl.EXPORT_CHECKIN_ITEM_URL.replace(':id', code) + `?access_token=` + appStore.token + `&query=` + encodeURIComponent(JSON.stringify(data)));
  }
}

export default new CheckinDetail()