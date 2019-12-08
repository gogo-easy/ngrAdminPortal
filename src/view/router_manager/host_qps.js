import { Modal, Button, notification, Form, Row, Col, Input, Icon, Select, InputNumber } from 'antd';
import React from "react"
const { TextArea } = Input;

import { HostQPSModel, HostListModel } from "../../models/host_manager_models";

let hostListModel = HostListModel.getInstance(),
  hostQPSModel = HostQPSModel.getInstance()

class __SetLimitForm extends React.Component {

  checkMessge = (rule, value, callback) => {
    const form = this.props.form;
    if (!value && form.getFieldValue('content_type')) {
      callback('响应类型选择后，此项必填');
    } else {
      callback();
    }
  }

  handleChange = () => this.setState({}, () => this.props.form.validateFields(['message'], { force: true }))


  render() {
    const { props } = this;
    const { getFieldDecorator } = props.form;
    return (
      <Form
        className="ant-advanced-search-form"
        style={{ width: "100%" }}
      >
        <Row style={{ marginBottom: 10 }}>所属网关：{props.gateway_desc}</Row>
        <Row style={{ marginBottom: 10 }}>所属网关编码：{props.gateway_code}</Row>
        <Row style={{ marginBottom: 10 }}>主机域名：{props.host}</Row>
        <Row style={{ marginBottom: 10 }}>
          <Form.Item
            label="QPS限流阈值(单机)："
            hasFeedback
          >
            {getFieldDecorator('limit_count', {
              initialValue: props["limit_count"],
            })(
              <InputNumber min={0} style={{ width: 200 }} />
            )}
          </Form.Item>
        </Row>
        <Row style={{ marginBottom: 10 }}>
          <Form.Item
            label="异常响应码："
            hasFeedback
          >
            {getFieldDecorator('http_status', {
              initialValue: props["http_status"],
            })(
              <InputNumber min={100} max={600} />
            )}
          </Form.Item>
        </Row>

        <Row style={{ marginBottom: 10 }}>
          <Form.Item
            label="异常响应类型："
            hasFeedback
          >
            {getFieldDecorator('content_type', {
              initialValue: props["content_type"] ? props["content_type"] : undefined,
            })(
              <Select placeholder="请选择响应类型" style={{ width: 200 }} allowClear onChange={this.handleChange}>
                <Option value="application/json">application/json</Option>
                <Option value="application/xml">application/xml</Option>
                <Option value="text/html">text/html</Option>
                <Option value="text/plain">text/plain</Option>
              </Select>
            )}
          </Form.Item>
        </Row>
        <Row style={{ marginBottom: 10 }}>
          <Form.Item
            label="异常响应内容："
            hasFeedback
          >
            {getFieldDecorator('message', {
              initialValue: props["message"],
              rules: [{
                validator: this.checkMessge,
              }],

            })(
              <TextArea rows={4} style={{ width: 300 }} />
            )}
          </Form.Item>
        </Row>

      </Form>
    );

  }
}

const SetLimitForm = Form.create({ name: 'host_set_limit_form' })(__SetLimitForm);

export class ModifyHostQPS extends React.Component {
  state = {
    visible: false,
    data: {}
  }

  show = () => {

    hostListModel.setParam({
      id: this.props.id,
    }, true)
    hostListModel.excute(res => {
      this.setState({
        data: res.data[0],
        visible: true,
      });

    }, err => {
      notification.open({
        message: '查询失败',
        description: err["msg"]
      });
    })
  }

  hide = (e) => {
    this.setState({
      visible: false,
    });
  }

  submit = (e) => {

    const { id } = this.state.data
    this.refs.hostLimit.validateFields((err, values) => {
      if (!err) {
        // console.log("values", values)
        hostQPSModel.setParam({
          id,
          content_type: values["content_type"],
          http_status: values["http_status"],
          limit_count: values["limit_count"],
          message: values["message"],

        }, true);

        hostQPSModel.excute(res => {

          // console.log("res", res)
          notification.open({
            message: '修改成功',
            description: res["msg"]
          });

          setTimeout(() => {
            this.hide()
          }, 500);

        }, err => {
          notification.open({
            message: '修改失败',
            description: err["msg"]
          });
        })
      }
    });
  }

  render() {
    return (
      <span>
        <Button type="primary" size="small" onClick={this.show}>
          设置
        </Button>
        <Modal
          title="主机设置"
          visible={this.state.visible}
          okText="确认"
          cancelText="取消"
          onOk={this.submit}
          onCancel={this.hide}
        >
          <SetLimitForm ref="hostLimit" {...this.state.data} />
        </Modal>
      </span>
    );
  }
}
