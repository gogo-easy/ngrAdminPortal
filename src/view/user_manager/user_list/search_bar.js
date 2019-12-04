import {
  Form, Row, Col, Input, Button, Icon
} from 'antd';
import React, { Component } from 'react'
import { UserInfoEdit } from "./edit_user";

class SearchForm extends React.Component {
  constructor(props) {
    super(props)
  }

  handleSearch = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.search(
          values["userName"],
          values["phoneNumber"])
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
          <Form.Item label="用户名：">
            {getFieldDecorator('userName', {
            })(
              <Input />
            )}
          </Form.Item>
          <Form.Item label="手机号码：" style={{ marginLeft: 20 }} >
            {getFieldDecorator('phoneNumber', {
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
          <Col span={12} style={{ textAlign: 'right' }}>
            <UserInfoEdit buttonName="新增" title="新增用户" trigger={this.props.addUser}></UserInfoEdit>
          </Col>
        </Row>
      </Form>
    );
  }
}

const WrappedSearchForm = Form.create({ name: 'user_search_form' })(SearchForm);

export default WrappedSearchForm;