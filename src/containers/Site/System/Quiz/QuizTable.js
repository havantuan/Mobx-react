import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {Icon, Menu, Dropdown, Button, Spin, Table} from 'antd';
import routerConfig from "../../../../config/router";
import PageHeaderLayout from "../../../../layouts/PageHeaderLayout";
import {inject, observer} from 'mobx-react';
import {Keys} from "../../../../stores";
import ContentHolder from "../../../../components/utility/ContentHolder";
import ObjectPath from "object-path";
import QuizTableControl from "./QuizTableControl";
import Permission from "../../../../permissions/index";
@inject(Keys.quiz, Keys.router)
@observer
export default class QuizTable extends Component {

  componentDidMount() {
    this.props.quiz.reload();
  }

  redirectToCreateQuiz = () => {
    this.props.router.push(routerConfig.createQuiz);
  };

  render() {
    const {dataSource, fetching} = this.props.quiz;

    const columns = [{
      title: '#',
      key: 'index',
      render: (text, record, index) => <span>{index + 1}</span>
    }, {
      title: 'Bộ câu hỏi',
      dataIndex: 'Title',
      key: 'Title',
    }, {
      title: 'Thời gian',
      key: 'TimeStart',
      render: (text, record, index) =>
        <div>{ObjectPath.get(record, "TimeStart.Pretty")} - {ObjectPath.get(record, "TimeEnd.Pretty")}</div>
    },{
      title: 'Tạo/Cập nhật',
      key: 'CreatedAt',
      render: (text, record, index) =>
        <div>{ObjectPath.get(record, "CreatedAt.Pretty")} - {ObjectPath.get(record, "UpdatedAt.Pretty")}</div>
    },{
      title: 'Trạng thái',
      key: 'State',
      render: (text, record, index) => <span>{ObjectPath.get(record, "State.Name")}</span>
    }];
    if(Permission.allowUpdateQuizz()) {
      columns.push({
        title: 'Xử lý',
        dataIndex: '',
        key: 'action',
        render: (text, record, index) => {
          const menu = (
            <Menu>
              <Menu.Item key="edit">
                <Link to={routerConfig.updateQuiz.replace(":id", record.ID)}>
                  <Icon type="edit"/> Chỉnh sửa
                </Link>
              </Menu.Item>
            </Menu>
          );

          return (
            <Dropdown overlay={menu} trigger={['click']}>
              <Button
                icon="ellipsis"
                size="small"
              >
                Hành động
              </Button>
            </Dropdown>
          );
        }
      })
    }

    return (
      <PageHeaderLayout title={'Danh sách câu hỏi'}>
        <ContentHolder>
          <QuizTableControl/>

          <div style={{marginTop: 16}}>
            <Spin spinning={fetching}>
              <Table
                dataSource={dataSource.slice()}
                columns={columns}
                rowKey={record => record.ID}
                pagination={this.props.quiz.pagination}
                onChange={this.props.quiz.handleTableChange}
              />
            </Spin>
          </div>
        </ContentHolder>
      </PageHeaderLayout>
    );
  }
}
