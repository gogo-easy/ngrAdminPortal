import { Modal, Button, notification, Form, Row, Col, Input, Icon, Select, InputNumber } from 'antd';
import React from "react"
const { TextArea } = Input;

import { AddHostQPSModel, HostListModel } from "../../models/host_manager_models";

let hostListModel = HostListModel.getInstance(),
  addHostQPSModel = AddHostQPSModel.getInstance()

class __AddLimitForm extends React.Component {
  constructor(props) {
    super(props)
  }
  state = {
    gatewayinfo: {}
  }
  checkMessge = (rule, value, callback) => {
    const form = this.props.form;
    if (!value && form.getFieldValue('content_type')) {
      callback('响应类型选择后，此项必填');
    } else {
      callback();
    }
  }

  handleChange = () => this.setState({}, () => this.props.form.validateFields(['message'], { force: true }))
  gatewayhandleChange(e){
    hostListModel.setParam({
      id: e
    }, true)
    // hostListModel.excute(res => {
    //   this.setState({
    //     gatewayinfo: res.data[0],
    //   },()=>{
    //     this.props.cb(this.state.gatewayinfo)
    //   })

    // }, err => {
    //   notification.open({
    //     message: '查询失败',
    //     description: err["msg"]
    //   });
    // })
  }

  render() {
    const { props } = this;
    const { getFieldDecorator } = props.form;
    const gatewaylist= this.props.getewaylist;
    return (
      <Form
        className="ant-advanced-search-form"
        style={{ width: "100%" }}
      >
        <Row style={{ marginBottom: 10 }}>
          <Form.Item
            label="所属服务网关"
            hasFeedback
          >
                                
            {getFieldDecorator('gateway_code', {
              rules: [{
                  required: true,message:"请选择所属服务网关"
              }],
              initialValue: props["gateway_code"] ? props["gateway_code"] : undefined,
            })(
              <Select placeholder="请选择所属服务网关" style={{ width: 200 }} allowClear onChange={this.gatewayhandleChange.bind(this)}>
                {gatewaylist.map((item)=>{
                  return (
                  <Option value={item.id}>{item.gateway_code}</Option>
                  )
                })}
              </Select>
            )}
          </Form.Item>
        </Row>
        <Row style={{ marginBottom: 10 }}>
          <Form.Item
            label="主机描述："
            hasFeedback
          >
            {getFieldDecorator('gateway_desc', {
              rules: [{
                  required: true,message:"请输入主机描述"
              }],
              initialValue: props["gateway_desc"],
            })(
              <Input style={{ width: 200 }} />
            )}
          </Form.Item>
        </Row>
        <Row style={{ marginBottom: 10 }}>
          <Form.Item
            label="主机域名："
            hasFeedback
          >
            {getFieldDecorator('host', {
              rules: [{
                required: true,message:"请输入主机域名"
              }],
              initialValue: props["host"],
            })(
              <Input style={{ width: 200 }} />
            )}
          </Form.Item>
        </Row>
        <Row style={{ marginBottom: 10 }}>
          <Form.Item
            label="QPS限流阈值(单机)："
            hasFeedback
          >
            {getFieldDecorator('limit_count', {
              rules: [{
                required: true,message:"QPS限流阈值(单机)"
              }],
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
              initialValue: props["message"]
            })(
              <TextArea rows={4} style={{ width: 300 }} />
            )}
          </Form.Item>
        </Row>

      </Form>
    );

  }
}

const AddLimitForm = Form.create({ name: 'host_add_limit_form' })(__AddLimitForm);

export class ModifyAddHostQPS extends React.Component {
  constructor(props) {
    super(props)
  }
  state = {
    visible: false,
    data: {}
  }
  componentDidMount(){
  }
  show = () => {

    hostListModel.setParam({
      id: this.props.id,
    }, true)
    hostListModel.excute(res => {
      console.log(res)
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
    // this.setState({
    //   visible: false,
    // });
    this.props.closeModel()
  }
  gatewayinfoFn(e){
    this.setState({
      gatewayinfo:e
    })
  }
  submit = (e) => {

    const { id } = this.state.data
    this.refs.hostLimit.validateFields((err, values) => {
      if (!err) {
        addHostQPSModel.setParam({
          host:values["host"],
          host_desc:values["gateway_desc"],
          gateway_id:values["gateway_code"],
          content_type: values["content_type"],
          http_status: values["http_status"],
          limit_count: values["limit_count"],
          message: values["message"],
        }, true);
        addHostQPSModel.excute(res => {

          // console.log("res", res)
          notification.open({
            message: '新增主机成功',
            description: "",
            type: "success"
          });

          this.props.closeModel()

        }, err => {
          notification.open({
            message: '新增主机失败',
            description: err["msg"],
            type: "error"
          });
        })
      }
    });
  }

  render() {
    return (
      <span>
        <Modal
          title="新增主机"
          visible={true}
          okText="确认"
          cancelText="取消"
          onOk={this.submit}
          onCancel={this.hide}
        >
          <AddLimitForm getewaylist={this.props.getewaylist} cb={this.gatewayinfoFn.bind(this)} ref="hostLimit" {...this.state.data} />
        </Modal>
      </span>
    );
  }
}
