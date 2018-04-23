import React from 'react';
import {Modal, Table} from 'antd';
import ObjectPath from "object-path";
import {inject, observer} from 'mobx-react';
import {Keys} from "../../../../stores/index";

@inject(Keys.user, Keys.role)
@observer
export default class EditRole extends React.Component {

  constructor(props) {
    super(props);
    this.user = props.user;
    this.role = props.role;
  }

  componentDidMount() {
    this.role.fetch({RoleType: 'System'});
  }

  handleSubmit = () => {
    let staffID = ObjectPath.get(this.user, 'isFetchingRowID');
    this.role.grantRoleByStaffID(staffID).then(() => {
      this.user.closeModal();
      this.user.reload();
    });
  };

  onSelectChange = (selectedRowKeys) => {
    this.role.onSelectedChange(selectedRowKeys);
  };

  render() {
    let {selectedRowKeys, dataSource} = this.role;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };

    const columns = [{
      title: 'Tên vai trò',
      dataIndex: 'Name',
      key: 'Name',
      render: (text, record, index) => <a>{text}</a>,
    }, {
      title: 'Mã vai trò',
      dataIndex: 'Code',
      key: 'Code',
    }];

    return (
      <Modal
        title="Danh sách vai trò"
        visible={this.user.isShowRoleModal}
        onOk={this.handleSubmit}
        onCancel={this.user.closeModal}
      >
        <Table
          scroll={{y: 400}}
          size={'small'}
          pagination={false}
          rowSelection={rowSelection}
          columns={columns}
          dataSource={dataSource.slice()}
          rowKey={(record, index) => record.ID}
        />
      </Modal>
    );
  }
}