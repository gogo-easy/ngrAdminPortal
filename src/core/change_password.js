import React from 'react';
import {
  Form, Icon, Input, Button, Checkbox, notification
} from 'antd';

import { PassWordModifyModel } from '../models/user_manage_models';

const passWordModifyModelInstance = PassWordModifyModel.getInstance();
import { UserInfoStore } from '../store/business.store';

const trim = val => val && val.trim() ? val.trim() : undefined
class NormalLoginForm extends React.Component {

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
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // console.log('Received values of form: ', values);
        // console.log('Received values of form: ', this.props.history);

        const [old_password, password] = [values["old_password"], values["new_password"]]

        const userInfoStore = UserInfoStore.getInstance();
        const userInfo = userInfoStore.getData() || {};

        // console.log(userInfo)

        passWordModifyModelInstance.setParam({
          old_password, password,
          username: userInfo["userName"]
        }, true);

        passWordModifyModelInstance.excute(res => {
          notification.open({
            message: '修改成功',
            description: "",
            type: "success"

          });
          setTimeout(() => {
            localStorage.clear();
            location.href = '/login';
          }, 1000);

        }, err => {
          notification.open({
            message: '修改失败',
            description: err["msg"],
            type: "error"
          });
        })

      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const style = {

    }
    return (
      <Form onSubmit={this.handleSubmit} style={style}>
        <Form.Item>
          {getFieldDecorator('old_password', {
            rules: [{ required: true, message: '请输入原始密码!' }],
          })(
            <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="原密码" />
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('new_password', {
            rules: [{
              required: true,
              validator: this.checkPassWord
            }
            ]
          })(
            <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="新密码" />
          )}
        </Form.Item>
        <Form.Item>

          <Button type="primary" htmlType="submit" className="login-form-button">
            点击重置
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

export const ModifyPassWordForm = Form.create({ name: 'normal_login' })(NormalLoginForm);
