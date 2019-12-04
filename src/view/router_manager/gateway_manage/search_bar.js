import {
  Form, Input, Button, Row, Col
} from 'antd';
import React, { Component } from 'react'
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
    return (
      <Form
        className="ant-advanced-search-form"
        onSubmit={this.handleSearch}
      >
        <Row style={{ marginBottom: 20 }}>
          <Form.Item label="网关编码(模糊搜索)：">
            {getFieldDecorator('gateway_code', {
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

const WrappedSearchForm = Form.create({ name: 'gateway_search_form' })(SearchForm);

export default WrappedSearchForm;