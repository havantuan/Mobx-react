import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {Card, Col, Row, Spin, Table, Tag, Icon, Form, Button, Input} from 'antd';
import LayoutWrapper from '../../../../components/utility/layoutWrapper';
import basicStyle from '../../../../config/basicStyle';
import './css/Style.css';
import ObjectPath from "object-path";
import {inject, observer} from "mobx-react";
import {Keys} from '../../../../stores/index';
import PageHeaderLayout from "../../../../layouts/PageHeaderLayout";
import ContentHolder from "../../../../components/utility/ContentHolder";
import DetailCheckInControl from "./DetailCheckInControl";
import Permission from "../../../../permissions/index";
import TotalRecord from "../../../../components/TotalRecord/index";

@Form.create()
@inject(Keys.router, Keys.checkInDetail)
@withRouter
@observer
export default class CheckInDetail extends Component {


  constructor(props) {
    super(props);
    this.code = this.props.match.params.code
  }

  componentWillUnmount() {
    this.props.checkInDetail.clear();
  }

  componentDidMount() {
    this.props.checkInDetail.fetchByID(this.code);
  }

  render() {
    const {rowStyle, colStyle, gutter} = basicStyle;
    let {dataSource, fetching, checkInData} = this.props.checkInDetail;
    let columns = [
      {
        title: 'Ghế',
        dataIndex: 'Seat',
        key: 'Seat',
        width: '150px',
        render: (text, record, index) =>
          <Input value={text}
                 onChange={(e) => this.props.checkInDetail.onChangeSeat(e.target.value, ObjectPath.get(record, 'User.ID'))}/>
      }, {
        title: 'Avatar',
        key: 'Avatar',
        width: 100,
        render: (text, record, index) => <img src={ObjectPath.get(record, "User.Avatar.Thumb.Url")}
                                              style={{maxWidth: '100%', height: '100'}}/>
      }, {
        title: 'Người',
        dataIndex: 'User',
        key: 'User',
        render: (text, record, index) =>
          <div>
            <Tag color="blue">
              {ObjectPath.get(record.User, "Code")}
              - {ObjectPath.get(record.User, "Name")}
            </Tag>
            <div>{ObjectPath.get(record.User, "Phone")}</div>
            <div>{ObjectPath.get(record.User, "Email")}</div>
          </div>
      }, {
        title: 'Thành Đoàn',
        key: 'Hub',
        width: '300',
        render: (text, record, index) => <div>{ObjectPath.get(record.User, "Hub.Name")}</div>
      }, {
        title: 'Thời gian CheckIn',
        key: 'CheckInDate',
        render: (text, record, index) => <span>{ObjectPath.get(record, "CheckInDate.Pretty")}</span>
      },{
      title: 'Vị trí ghế',
        key: 'SeatUser',
        render: (text, record, index) => <a href={`/static/Slide/vi-tri-cua-toi.html?myseat=${ObjectPath.get(record, "Seat")}`} target="_blank">{ObjectPath.get(record, "Seat")}</a>
      }];
    if (Permission.allowUpdateCheckIn()) {
      columns.push({
        title: 'Điểm danh',
        key: 'CheckIn',
        render: (text, record, index) => <div>
          <Button
            style={basicStyle.greenBg}
            onClick={() => this.props.checkInDetail.checkInUser(this.code, ObjectPath.get(record, "User.Code"))}
            disabled={!Permission.allowUpdateCheckIn()}
          >
            <Icon type="check"/>Điểm danh</Button></div>
      });
    }
    return (
      <LayoutWrapper>
        <Row style={{...rowStyle, marginRight: 0}} gutter={gutter} justify="start">
          <Col md={24} sm={24} xs={24} style={colStyle}>
            <PageHeaderLayout title={'Danh sách điểm danh'}>
              <ContentHolder>
                <div>
                  <Card title={"Chi tiết"}>
                    <Spin spinning={fetching || false}>
                      <Row justify={"start"} type={"flex"} align={"top"}>
                        <Col sm={12} xs={24}>
                          <div className={"pickingList-detail"}>
                            <div className={"row-detail"}>
                              <div>Mã điểm danh</div>
                              <div>
                                <Tag color={"purple"}>{ObjectPath.get(dataSource, "ID")}</Tag>
                              </div>
                            </div>
                            <div className={"row-detail"}>
                              <div>Thời gian</div>
                              <div>
                                {`${ObjectPath.get(dataSource, "Date.Pretty")}`}
                              </div>
                            </div>

                          </div>
                        </Col>
                        <Col sm={12} xs={24}>
                          <div className={"pickingList-detail"}>
                            <div className={"row-detail"}>
                              <div>Tiêu đề</div>
                              <div>
                                {(ObjectPath.get(dataSource, "Title"))}
                              </div>
                            </div>
                            <div className={"row-detail"}>
                              <div>Trạng thái</div>
                              <div>
                                {ObjectPath.get(dataSource, "State.Name")}
                              </div>
                            </div>
                          </div>
                        </Col>
                      </Row>
                    </Spin>
                  </Card>
                </div>
                <div style={{paddingTop: '10px'}}>
                  <DetailCheckInControl/>
                </div>
                <Spin spinning={fetching || false}>
                  <Table
                    bordered={true}
                    dataSource={checkInData ? checkInData.slice() : []}
                    columns={columns}
                    rowKey={record => ObjectPath.get(record, "User.ID")}
                    onChange={(pagination, filters, sort) => this.props.checkInDetail.handleTableChange(this.code, pagination, filters, sort)}
                  />
                </Spin>
              </ContentHolder>
            </PageHeaderLayout>
          </Col>
        </Row>
      </LayoutWrapper>
    )
  }

}

