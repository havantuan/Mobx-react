import React from 'react';
import {Button, Dropdown, Icon, Menu, Popconfirm, Spin, Table} from 'antd';
import PageHeaderLayout from "../../../../layouts/PageHeaderLayout";
import ContentHolder from "../../../../components/utility/ContentHolder";
import moment from "moment";
import {Link} from "react-router-dom";
import routerConfig from "../../../../config/router";
import {inject, observer} from 'mobx-react';
import {Keys} from "../../../../stores";

@inject(Keys.router, Keys.document)
@observer
export default class DocumentTable extends React.Component {

  redirectToCreateDocument = () => {
    this.props.router.push(routerConfig.createDocument);
  };

  render() {
    const columns = [{
      title: '#',
      dataIndex: '',
      key: 'index',
      render: (text, record, index) => <span>{index + 1}</span>
    }, {
      title: 'Tiêu đề',
      dataIndex: 'news.titleText',
      key: 'title',
      width: '30%'
    }, {
      title: 'Ảnh',
      dataIndex: 'news',
      key: 'image',
      width: 100,
      render: (text, record, index) => <img style={{maxWidth: '100%'}} src={text.image} alt={text.titleText}/>
    }, {
      title: 'Người đăng',
      dataIndex: 'userPost',
      key: 'userPost',
      render: (text, record, index) => <span>User</span>
    }, {
      title: 'Tag',
      dataIndex: 'tags',
      key: 'tags'
    }, {
      title: 'Ngày đăng',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (text, record, index) => <span>{moment({text}).format('DD/MM/YYYY')}</span>
    }, {
      title: 'Xử lý',
      dataIndex: '',
      key: 'action',
      render: (text, record, index) => {
        const menu = (
          <Menu>
            <Menu.Item key="view">
              <a>
                <Icon type="eye-o"/> Xem
              </a>
            </Menu.Item>
            <Menu.Item key="edit">
              <Link to={'#'}>
                <Icon type="edit"/> Chỉnh sửa
              </Link>
            </Menu.Item>
            <Menu.Item key="delete">
              <Popconfirm
                title="Bạn có chắc chắn muốn xóa không?"
                onConfirm={() => {
                }}
                okText="Có"
                cancelText="Không"
              >
                <a href="#">
                  <Icon type="close"/> Xoá
                </a>
              </Popconfirm>
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
    }];

    return (
      <PageHeaderLayout title={'Danh sách tài liệu'}>
        <ContentHolder>
          <div style={{textAlign: 'right', marginBottom: 16}}>
            <Button
              icon="plus"
              type="primary"
              onClick={this.redirectToCreateDocument}
            >
              Thêm tài liệu mới
            </Button>
          </div>

          <Spin spinning={false}>
            <Table
              dataSource={[]}
              columns={columns}
              rowKey={(record, index) => index}
              pagination={false}
            />
          </Spin>
        </ContentHolder>
      </PageHeaderLayout>
    )
  }

}