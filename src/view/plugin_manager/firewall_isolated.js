import React, {Component} from 'react'
import {Layout,Form, Button, Input, Radio,Row,Col,Divider,Popconfirm,Table,Icon,Select,DatePicker} from 'antd'

import BaseView from '../../core/view.base'
import WkModal from '../../ui/ui.modal'
import FieldsContent from '../../ui/ui.fiedld'

import moment from 'moment';

import { 
    IsolatedByFwModel,
} from '../../models/firewall.models'
import {notification} from "antd/lib/index";
import {GatewayListModel,HostListModel} from "../../models/host_manager_models";


const { Header, Content } = Layout;
const FormItem = Form.Item;

let isolatedByFwModel = IsolatedByFwModel.getInstance(),
    gatewayListModel = GatewayListModel.getInstance(),
    hostListModel = HostListModel.getInstance();

class IsoltedByFw extends BaseView {

    constructor(props) {

        super(props);
        this.state = {

        	listData : [],

            searchData:{
                date:moment().format('YYYY-MM-DD')  //今天
            }
        }

        this.indata = {

            tableColumns:[
                {
                  title: '序号',
                  width:'50px',
                  align:'center',
                  key:'idx',
                  render:this.renderCellContent.bind(this,'idx')

                },
                {
                    title: '防火墙名称',
                    width:'100px',
                    align:'center',
                    key:'waf_name',
                    render:this.renderCellContent.bind(this,'waf_name')
                },
                {
                  title: '防火墙类型',
                  width:'100px',
                  align:'center',
                  key:'selector_type_txt',
                  render:this.renderCellContent.bind(this,'selector_type_txt')
                },
                {
                    title: '所属网关编码',
                    width:'100px',
                    align:'center',
                    key:'gateway_code',
                    render:this.renderCellContent.bind(this,'gateway_code')
                },{
                    title: '所属主机',
                    width:'100px',
                    align:'center',
                    key:'host',
                    render:this.renderCellContent.bind(this,'host')
                },
                 {
                  title: '命中参数',
                  key:'cindition',
                  children:[
                    {
                        title: '参数名称',
                        dataIndex: 'param_name',
                        key:'param_name',
                        width:'100px',
                        align:'center'
                    },{
                        title: '参数类型',
                        key:'param_type',
                        dataIndex: 'param_type',
                        width:'100px',
                        align:'center'
                    },{
                        title: '参数匹配列型',
                        key:'condition_opt_type_txt',
                        dataIndex: 'condition_opt_type_txt',
                        width:'100px',
                        align:'center'
                    },{
                        title: '参数值',
                        key:'actual_value',
                        dataIndex: 'actual_value',
                        width:'100px',
                        align:'center'
                    },{
                        title: '命中时间',
                        key:'current_second',
                        dataIndex: 'current_second',
                        width:'100px',
                        align:'center'
                    },{
                        title: '命中日期',
                        key:'current_day',
                        dataIndex: 'current_day',
                        width:'100px',
                        align:'center'
                    }
                  ]
                }
            ],
            searchFieldsArr:[
                {
                    key:'date',
                    type:'select',
                    label:'日期',
                    options:this.getDateOptions()
                },
                {
                    key:'gateway_code',
                    label:'所属服务网关',
                    type:'select',
                    options:[
                        {
                            value:'defaultValue',
                            desc:'请选择...'
                        }
                    ]

                },
                {
                    key:'host_id',
                    label:'所属主机',
                    type:'select',
                    options:[
                        {
                            value:'defaultValue',
                            desc:'请选择...'
                        }
                    ]

                },
            ]
                
        }

    }

    componentDidMount(){
        //this.fetchList();
        this.fetchGateway();
    }

    fetchGateway(){
        let self = this;
        let searchFieldsArr = this.indata.searchFieldsArr;
        return new Promise((resolve, reject) => {
            gatewayListModel.excute((res)=>{
                let listData = res.data;
                let option = {};
                option.gateway_codes = [];
                listData.forEach((item,idx)=>{
                    option.gateway_codes.push({value:item.id,desc:item.gateway_code});
                })

                // 初始化查询条件gateway_code
                searchFieldsArr[1].options =searchFieldsArr[1].options.concat(option.gateway_codes);
                self.setState({searchFieldsArr:searchFieldsArr})
                resolve(res)
            },(err)=>{
                reject(err)
            })
        }).catch(err => {

        })
    }

    renderCellContent(key,text, row, index){
        return {
            children:row[key],
            props:{
                rowSpan:row.rowSpan
            }
        }

    }


    getDateOptions(){

        let options = [],value = '',temp='',desc='';

        for(var i =0 ;i< 5;i++){
            value = moment().subtract(i, 'days').format('YYYY-MM-DD');
            temp = value.split('-');
            desc = `${temp[0]}年${temp[1]}月${temp[2]}日`;
            options.push({
                value:value,
                desc:desc
            })
        }

        return options

    }

    fetchList() {

        let param = {};
        const searchData = this.state.searchData;

        param.date = searchData.date

        if(searchData.gateway_code && searchData.gateway_code !== 'defaultValue'){
            param.gateway_id = searchData.gateway_code
        }else {
            const noticeConfig = {
                description:'所属网关编码不能为空',
                type:'faild'
            }
            this.showNotification(noticeConfig);
            return
        }

        if(searchData.host_id && searchData.host_id !== 'defaultValue'){
            param.host_id = searchData.host_id
        }else {
            const noticeConfig = {
                description:'所属主机不能为空',
                type:'faild'
            }
            this.showNotification(noticeConfig);
            return
        }

        isolatedByFwModel.setParam(param,true);

    	isolatedByFwModel.excute(this.seachSuccess.bind(this),this.seachFaild.bind(this));

    }

    seachSuccess(res){

        const resData = res.data || [];

        const listData = this.formatListData(resData);

        this.setState({
            listData:listData

        })

    }

    seachFaild(){

        this.setState({
            listData:[]
        })

        const noticeConfig = {
            description:err.msg || '查询失败',
            type:'faild'
        }

        this.showNotification(noticeConfig);
    }

    formatListData(listData){

        let condition_opt_type_txt = '',selector_type_txt = '';

        let key = 0;

        let newData = [];

        listData.forEach((item,idx)=>{

            let rowSpan='';

            switch (item.selector_type) {
                case 1 : 
                   selector_type_txt = '单条件选择器';
                   break;
                case 2 :
                    selector_type_txt = '多条件取与';
                   break;
                case 3 :
                    selector_type_txt = '多条件取或';
                   break;
            }

            item.conditions.forEach((ctItem,ctIdx)=>{
                switch (ctItem.condition_opt_type) {
                    case 'equals' :
                        condition_opt_type_txt = '相等';
                        break;
                    case 'not_equals' :
                        condition_opt_type_txt = '不相等';
                        break;
                    case 'match' :
                        condition_opt_type_txt = '正则匹配';
                        break;
                    case 'match' :
                        condition_opt_type_txt = '正则匹配';
                        break;
                    case 'not_match' :
                        condition_opt_type_txt = '正则匹配非';
                        break;
                    case 'gt' :
                        condition_opt_type_txt = '大于';
                        break;
                    case 'gt_eq' :
                        condition_opt_type_txt = '大于等于';
                        break;
                    case 'lt' :
                        condition_opt_type_txt = '小于';
                        break;
                    case 'lt_eq' :
                        condition_opt_type_txt = '小于等于';
                        break;
                }

                rowSpan = ctIdx == 0? item.conditions.length:0;

                newData.push({
                    key:key,
                    idx:idx + 1,
                    rowSpan:rowSpan,
                    current_day:item.current_day || '',
                    current_second:item.current_second || '',
                    waf_id:item.waf_id || '',
                    current_day:item.current_day || '',
                    selector_name:item.selector_name || '',
                    gateway_code:item.gateway_code || '',
                    host:item.host || '',
                    waf_name:item.waf_name || '',
                    selector_type:item.selector_type || '',
                    selector_type_txt:selector_type_txt,

                    param_type:ctItem.param_type || '',
                    param_value:ctItem.param_value || '',
                    actual_value:ctItem.actual_value || '',
                    param_name:ctItem.param_name || '',
                    condition_opt_type:ctItem.condition_opt_type || '',
                    condition_opt_type_txt:condition_opt_type_txt,

                })

                key++;

            })


        })

        return newData

    }

    searchInputChange(key,e) {

        const target = e.target;

        const value = target ? target.value : e ;

        let searchData = this.state.searchData;

        searchData[key] = value;



        if(key =='gateway_code') {

            if(value =='defaultValue'){
                let searchFieldsArr = this.indata.searchFieldsArr;
                searchFieldsArr[2].options =[{value:"defaultValue",desc:"请选择..."}];
                searchData["host_id"]=''
            }

            this.fetchSearchHost(value)
            searchData["host_id"]=''

        }



    	this.setState({
    		searchData: searchData
    	})

    }

    fetchSearchHost(gateway_id){
        let self = this;
        let searchFieldsArr = this.indata.searchFieldsArr;
        const param = {}
        param.gateway_id = gateway_id
        hostListModel.setParam(param)
        return new Promise((resolve, reject) => {

            hostListModel.excute((res)=>{
                let listData = res.data;
                let option = {};
                option.hosts = [];
                option.hosts.push({value:"defaultValue",desc:"请选择..."});
                listData.forEach((item,idx)=>{
                    option.hosts.push({value:item.id,desc:item.host});
                })

                searchFieldsArr[2].options =option.hosts;
                self.setState({searchFieldsArr:searchFieldsArr})
                resolve(res)
            },(err)=>{
                reject(err)
            })
        }).catch(err => {

        })
    }

    handleSearch(e) {

    	e.preventDefault();

    	this.fetchList();

    }

    renderSearchBar() {

        const InputChangeHandle = this.searchInputChange.bind(this);
        
        const fieldsValue = this.state.searchData;

        let fieldsArr = this.indata.searchFieldsArr;

        const spanNum = 6;

        const fieldsConfig = {InputChangeHandle,fieldsValue,fieldsArr,spanNum};

    	return (
    		<Form 
                className="ant-advanced-search-form isolated_search_content"
                onSubmit={this.handleSearch.bind(this)}
            >

                <FieldsContent fieldsConfig ={fieldsConfig}></FieldsContent>
                <Row>
                    <Col span={2}>
                    
                        <Button
                            type="primary"
                            htmlType="submit"
                            icon='search'
                        >
                        查询
                        </Button>
                    </Col>
                </Row>
        			
    		</Form>
    	)

    }

    renderMain() {

        const tableType = this.state.searchData.tableType;

        const tableColumns = this.indata.tableColumns;

        return (

        	<div style={{padding:'20px'}}>
        		{this.renderSearchBar()}
     			<Content>
                     <Table 
                        columns={tableColumns} 
                        dataSource={this.state.listData}
                        title={()=>{return (<div style={{textAlign:'center',fontSize:'20px',color:"#000"}}>防火墙命中列表</div>)}}
                        bordered
                        pagination={true}
                        pageSize={10}
                    />
                    <WkModal ref={(wkmodal)=>{this.addModal = wkmodal}}

                    />

     			</Content>
        	</div>

        );

    }

    showNotification(param){

        if(!param.description){return};

        if(param.type == 'warning'){

            notification.warning({
                message:param.message || '',
                description: param.description || '',
                duration:2
            });


        }else if(param.type == 'success'){

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

}

export default IsoltedByFw;