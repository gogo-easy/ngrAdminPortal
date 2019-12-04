import React, { Component } from 'react'
import BaseView from '../../../core/view.base'
import { notification } from 'antd';

import SearchBar from "./search_bar";
import { UserList } from "./user_list";

import {
  UserListModel,
  UserAddModel,
  UserModifyModel
} from '../../../models/user_manage_models';
import { eventBus } from './events';

const userListModelInstance = UserListModel.getInstance();
const userAddModelInstance = UserAddModel.getInstance();
const userModifyModelInstance = UserModifyModel.getInstance();

const trim = val => val && val.trim() ? val.trim() : undefined

class UserListView extends BaseView {

  state = {
    userLists: []
  }



  componentDidMount() {

    eventBus.on("findAll", this.findAll);
    // 初始化数据

    setTimeout(() => {
      this.findAll();
    }, 100);
  }
  
  componentWillMount() {
    eventBus.off("findAll");
  }




  // 添加用户
  addUser = (values, hide) => {

    const { username, mobile, password, email, superior } = values;

    userAddModelInstance.setParam({
      username: trim(username),
      mobile: trim(mobile),
      password: trim(password),
      email: trim(email),
      superior: trim(superior),

    }, true)

    userAddModelInstance.excute(res => {

      if (res["success"]) {

        notification.open({
          message: '新用户创建成功',
          description: ''
        });
        setTimeout(() => {
          hide();
          this.findAll()
        }, 1000);

      }
    }, err => {
      notification.open({
        message: '创建失败',
        description: err["msg"]
      });
    })
  }
  // 修改用户
  modifyUser = (values, hide) => {
    const { id, username, mobile, email, superior } = values;

    userModifyModelInstance.setParam({
      username: trim(username),
      mobile: trim(mobile),
      email: trim(email),
      superior: trim(superior),
      id

    }, true)

    userModifyModelInstance.excute(res => {

      if (res["success"]) {
        notification.open({
          message: '修改成功',
          description: ''
        });
        setTimeout(() => {
          hide();
          this.findAll()
        }, 1000);

      }
    }, err => {
      notification.open({
        message: '修改失败',
        description: err["msg"]
      });
    })

  }

  findAll = (username, mobile) => {
    userListModelInstance.setParam({
      username: trim(username),
      mobile: trim(mobile)
    }, true)
    userListModelInstance.excute(res => {
      this.setState(prevState => {
        res.data.forEach((element, index) => {
          element.index = index + 1
        });
        return {
          userLists: res.data
        }
      })

    }, err => {
      notification.open({
        message: '查询失败',
        description: err["msg"]
      });
    })
  }

  renderMain() {
    return (
      <div>
        <SearchBar search={this.findAll} addUser={this.addUser} />
        <UserList userInfos={this.state.userLists} modifyUser={this.modifyUser} findAll={this.findAll} />
      </div>
    );
  }
}



export default UserListView;