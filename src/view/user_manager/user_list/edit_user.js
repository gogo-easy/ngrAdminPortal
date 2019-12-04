import {
  Form, Row, Col, Input, Button, Icon, Modal
} from 'antd';
import React from 'react'


// 列表项生成器
const renderItem = (props) => (item, name, required = false, ) => {
  const { getFieldDecorator } = props.form;
  return (
    <Row style={{ marginBottom: 20 }}>
      <Form.Item label={name}>
        {getFieldDecorator(item, {
          initialValue: props[item],
          rules: [{ required, message: `请输入${name}` }]
        })(
          <Input type="text" />
        )}
      </Form.Item>
    </Row>
  )
}


const trim = val => val && val.trim() ? val.trim() : undefined

class EditUserForm extends React.Component {

  checkPassWord = (rule, value, callback) => {
    const form = this.props.form;
    if (!trim(value)) {
      callback('密码不能为空 或者 空格！');
    }
    else if (trim(value) && (trim(value).length > 20 || trim(value).length < 8)) {
      callback('密码长度在 8 - 20之间！');
    } else {
      callback();
    }

  }


  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <Form
        className="ant-advanced-search-form"
        style={{ width: "100%" }}
      >
        {
          this.props.editStatus ? <Row style={{ marginBottom: 20 }}>用户名：{this.props.username}</Row>
            : renderItem(this.props)("username", "用 户 名", true)
        }
        {
          this.props.editStatus ? null
            : (<Row style={{ marginBottom: 20 }}>
              <Form.Item label="密码" hasFeedback>
                {getFieldDecorator("password", {
                  initialValue: this.props["password"],
                  rules: [{
                    required: true,
                    validator: this.checkPassWord
                  }],
                })(
                  <Input type="password" />
                )}
              </Form.Item>
            </Row>)
        }
        {renderItem(this.props)("superior", "上  级")}
        {renderItem(this.props)("mobile", "手  机")}
        {renderItem(this.props)("email", "邮  箱")}
      </Form>
    );
  }
}

const WrappedEditUserForm = Form.create({ name: 'edit_user_form' })(EditUserForm);

export default WrappedEditUserForm;


export class UserInfoEdit extends React.Component {

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

  submit = () => {

    this.refs.userInfo.validateFields((err, values) => {
      if (!err) {
        // 如果是编辑状态 id username 从userInfo 获得
        if (this.props.editStatus) {
          values["id"] = this.props.userInfo["id"];
          values["username"] = this.props.userInfo["username"];
        }

        this.props.trigger(values, this.hide)

      }

    });

  }

  render() {
    return (
      <div style={{ display: "inline-block" }}>
        <Button type="primary" size={this.props.size} onClick={this.show}>
          {this.props.buttonName}
        </Button>
        {
          this.state.visible ? <Modal
            maskClosable={false}
            title={this.props.title}
            visible={this.state.visible}
            onOk={this.submit}
            onCancel={this.hide}
            okText="确认"
            cancelText="取消"
          >
            <WrappedEditUserForm ref="userInfo" {...this.props.userInfo} editStatus={this.props.editStatus} />
          </Modal> : ""
        }

      </div>
    );
  }
}
