import {
  Form, Row, Col, Input, Button, Icon
} from 'antd';
import React, { Component } from 'react'
import { DatePicker } from 'antd';
import locale from 'antd/lib/date-picker/locale/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
const { RangePicker } = DatePicker;

import { eventBus } from './events';

class SearchForm extends React.Component {
  constructor(props) {
    super(props)
  }

  handleSearch = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // 触发事件中心的搜索事件
        eventBus.emit("search", values);
      }
    });
  }



  handleReset = () => {
    this.props.form.resetFields();
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const now = moment();
    const lastFiveDays = moment().subtract(10, 'days');;
    const defaultValue = [lastFiveDays, now]
    const rangeConfig = {
      rules: [{ type: 'array', required: true, message: '时间段不能为空！' }],
      initialValue: defaultValue
    };

    return (
      <Form
        className="ant-advanced-search-form"
        onSubmit={this.handleSearch}
      >
        <Row style={{ marginBottom: 20 }}>
          <Form.Item label="用户名：">
            {getFieldDecorator('user_name', {
            })(
              <Input />
            )}
          </Form.Item>
          <Form.Item
            style={{ marginLeft: 20 }}
            label="时间段："
          >
            {getFieldDecorator('range_time', rangeConfig)(
              <RangePicker locale={locale} showTime format="YYYY-MM-DD HH:mm:ss" />
            )}
          </Form.Item>
          <Form.Item label="操作类型：" style={{ marginLeft: 20 }}>
            {getFieldDecorator('operation_type', {
            })(
              <Input />
            )}
          </Form.Item>

        </Row>
        <Row>
          <Col span={12} style={{ textAlign: 'left' }}>
            <Button type="primary" htmlType="submit">查询</Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>
              重置
            </Button>
          </Col>

        </Row>
      </Form>
    );
  }
}

const WrappedSearchForm = Form.create({ name: 'user_log_search_form' })(SearchForm);

export default WrappedSearchForm;