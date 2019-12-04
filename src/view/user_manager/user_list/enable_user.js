import { Popover, Button, Icon, Divider, notification } from 'antd';
import React from "react";
import { UserEnableModel } from "../../../models/user_manage_models";

const userEnableModelInstance = UserEnableModel.getInstance();
import { eventBus } from './events';

export default class App extends React.Component {

  state = {
    visible: false,
  }

  hide = () => {
    this.setState({
      visible: false,
    });
  }

  handleVisibleChange = (visible) => {
    this.setState({ visible });
  }

  change = () => {
    const { id, enable } = this.props;
    userEnableModelInstance.setParam({
      id,
      enable: enable === 1 ? 0 : 1
    }, true);

    userEnableModelInstance.excute(res => {

      notification.open({
        message: '切换成功',
        description: res["msg"]
      });
      eventBus.emit("findAll");

    }, err => {
      notification.open({
        message: '切换失败',
        description: err["msg"]
      });
    })

  }


  render() {

    const content = (
      <div>
        <Icon type="exclamation-circle" />确定需要更改用户状态吗？
        <Divider></Divider>
        <Button size="small" onClick={this.hide}>取消</Button>
        <Divider type="vertical"></Divider>
        <Button type="primary" size="small" onClick={this.change}>改变</Button>

      </div>


    );
    return (
      <Popover
        content={content}
        trigger="click"
        visible={this.state.visible}
        onVisibleChange={this.handleVisibleChange}
      >
        <Button type="danger" size="small">启禁用</Button>
      </Popover>
    );
  }
}
