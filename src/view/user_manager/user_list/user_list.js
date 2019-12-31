import { Table, Divider, Tag, Pagination, Button, Popover } from 'antd';
import React, { Component } from 'react';
import { UserInfoEdit } from "./edit_user";
import Enable from "./enable_user";


const genCol = (trigger) => [
  {
    title: '序号',
    dataIndex: 'index',
    key: 'index',
    width: "50px",
    align: 'center'
  }, {
    title: '用户名',
    dataIndex: 'username',
    key: 'username',
    width: "150px",
    align: 'center'

  }, {
    title: '手机',
    dataIndex: 'mobile',
    key: 'mobile',
    width: "150px",
    align: 'center'

  }, {
    title: '邮箱',
    dataIndex: 'email',
    key: 'email',
    width: "150px",
    align: 'center'

  }, {
    title: '当前状态',
    key: 'enable',
    width: "100px",
    align: 'center',
    render(text, record) {
      const { enable } = record;

      return (
        <span style={{ color: enable === 1 ? "green" : "red" }}>{enable === 1 ? "启用" : "禁用"}</span>
      )
    }

  }, {
    title: '操作',
    key: 'action',
    align: 'center',
    render: (text, record) => (
      <div style={{width:'130px'}}>
        <Enable {...record}></Enable>

        <Divider type="vertical"></Divider>
        <UserInfoEdit buttonName="修改" size="small" title="修改用户" editStatus={true} userInfo={record} trigger={trigger}></UserInfoEdit>
      </div>
    ),
  }];




export class UserList extends Component {

  render() {
    let pagenationObj = {
      pageSize: 10,
      total: this.props.userInfos.length,
      showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`

    };

    const trigger = this.props.modifyUser;
    return (
      <div style={{ marginTop: 20 }}>

        <Table
          columns={genCol(trigger)}
          className="user_list"
          pagination={pagenationObj}
          bordered
          dataSource={this.props.userInfos}
          title={() => (<h2 style={{ textAlign: "center" }}>用户信息表</h2>)}
        />
      </div>

    )
  }
}