import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {Icon, Menu, Dropdown, Button, Spin, Table} from 'antd';
import routerConfig from "../../../../config/router";
import PageHeaderLayout from "../../../../layouts/PageHeaderLayout";
import {inject, observer} from 'mobx-react';
import {Keys} from "../../../../stores";
import ContentHolder from "../../../../components/utility/ContentHolder";
import ObjectPath from "object-path";
import ScheduleTableControl from "./ScheduleTableControl";
import Permission from "../../../../permissions/index";
@inject(Keys.schedule, Keys.router)
@observer
export default class ScheduleTable extends Component {

  componentDidMount() {
    this.props.schedule.reload();
  }

  redirectToCreateSchedule = () => {
    this.props.router.push(routerConfig.createSchedule);
  };

  render() {
    const {dataSource, fetching} = this.props.schedule;

    const columns = [{
      title: '#',
      key: 'index',
      render: (text, record, index) => <span>{index + 1}</span>
    }, {
      title: 'Sự kiện',
      dataIndex: 'Title',
      key: 'Title',
      width: '500px',
      render: (text, record, index) => <span>{ObjectPath.get(record, "Title")}</span>
    }, {
      title: 'Tạo/Cập nhật',
      key: 'CreatedAt',
      dataIndex: 'CreatedAt',
      render: (text, record, index) =>
        <div>{ObjectPath.get(record, "CreatedAt.Pretty")} - {ObjectPath.get(record, "UpdatedAt.Pretty")}</div>

    },{
      title: 'Trạng thái',
      key: 'State',
      render: (text, record, index) => <span>{ObjectPath.get(record, "State.Name")}</span>
    }];
    if(Permission.allowUpdateSchedule()) {
      columns.push({
        title: 'Xử lý',
        dataIndex: '',
        key: 'action',
        render: (text, record, index) => {
          const menu = (
            <Menu>
              {/*<Menu.Item key="view">*/}
              {/*<a>*/}
              {/*<Icon type="eye-o"/> Xem*/}
              {/*</a>*/}
              {/*</Menu.Item>*/}
              <Menu.Item key="edit">
                <Link to={routerConfig.updateSchedule.replace(":id", record.ID)}>
                  <Icon type="edit"/> Chỉnh sửa
                </Link>
              </Menu.Item>
              {/*<Menu.Item key="delete">*/}
              {/*<Popconfirm*/}
              {/*title="Bạn có chắc chắn xóa bộ câu hỏi không?"*/}
              {/*onConfirm={() => this.deleteSchedule(record.ID)}*/}
              {/*okText="Có"*/}
              {/*cancelText="Không"*/}
              {/*>*/}
              {/*<a href="#">*/}
              {/*<Icon type='delete'/> Xoá*/}
              {/*</a>*/}
              {/*</Popconfirm>*/}
              {/*</Menu.Item>*/}
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
      });
    }

    return (
      <PageHeaderLayout title={'Danh sách sự kiện'}>
        <ContentHolder>
          <ScheduleTableControl/>

          <div style={{marginTop: 16}}>
            <Spin spinning={fetching}>
              <Table
                dataSource={dataSource.slice()}
                columns={columns}
                rowKey={record => record.ID}
                pagination={this.props.schedule.pagination}
                onChange={this.props.schedule.handleTableChange}
              />
            </Spin>
          </div>
        </ContentHolder>
      </PageHeaderLayout>
    );
  }
}
