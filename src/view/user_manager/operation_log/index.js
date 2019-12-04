import React, { Component } from 'react'
import BaseView from '../../../core/view.base'

import SearchBar from "./search_bar";
import { LogList } from "./log_list";

import { LogListModel } from '../../../models/logs.model';

import { eventBus } from './events';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
import { notification } from 'antd';

const logListModelInstance = LogListModel.getInstance();

class LogView extends BaseView {

  constructor(props) {
    super(props);
    this.state = {
      logs: []
    }

    this.searchLogs = this.searchLogs.bind(this);
  }

  componentWillMount() {
    eventBus.on("search", this.searchLogs);
  }

  componentDidMount() {
    // 初始化数据

    setTimeout(() => {
      const now = moment();
      const lastFiveDays = moment().subtract(10, 'days');
      eventBus.emit("search", {
        "range_time": [lastFiveDays, now]
      }, true);
    }, 200);

  }

  componentWillUnmount() {
    eventBus.off("search");
  }




  searchLogs(values) {

    const username = values["user_name"];
    const operationType = values["operation_type"];
    const rangeTimeValue = values['range_time'];
    let start_time, end_time;
    if (rangeTimeValue) {
      start_time = rangeTimeValue[0].format('YYYY-MM-DD HH:mm:ss').toString();
      end_time = rangeTimeValue[1].format('YYYY-MM-DD HH:mm:ss').toString();
    }
    logListModelInstance.setParam({
      start_time,
      end_time,
      username
    }, true);
    logListModelInstance.excute(res => {
      res.data.forEach((element, index) => {
        element.index = index + 1
      });
      this.setState({
        logs: res.data
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
        <SearchBar></SearchBar>
        <LogList logs={this.state.logs}></LogList>

      </div>

    )
  }
}

export default LogView;