import React from 'react'
import BaseView from '../../../core/view.base'

import SearchBar from "./search_bar";
import { GateWayList } from "./gateway_list";
import { eventBus } from './events';
import { AddGatewayModel, GateWayListModel, SetLimitModel } from '../../../models/gateway_manage_models';

const trim = val => val && val.trim() ? val.trim() : undefined;
import { notification } from 'antd';

const gateWayListModelInstance = GateWayListModel.getInstance();
const setLimitModelInstance = SetLimitModel.getInstance();
const addGatewayModelInstance = AddGatewayModel.getInstance();

class GateWay extends BaseView {

  constructor(props) {
    super(props);
    this.state = {
      gateWayList: []
    }

    this.searchGateWayMessage = this.searchGateWayMessage.bind(this);
    this.modifyGateWay = this.modifyGateWay.bind(this);
    this.addGateWay = this.addGateWay.bind(this);

  }

  componentDidMount() {
    this.searchGateWayMessage();
    eventBus.on("search", this.searchGateWayMessage);
    eventBus.on("modify", this.modifyGateWay);
    eventBus.on( "add", this.addGateWay)
  }

  componentWillUnmount() {
    eventBus.off("search");
    eventBus.off("modify");
    eventBus.off("add")
  }

  // 搜索值  成功失败回调函数
  searchGateWayMessage(values = {}) {

    const { gateway_code } = values;
    gateWayListModelInstance.setParam({
      gateway_code
    }, true);
    gateWayListModelInstance.excute(res => {
      res.data.forEach((el, index) => {
        el.index = index + 1
      });
      this.setState({
        gateWayList: res.data
      })
    }, err => {
      console.log(err);
    });
  }
  modifyGateWay(values = {}, success) {
    const { gateway_desc, limit_count, id, content_type, message, http_status } = values;
    // console.log(limit_count, id, content_type, message, http_status);

    setLimitModelInstance.setParam({
      gateway_desc,limit_count, id, content_type, message, http_status
    }, true);
    setLimitModelInstance.excute(res => {
      notification.open({
        message: '修改成功',
        description: '',
        type: "success"
      });
      success && success();
      this.searchGateWayMessage();
    }, err => {
      console.log(err);
      notification.open({
        message: '修改失败',
        description: err["msg"],
        type: "error"
      });
    });
  }

  addGateWay(values = {}, success) {
    const { gateway_code, gateway_desc, limit_count,  content_type, message, http_status } = values;
    console.log(gateway_code,gateway_desc, limit_count, content_type, message, http_status);

    addGatewayModelInstance.setParam({
      gateway_code, gateway_desc,limit_count, content_type, message, http_status
    }, true);
    addGatewayModelInstance.excute(res => {
      notification.open({
        message: '新增成功',
        description: '',
        type: "success"
      });
      success && success();
      this.searchGateWayMessage();
    }, err => {
      console.log(err);
      notification.open({
        message: '新增失败',
        description: err["msg"]
      });
    });
  }

  renderMain() {
    return (
      <div>
        <SearchBar></SearchBar>
        <GateWayList gateWayList={this.state.gateWayList}></GateWayList>
      </div>
    );
  }
}

export default GateWay;
