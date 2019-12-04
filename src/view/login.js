import React, {Component} from 'react'
import BaseView from '../core/view.base'

import Base64 from '../util/base64'
import {getHttpAuth} from '../util/util'

import {UserInfoStore,HttpAuthInfoStore} from '../store/business.store'

import { 
    LoginModel
} from '../models/general_models'

import { Form, Icon, Input, Button, Checkbox } from 'antd';
const FormItem = Form.Item;

const userInfoStore = UserInfoStore.getInstance(),
	  httpAuthInfoStore = HttpAuthInfoStore.getInstance();
const loginModel = LoginModel.getInstance();

class NormalLoginForm extends Component {
  	handleSubmit = (e) => {
    	e.preventDefault();
    	const self = this;

    	this.props.form.validateFields((err, values) => {

      		if (!err) {


      			self.props.loginHandle && self.props.loginHandle(values);
      		}
    	});
  	}

  	render() {

	    const { getFieldDecorator } = this.props.form;

	    return (
	      	<Form onSubmit={this.handleSubmit} className="login-form">
	      		<div className='login_title'>NgRouter API网关管理系统</div>
		        <FormItem>
		          	{getFieldDecorator('userName', {
		            	rules: [{ required: true, message: '请输入用户名' }],
		          	})(
		            	<Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="用户名" />
		          	)}
		        </FormItem>
		        <FormItem>
		          	{getFieldDecorator('password', {
		            	rules: [{ required: true, message: '请输入密码' }],
		          	})(
		            <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="密码" />
		          )}
		        </FormItem>
		        <FormItem>
		          	{getFieldDecorator('remember', {
		            	valuePropName: 'checked',
		            	initialValue: true,
		          	})(
		            	<Checkbox>记住我</Checkbox>
		          	)}
		          	<a className="login-form-forgot" href="javascript:;" style={{display:'none'}}>Forgot password</a>
		          	<Button type="primary" htmlType="submit" className="login-form-button">
		            	登录
		          	</Button>
		        </FormItem>
	      	</Form>
	    );
  	}
}


class Login extends Component {

    constructor(props) {

        super(props);

        this.state = {
        	userName:'',
        	password:''

        }

        this.urlQuery = this.props.location.query;
    }

    componentWillMount(){

		const userInfo = userInfoStore.getData() || {};

		if(userInfo.userName){
			this.setState({
				userName:userInfo.userName,
				password:userInfo.password
			})
		}

    }

    loginHandle(userInfo){
    	
    	const {userName,remember,password} = userInfo;

        const self = this;

    	const baseCode = Base64.encode(`${userName}:${password}`);
		const auth = `Basic ${baseCode}`;

        loginModel.setHeader({
            Authorization:auth
        })	

        loginModel.excute(res=>{
            
            if(remember){//缓存登陆账号密码7天
                userInfoStore.setData({
                    userName:userName,
                    password:password
                })
            }

            //缓存auth8小时
            httpAuthInfoStore.setData({
                auth:auth
            })

            self.gotoBack();
        },err=>{

            console.log(err)

            alert('错误')

        })  
        

        

    }

    gotoBack(){
        window.history.go(-1);
    }


    render(){
        
		const WrappedNormalLoginForm = Form.create()(NormalLoginForm);

        return (

        	<div className='login_content'>
        		<WrappedNormalLoginForm 
        			loginHandle={this.loginHandle.bind(this)}
        			userName= {this.state.userName}
        			password= {this.state.password}
        		/>
        	</div>

        )

    }

}

export default Login;
