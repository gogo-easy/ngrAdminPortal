import { Table, Divider, Tag, Pagination } from 'antd';
import React, { Component } from 'react';
import { LogPane } from './log_pane'



const genCol = () => [
  {
    title: '序号',
    dataIndex: 'index',
    key: 'index',
    width: "50px",
    align: 'center'
  }, {
    title: '操作用户',
    dataIndex: 'username',
    key: 'username',
    width: "150px",
    align: 'center'

  }, {
    title: '操作时间',
    dataIndex: 'create_at',
    key: 'create_at',
    width: "150px",
    align: 'center'

  }, {
    title: '操作类型',
    dataIndex: 'remark',
    key: 'remark',
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
          <LogPane log={record}></LogPane>
        </span >
      )
    }
  }];

export class LogList extends Component {

  constructor(props) {
    super(props)
  }

  render() {
    let pagenationObj = {
      pageSize: 5,
      total: this.props.logs.length,
      showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`

    };


    return (
      <div style={{ marginTop: 20 }}>
        <h2 style={{ textAlign: "center" }}>操作记录日志</h2>
        <Table columns={genCol()} className="log_list" pagination={pagenationObj} bordered dataSource={this.props.logs} />
      </div>

    )
  }
}