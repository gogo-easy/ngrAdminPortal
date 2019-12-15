import {Button, Table} from 'antd';
import React, { Component } from 'react';

import { SetLimit } from "./edit_gateway";
import { AddGateway } from "./add_gateway";

const genCol = () => [
  {
    title: '序号',
    dataIndex: 'index',
    key: 'index',
    width: "50px",
    align: 'center'
  }, {
    title: '网关编码',
    dataIndex: 'gateway_code',
    key: 'gateway_code',
    width: "150px",
    align: 'center'

  }, {
    title: '网关描述',
    dataIndex: 'gateway_desc',
    key: 'gateway_desc',
    width: "150px",
    align: 'center'

  }, {
    title: 'QPS限流阈值(单机)',
    dataIndex: 'limit_count',
    key: 'limit_count',
    width: "150px",
    align: 'center'

  }, {
    title: '操作',
    key: 'action',
    width: "50px",
    align: 'center',
    render: (text, record) => {
      return (
        <span>
          <SetLimit info={record}></SetLimit>
        </span >
      )
    }
  }];

export class GateWayList extends Component {

  constructor(props) {
    super(props)
  }

  render() {
    let pagenationObj = {
      pageSize: 5,
      total: this.props.gateWayList ? this.props.gateWayList.length : 0,
      showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`

    };


    return (
      <div style={{ marginTop: 20, padding:'20px' }} >
        <AddGateway />
        <Table
          columns={genCol()}
          className="log_list"
          pagination={pagenationObj}
          bordered
          title={() => (<h2 style={{ textAlign: "center" }}>网关列表</h2>)}
          dataSource={this.props.gateWayList} />
      </div>

    )
  }
}
