import React, { Component } from "react";

import { Popover, Button, Avatar, Modal } from 'antd';

import { ModifyPassWordForm } from "./change_password";


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
      <div>
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
    <p><Button type="danger" onClick={logout} style={{ marginTop: 10 }}>退出</Button></p>
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
            欢迎您！
            <Avatar size="large" icon="user" />
          </div>

        </Popover>
      </div>

    );
  }

}