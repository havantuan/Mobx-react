import {action, observable, computed, isObservableArray} from 'mobx';
import {authRequest, errorMessage} from '../../request/index';
import apiUrl from "../../config/apiUrl";
import {successMessage} from "../../request/utils";
import {defaultPagination} from "../../config";
import routerStore from "../routerStore";
import ObjectPath from 'object-path';
import {convertToPagination, convertToSorter} from "../../helpers/utility";
import routerConfig from "../../config/router";

export class QuizStore {
  initialQuestions = [{
    id: 0,
    Answers: {
      uuid: 2,
      IDs: [0, 1]
    }
  }];
  questionUuid = 1;
  @observable filter = {};
  @observable dataSource = [];
  @observable fetching = false;
  @observable isUpdateMode = false;
  @observable isUpdating = false;
  @observable isCreating = false;
  @observable expandSearch = false;
  @observable order = [];
  @observable questions = this.initialQuestions;
  @observable pagination = defaultPagination;
  @observable singleData = {};

  @computed
  get dataSourceToJS() {
    return this.dataSource.map(val => val.toJS());
  }

  clear = () => {
    this.pagination = defaultPagination;
    this.order = [];
    this.filter = {};
    this.dataSource = [];
    this.questionUuid = 1;
    this.singleData = {};
    this.questions = this.initialQuestions;
  };
  @action
  reload = () => {
    this.fetch(this.filter, this.pagination, this.order)
  }
  @action
  fetch = (filter, pagination, order = []) => {
    let query = `
    query QuizzTable($Page: Int = 1, $Limit: Int = 10, $Order: [Sort], $Query: String, $State: EnumState) {
      Quizzes(Pageable: {Page: $Page, Limit: $Limit, Sorts: $Order}, Query: $Query, State: $State) {
        Items {
         Title
          ID
          CreatedAt {
            Pretty
          }
          TimeEnd {
            Pretty
          }
          TimeStart {
            Pretty
          }
          UpdatedAt {
            Pretty
          }
          State {
            Name
          }
        }
        Pager{
            Limit
            NumberOfPages
            Page
            TotalOfItems
        }
      }
    }
    `;
    let {pageSize, current} = pagination;

    let variables = {
      Page: current,
      Limit: pageSize,
      Order: order || null,
    };
    if (filter) {
      let {Query, State} = filter;
      variables.Query = Query || null;
      variables.State = State || null;
    }

    this.fetching = true;

    return authRequest
      .post(apiUrl.GRAPH_URL, {
        query,
        variables
      }).then(action((result) => {
        const data = result.data.Quizzes;
        this.pagination.total = data.Pager.TotalOfItems;
        this.dataSource = data.Items;
      })).catch(action(e => {
        errorMessage(e);
        throw e;
      })).finally(action(() => {
        this.fetching = false;
      }));
  };

  getAnswersQuestion = (questionID, id) => {
    let question = ObjectPath.get(this.singleData, 'Question.Items');
    if (isObservableArray(question)) {
      return question[questionID] && question[questionID].Answers && question[questionID].Answers[id];
    }
  };
  getCorrectsQuestion = (questionID, id) => {
    let question = ObjectPath.get(this.singleData, 'Question.Items');
    if (isObservableArray(question)) {
      return question[questionID] && question[questionID].Corrects && question[questionID].Corrects[id];
    }
  };

  getTitleQuestion = (idx) => {
    let question = ObjectPath.get(this.singleData, 'Question.Items');
    if (isObservableArray(question)) {
      return question[idx] && question[idx].Title;
    }
  };

  @action
  fetchByID = (id) => {
    let query = `
        query QuizByID($id: Int) {
          Quiz (ID: $id) {
            ID
            Title
            CreatedAt {
              Deadline
              ISO
              Pretty
            }
            Question {
              Items {
                Answers
                Corrects
                Title
              }              
            }
            State {
              Code
              Name
              Value
            }
            TimeEnd {
              Deadline
              ISO
              Pretty
            }
            TimeStart {
              Deadline
              ISO
              Pretty
            }
          }
        }
        `;

    let variables = {
      id
    };
    return authRequest
      .post(apiUrl.GRAPH_URL, {
        query,
        variables
      }).then(action((result) => {
        const data = result.data.Quiz;
        this.singleData = data;
        let question = ObjectPath.get(data, 'Question.Items');
        if (Array.isArray(question)) {
          this.questionUuid = question.length;
          let tmp = question.map((val, idx) => {
            return {
              id: idx,
              Answers: {
                uuid: val.Answers.length,
                IDs: [...Array(val.Answers.length).keys()]
              }
            }
          });
          this.questions.replace(tmp);
        }
      })).catch(action(e => {
        errorMessage(e);
        throw e;
      })).finally(action(() => {

      }));
  };
  @action
  onFilter = (filter) => {
    this.filter = filter;
    this.pagination = defaultPagination;
    return this.reload();
  };
  @action
  onToggleExpandSearch = () => {
    this.expandSearch = !this.expandSearch;
  }
  @action
  handleTableChange = (pagination, filters, sort) => {
    this.pagination = convertToPagination(pagination, this.pagination);
    this.order = convertToSorter(sort);
    this.reload();
  };
  @action
  createQuiz = (data) => {
    return authRequest
      .post(apiUrl.CREATE_QUIZ_URL, data).then(action((result) => {
        successMessage('Thêm bộ câu hỏi thành công!');
        routerStore.push(routerConfig.quiz);
        this.reload();
        return result
      })).catch(action(e => {
        errorMessage(e);
        throw e;
      })).finally(action(() => {
      }));
  };
  @action
  updateQuiz = (id, data) => {
    return authRequest
      .put(apiUrl.UPDATE_QUIZ_URL.replace(':id', id), data).then(action((result) => {
        successMessage('Cập nhật bộ câu hỏi thành công!')
        routerStore.push(routerConfig.quiz);
        this.reload();
        return result;
      })).catch(action(e => {
        errorMessage(e);
        throw e;
      })).finally(action(() => {
      }));
  }

  @action
  onChangeUpdateMode = (isUpdateMode = true) => {
    this.isUpdateMode = isUpdateMode;
  };

  removeQuiz = (questionID) => {
    // if (this.questions.length === 1) {
    //   return;
    // }
    let keys = this.questions.filter(key => key.id !== questionID);
    this.questions.replace(keys);
  };

  @action
  addQuiz = () => {
    let id = this.questionUuid;
    this.questions.push({
      id,
      Answers: {
        uuid: 2,
        IDs: [0, 1]
      }
    });
    this.questionUuid = id + 1;
  };

  @action
  removeAnswer = (answerID, questionID) => {
    let questionsTmp = this.questions.map(val => {
      if (val.id === questionID) {
        return {
          ...val,
          Answers: {
            ...val.Answers,
            IDs: val.Answers.IDs.filter(val => val !== answerID)
          }
        }
      }
      return val;
    });
    this.questions.replace(questionsTmp);
  };

  @action
  addAnswer = (questionID) => {
    let questionsTmp = this.questions.map(val => {
      let answerUuid = val.Answers.uuid;
      if (val.id === questionID) {
        return {
          ...val,
          Answers: {
            uuid: answerUuid + 1,
            IDs: [...val.Answers.IDs, answerUuid]
          }
        }
      }
      return val;
    });
    this.questions.replace(questionsTmp);
  };

}

export default new QuizStore();