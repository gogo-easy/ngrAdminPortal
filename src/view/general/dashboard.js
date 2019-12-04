import React, {Component} from 'react'
import BaseView from '../../core/view.base'

import {getHttpAuth,gotoPage} from '../../util/util'

import { 
    DashboardListModel
} from '../../models/general_models'

import {Avatar, Button,Row,Col,Divider,Icon,Card,notification,Table} from 'antd'

const { Meta } = Card;

let dashboardListModel = DashboardListModel.getInstance();

class Dashboard extends BaseView {

    constructor(props) {

        super(props);

        this.state = {
            baseInfo:{},
            requestInfo:{},

            pageStatus:'init'
        }

        this.leavePage = false;

        this.indata = {
            baseInfoTableColumns:[
                {
                    title: '所属网关',
                    dataIndex: 'service_name',
                    align:'center'
                },
                {
                  title: 'NgRouter版本',
                  dataIndex: 'ngr_version',
                  align:'center'
                },{
                  title: 'NGINX版本',
                  dataIndex: 'nginx_version',
                  align:'center'
                },{
                  title: 'LUA版本',
                  dataIndex: 'ngx_lua_version',
                  align:'center'
                },{
                  title: '错误日志级别',
                  dataIndex: 'error_log_level',
                  align:'center'
                },{
                  title: '最近启动时间',
                  dataIndex: 'start_time',
                  align:'center'
                },{
                    title: '部署节点',
                    dataIndex:'targets',
                    align:'center'
                }
            ],
            requestInfoTableColumns:[
                {
                    title: '所属网关',
                    dataIndex: 'service_name',
                    align:'center'
                },{
                    title: '总请求次数',
                    dataIndex: 'total_count',
                    align:'center'
                },{
                    title: '成功请求次数',
                    dataIndex: 'total_success_count',
                    align:'center'
                },{
                    title: '请求总字节',
                    dataIndex: 'traffic_write',
                    align:'center'
                },{
                    title: '响应总字节',
                    dataIndex: 'traffic_read',
                    align:'center'
                },
                {
                    title: '200请求次数',
                    dataIndex: 'request_2xx',
                    align:'center'
                },
                {
                    title: '300请求次数',
                    dataIndex: 'request_3xx',
                    align:'center'
                },
                {
                    title: '400请求次数',
                    dataIndex: 'request_4xx',
                    align:'center'
                },
                {
                    title: '500请求次数',
                    dataIndex: 'request_5xx',
                    align:'center'
                }
            ]
        }
    }

    cellTarget(text,record,index){
        let show_txt = '';

        let targets = record.targets;
        if(targets!=null) {
            for (let i = 0; i < targets.length; i++) {
                let ip = targets[i];
                show_txt += ip + "|";
            }

            if (show_txt.length > 0) {
                show_txt = show_txt.substr(0, show_txt.length - 1);
            }
        }

        return (
            <span>{show_txt}</span>
        )
    }

    componentDidMount(){
        this.fetchDashboardList();
    }

    componentWillUnmount(){

        this.leavePage = true;
    }


    fetchDashboardList(){

        const self = this;
        dashboardListModel.excute(res=>{

            const resData = res.data || {};

            const data = self.formatData(resData);
            self.setState({
                baseInfo:data.baseInfo,
                requestInfo:data.requestInfo,
                pageStatus:'ready'
            })

            const config = {
                description:'列表更新成功',
                type:'success'
            }

            self.showNotification(config);

        },err=>{
            console.log(err)
        })

    }

    getHttpAuth(){

        getHttpAuth(this.fetchDashboardList.bind(this));

        function faild(){
            gotoPage('/login');
        }

    }

    showNotification(param){

        if(!param.description){return};

        if(param.type == 'success'){

            notification.success({
                message:param.message || '',
                description: param.description || '',
                duration:2
            });

        }else{

            notification.error({
                message:param.message || '',
                description: param.description || '',
                duration:2
            });

        }
    }

    formatData(data){

        const baseInfo = data.base_infos || {},
            requestInfo = data.request_infos || {};
        return {
            baseInfo:this.formatBaseListData(baseInfo),
            requestInfo:this.formatRequestListData(requestInfo)
        }

    }

    formatBaseListData(listData){

        return listData.map((item,idx)=>{
            return {
                service_name:item.service_name || '',
                ngr_version:item.ngr_version || '',
                nginx_version:item.nginx_version || '',
                ngx_lua_version:item.ngx_lua_version,
                error_log_level:item.error_log_level,
                start_time:item.start_time,
                targets:item.targets,
            }

        })
    }


    formatRequestListData(listData){

        return listData.map((item,idx)=>{
            return {
                service_name:item.service_name || '',
                total_count:item.total_count,
                total_success_count:item.total_success_count,
                traffic_write:item.traffic_write,
                traffic_read:item.traffic_read,
                request_2xx:item.request_2xx,
                request_3xx:item.request_3xx,
                request_4xx:item.request_4xx,
                request_5xx:item.request_5xx
            }

        })
    }

    renderBaseInfo(){

        const baseInfo = this.state.baseInfo;

        return (

            <div className='base_content'>
                <div className='content_title'>基础信息</div>
                <Table
                    columns={this.indata.baseInfoTableColumns} 
                    dataSource={baseInfo}
                    pagination={false}
                    bordered
                    className='dashboard_basetable'
                />
            </div>

        )

    }

    renderRequestInfo(){

        const requestInfo = this.state.requestInfo;

        return (

            <div className='base_content'>
                <div className='content_title'>今日请求信息</div>
                <Table
                    columns={this.indata.requestInfoTableColumns}
                    dataSource={requestInfo}
                    bordered
                    pagination={false}
                    className='dashboard_basetable'
                />
            </div>

        )

    }

    renderMain() {

        const pageStatus = this.state.pageStatus;

        if(pageStatus == 'ready'){

            return (
                <div style={{padding:'20px'}}>
                    <div className='btn_box'>
                        <Button type="primary" icon="reload" className='right_btn' onClick={this.getHttpAuth.bind(this,true)}>刷新</Button>
                    </div>
                    {this.renderBaseInfo()}
                    {this.renderRequestInfo()}
                </div>

            )
            

        }else{

            return ''
        }

    }

}

export default Dashboard;