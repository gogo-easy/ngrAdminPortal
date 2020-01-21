import React, { Component } from "react";

import { Popover, Button, Avatar, Modal } from 'antd';

import { ModifyPassWordForm } from "./change_password";
import {UserInfoStore} from "../store/business.store";

const userInfo = UserInfoStore.getInstance().getData();


const logout = () => {
  setTimeout(() => {
    localStorage.clear();
    location.href = '/login';
  }, 1000);
}


class ModifyPassWord extends React.Component {
  state = { visible: false }

  show = () => {
    this.setState({
      visible: true,
    });
  }

  hide = () => {
    this.setState({
      visible: false,
    });
  }



  submit = (e) => {
    console.log("e")
  }



  render() {
    return (
      <div style={{display:"inline-block"}}>
        <Button type="primary" onClick={this.show}>
          修改密码
        </Button>
        <Modal
          title="修改密码"
          visible={this.state.visible}
          onOk={this.hide}
          onCancel={this.hide}
          okText="确认"
          cancelText="退出"
        >
          <ModifyPassWordForm></ModifyPassWordForm>
        </Modal>
      </div>
    );
  }
}

const content = (
  <div>
    <ModifyPassWord />
    <Button type="danger" onClick={logout} style={{ marginTop: 10,display:'inline-block',marginLeft:10 }}>退出</Button>
  </div>
);

export default class Nav extends Component {
  render() {

    const navStyle = { position: "relative", height: 50, display: "flex", alignItems: "center"}
    const avatarStyle = { position: "absolute", right: 20 }

    return (
      <div style={navStyle}>
        <Popover content={content} placement="bottomRight" title="操作" >
          <div style={avatarStyle}>
            欢迎您, {(userInfo && userInfo.userName) ? userInfo.userName : ""}
            <Avatar style={{ backgroundColor: '#87d068',left: 10 }} size="large" icon="user"></Avatar>
          </div>

        </Popover>
      </div>

    );
  }

}
