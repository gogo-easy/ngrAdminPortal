import React, {Component} from 'react'
import {Layout,Form, Button,Row,Col,Divider,Popconfirm,Table,notification, Icon, Modal, Input, Select, Option,Tooltip} from 'antd'
import moment from 'moment'

import BaseView from '../../core/view.base'
import WkModal from '../../ui/ui.modal'
import FieldsContent from '../../ui/ui.fiedld'

import {formatObj} from '../../util/util'

import { 
    PropretyListModel,
    DelPropretyLimitModel,
    AddPropretyLimitModel,
    EditPropretyLimitModel,
    DeleteRespTemplate,
    AddRespTemplate,
    EditRespTemplate,
    UpdateEnableModel
} from '../../models/proprety_ratelimit_models'
import {GatewayListModel, HostListModel} from "../../models/host_manager_models";


const { Header, Content } = Layout;
const FormItem = Form.Item;

let propretyListModel = PropretyListModel.getInstance(),
    delPropretyLimitModel = DelPropretyLimitModel.getInstance(),
    addPropretyLimitModel = AddPropretyLimitModel.getInstance(),
    editPropretyLimitModel = EditPropretyLimitModel.getInstance(),
    deleteRespTemplate = DeleteRespTemplate.getInstance(),
    addRespTemplate = AddRespTemplate.getInstance(),
    editRespTemplate = EditRespTemplate.getInstance(),
    gatewayListModel = GatewayListModel.getInstance(),
    hostListModel = HostListModel.getInstance(),
    updateEnableModel =UpdateEnableModel.getInstance()


class PropretyRateLimit extends BaseView {

    constructor(props) {

        super(props);

        let modalFieldsArr = [                  //新增和编辑
            {
                key:'name',
                label:'名称',
                type:'input',
                placeholder:'最长支持49位',
                maxlength:49

            },
            {
                key:'gateway_id',
                label:'所属服务网关',
                type:'select',
                options:[
                    {
                        value:'defaultValue',
                        desc:'请选择...'
                    }
                ],
                disabled: false
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
                ],
                disabled: false
            },
            {
                key:'rate_limit_count',
                label:'限速阈值',
                type:'input',
                placeholder:'仅支持数字,最长12位',
                maxlength:12
            },{
                key:'rate_limit_period',
                label:'限速单位',
                type:'select',
                options:[
                    {
                        value:'defaultValue',
                        desc:'请选择限速单位'
                    },
                    {
                        value:'1',
                        desc:'每秒'
                    },
                    {
                        value:'60',
                        desc:'每分'
                    },
                    {
                        value:'3600',
                        desc:'每小时'
                    },
                    {
                        value:'86400',
                        desc:'每天'
                    }

                ]

            },{
                key:'is_blocked',
                label:'是否阻塞请求',
                type:'select',
                options:[
                    {
                        value:'defaultValue',
                        desc:'请选择是否阻塞'
                    },
                    {
                        value:'1',
                        desc:'阻塞'
                    },
                    {
                        value:'0',
                        desc:'不阻塞'
                    }

                ]

            },{
                key:'block_time',
                label:'防刷阻塞请求时间(分钟)',
                type:'input',
                placeholder:'仅支持数字,最长12位',
                maxlength:12

            },{
                key:'enable',
                label:'是否启用',
                type:'select',
                options:[
                    {
                        value:'0',
                        desc:'禁用'
                    },
                    {
                        value:'1',
                        desc:'启用'
                    }
                ],
                disabled: true
            },
            {
                key:'rate_type',
                label:'限流控制时段',
                type:'select',
                options:[
                    {
                        value:'defaultValue',
                        desc:'请选择限流类型'
                    },
                    {
                        value: '0',
                        desc: '全天'
                    },
                    {
                        value: '1',
                        desc:'时间段'
                    }
                ]

            },
            {
                key:'effect_s_time',
                label:'限流开始时间',
                type:'TimePicker',                        
            },
            {
                key:'effect_e_time',
                label:'限流结束时间',
                type:'TimePicker',
            },
            {
                key:'http_status',
                label:'http响应码',
                type:'input',
                placeholder:'仅支持数字,最长3位',
                maxlength:3,
                disabled: false
            },
            {
                key:'content_type',
                label:'命中响应类型',
                type:'select',
                options:[
                    {
                        value:'defaultValue',
                        desc:'请选择命中响应类型'
                    },
                    {
                        value: 'application/json',
                        desc: 'application/json'
                    },
                    {
                        value: 'application/xml',
                        desc: 'application/xml'
                    },
                    {
                        value: 'text/html',
                        desc: 'text/html'
                    },
                    {
                        value: 'text/plain',
                        desc:'text/plain'
                    }
                ]
            },
            {
                key:'message',
                label:'命中响应内容',
                type:'textArea',
                placeholder:'若命中响应类型已选择，则命中响应内容必填，类型为选择，内容可不填',                     
            },

        ]

        this.state = {
            mainId: -1,                         // 主键id
            editOrAddPropertyModal: 1,          // 1:编辑   2:新增
            propertyModalTitle: '',
            showPropertyDetail: false,
            propertyType: '请选择',              // 属性类型
            propertyName: '',                   // 属性名称
        	listData : [],

            editKey:'',

            searchData:{},

            modalType:'search',
            modalData:{},
            modalFieldsArr:modalFieldsArr,
            responseMessage: {                  // 返回错误信息详情
                title: '',
                content_type: '',
                message: '',
                visible: false,
                http_status: '',
            }    
        }

        this.indata = {
            propertyTypes: ['URI', 'IP', 'Referer', 'UserAgent', 'Header', 'Query_String', 'PostParam', 'JsonParam'],
            detailColumns: [
                {
                    title: '特征类型',
                    dataIndex: 'property_type',
                    width:'450px',
                    align:'center'
                },
                {
                    title: '特征属性名称',
                    dataIndex: 'property_name',
                    width:'450px',
                    align:'center'
                },
                {
                  title: '操作',
                  width:'150px',
                  align:'center',
                  render:this.renderDetaisControl.bind(this)
                }
            ],
            tableColumns:[
                {
                  title: '序号',
                  dataIndex: 'idx',
                  width:'50px',
                  align:'center'
                }, {
                  title: '名称',
                  dataIndex: 'name',
                  width:'100px',
                  align:'center'
                },
                {
                    title: '所属网关编码',
                    dataIndex: 'gateway_code',
                    width:'100px',
                    align:'center'
                },
                {
                    title: '所属主机',
                    dataIndex: 'host',
                    width:'100px',
                    align:'center',
                    render:this.columnTooltip.bind(this)
                },
                {
                    title: '限速阈值',
                    dataIndex: 'rate_limit_count',
                    width:'100px',
                    align:'center'
                },
                {
                    title: '限速单位',
                    dataIndex: 'rate_limit_period_txt',
                    width:'100px',
                    align:'center'
                },
                 {
                  title: '当前状态',
                  render:this.cellEnable.bind(this),
                  width:'100px',
                  align:'center'
                },
                 {
                  title: '是否阻塞请求',
                  dataIndex: 'is_blocked_txt',
                  width:'100px',
                  align:'center'
                },
                 {
                  title: '阻塞请求时间(分)',
                  dataIndex: 'block_time',
                  width:'100px',
                  align:'center'
                },
                {
                    title: '限流类型',
                    dataIndex: 'rate_type',
                    width:'100px',
                    align:'center',
                    render: (type) => (+type === 0 ? '全天' : '时段')
                },
                {
                    title: '限流开始时间',
                    dataIndex: 'effect_s_time',
                    width:'100px',
                    align:'center',
                },
                {
                    title: '限流结束时间',
                    dataIndex: 'effect_e_time',
                    width:'100px',
                    align:'center',
                },
                {
                  title: '操作',
                  width:'150px',
                  align:'center',
                  render:this.operationColumn.bind(this)
                }
            ],

            searchFieldsArr:[    //搜索
                {
                    key:'name',
                    label:'名称',
                    type:'input',
                    placeholder:'请输入配置名称'

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
                {
                    key:'is_blocked',
                    label:'是否阻塞请求',
                    type:'select',
                    options:[
                        {
                            value:'defaultValue',
                            desc:'请选择是否阻塞'
                        },
                        {
                            value:'1',
                            desc:'阻塞'
                        },
                        {
                            value:'0',
                            desc:'不阻塞'
                        }

                    ]

                },
                {
                    key:'enable',
                    label:'是否启用',
                    type:'select',
                    options:[
                        {
                            value:'defaultValue',
                            desc:'请选择使用状态'
                        },
                        {
                            value:'1',
                            desc:'启用'
                        },
                        {
                            value:'0',
                            desc:'禁用'
                        }
                    ]
                }
            ]   
        }

    }

    componentDidMount(){
       this.fetchAllList();
        this.fetchGateway();
    }

    fetchGateway(){
        let self = this;
        let searchFieldsArr = this.indata.searchFieldsArr;
        let modalFieldsArr = this.state.modalFieldsArr;
        return new Promise((resolve, reject) => {
            gatewayListModel.excute((res)=>{
                const optionData = self.seachParFormatListData(res.data);
                // 初始化查询条件gateway_code
                searchFieldsArr[1].options =searchFieldsArr[1].options.concat(optionData.gateway_codes);
                self.setState({searchFieldsArr:searchFieldsArr})
                // 初始化新增编辑页面gateway_code
                modalFieldsArr[1].options=modalFieldsArr[1].options.concat(optionData.gateway_codes);
                resolve(res)
            },(err)=>{
                reject(err)
            })
        }).catch(err => {

        })
    }

    seachParFormatListData(listData){
        let option = {};
        option.gateway_codes = [];
        listData.forEach((item,idx)=>{
            option.gateway_codes.push({value:item.id,desc:item.gateway_code});
        })
        return option
    }


    fetchSearchHost(gateway_id){
        let self = this;
        let searchFieldsArr = this.indata.searchFieldsArr;
        const param = {}
        param.gateway_id = gateway_id
        hostListModel.setParam(param)
        return new Promise((resolve, reject) => {

            hostListModel.excute((res)=>{
                const optionData = self.seachParFormatListHostData(res.data);
                searchFieldsArr[2].options =optionData.hosts;
                self.setState({searchFieldsArr:searchFieldsArr})
                resolve(res)
            },(err)=>{
                reject(err)
            })
        }).catch(err => {

        })
    }

    fetchIEHost(gateway_id){
        let self = this;
        let modalFieldsArr = this.state.modalFieldsArr;
        const param = {}
        param.gateway_id = gateway_id
        hostListModel.setParam(param)
        return new Promise((resolve, reject) => {

            hostListModel.excute((res)=>{
                const optionData = self.seachParFormatListHostData(res.data);
                modalFieldsArr[2].options =optionData.hosts;
                self.setState({modalFieldsArr:modalFieldsArr})
                resolve(res)
            },(err)=>{
                reject(err)
            })
        }).catch(err => {

        })
    }

    seachParFormatListHostData(listData){
        let option = {};
        option.hosts = [];
        option.hosts.push({value:"defaultValue",desc:"请选择..."});
        listData.forEach((item,idx)=>{
            option.hosts.push({value:item.id,desc:item.host});
        })
        return option
    }

    cellEnable(text,record,index){

        const cellStyle = record.enable == '0'?{color:'#f00'}:{color:'#15ff0a'};
        return (
            <span style={cellStyle} >{record.enable_txt}</span>
        )

    }
    showErrorMessage (record) {
        const { content_type, message, name ,http_status} = record
        this.setState({
            responseMessage: {
                title: `特征限速 (${ name }) 组命中返回信息详情`,
                content_type,
                message,
                visible: true,
                http_status,
            }
        })
    }

    columnTooltip(text,record,index){
        let isEnable = record.host_enable == 1;
        if(isEnable){
            return (
                <span>{record.host}</span>
            );
        }else{
            const cellStyle = isEnable == false?{color:'#f00'}:{};
            return (
                <Tooltip title="该主机已经被禁用">
                    <span style={cellStyle}>{record.host}</span>
                </Tooltip>
            )
        }
    }


    closeErrorMessage () {
        this.setState({
            responseMessage: {...this.state.responseMessage, visible: false}
        })
    }
    // 展示错误信息详情组件
    renderErrorMessage () {
        const { visible, title, content_type, message,http_status } = this.state.responseMessage
        return (
            <Modal
                visible={ visible }
                width='800px'
                cancelText='返回'
                okText='知道了'
                onOk={ this.closeErrorMessage.bind(this) }
                onCancel={ this.closeErrorMessage.bind(this) }
                title={ title }>
                <div>http响应码：{ http_status }</div>
                <div>命中响应类型：{ content_type }</div>
                <div>命中响应内容：{ message }</div>
            </Modal>
        )
    }


    operationColumn(text, record, index){
        return (
            <span>
                { record.content_type && (<a href="javascript:;" onClick={ this.showErrorMessage.bind(this, record) }><Icon type="file-text" /></a>) }
                <Divider type="vertical" />
                <Popconfirm
                    title={record.enable == '0' ?'您确定启用吗？':'您确定禁用吗？'}
                    placement="left"
                    onConfirm={() => this.updateEnable(record)}
                    cancelText='取消'
                    okText='确定'
                >
                  <a href="javascript:;">{record.enable == '0' ? <Icon type="unlock"/> : <Icon type="lock"/>}</a>
                </Popconfirm>

                <Divider type="vertical" />
                <a href="javascript:;" onClick={this.showModal.bind(this,'modal_edit',record)}><Icon type="edit" /></a>
                <Divider type="vertical" />
                <Popconfirm 
                    title="你确定删除吗?"
                    placement="left"
                    onConfirm={() => this.onDelete(record)}
                    cancelText='取消'
                    okText='确定'
                >
                  <a href="javascript:;"><Icon type='delete' /></a>
                </Popconfirm>
            </span>
        )

    }

    onDelete(record){

        let self = this,
            listData = this.state.listData;

        const id = record.id;

        delPropretyLimitModel.setParam({
            id:id
        })

        delPropretyLimitModel.excute(delSuccess,delFalid);

        function delSuccess(res){

            listData = listData.filter(item=>{
                return item.id !== id
            })


            self.setState({
                listData:listData,
            })

            const noticeConfig = {
                description:'删除成功',
                type:'success'
            }

            self.showNotification(noticeConfig);

        }

        function delFalid(){
            const noticeConfig = {
                description:'删除失败',
                type:'faild'
            }

            self.showNotification(noticeConfig);
        }
    }


    updateEnable(record){

        let self = this,
            listData = this.state.listData;

        const id = record.id;
        const enable = record.enable == '0' ? '1' : '0'
        if(record.property_detail.length<1 && record.enable == '0'){
            const noticeConfig = {
                description:'无特征属性，不能开启!',
                type:'warning'
            }

            self.showNotification(noticeConfig);
            return
        }

        updateEnableModel.setParam({
            id:id,enable:enable
        })

        updateEnableModel.excute(ueSuccess,ueFalid);

        function ueSuccess(res){

            const noticeConfig = {
                description:'操作成功',
                type:'success'
            }

            // 刷新
            self.fetchAllList()

            self.showNotification(noticeConfig);

        }

        function ueFalid(){
            const noticeConfig = {
                description:'操作失败',
                type:'faild'
            }

            self.showNotification(noticeConfig);
        }
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

    fetchAllList(){
        let self = this;

        return new Promise((resolve, reject) => {
            propretyListModel.excute((res)=>{
                const listData = self.formatListData(res.data);
    
                self.setState({
                    listData:listData
                })
                resolve(res)
            },(err)=>{
                reject(err)
            })
        }).catch(err => {
            notification.error({
                message:param.message || '',
                description: param.description || '',
                duration:2
            });
        })
    }

    searchPropretyList() {

        const param = {};

        const searchData = this.state.searchData;

        if(searchData.name){
            param.name = searchData.name
        }

        if(searchData.id){
            param.id = searchData.id || null
        }

        if(searchData.gateway_code && searchData.gateway_code !== 'defaultValue'){
            param.gateway_id = searchData.gateway_code
        }

        if(searchData.host_id && searchData.host_id !== 'defaultValue'){
            param.host_id = searchData.host_id
        }

        if(searchData.enable && searchData.enable !== 'defaultValue'){
            param.enable = searchData.enable
        }
        if(searchData.is_blocked && searchData.is_blocked !== 'defaultValue'){
            param.is_blocked = searchData.is_blocked
        }

        propretyListModel.setParam(param,true);

    	propretyListModel.excute(this.seachSuccess.bind(this),this.seachFaild.bind(this));

    }

    resetSearchData(){

        this.setState({
            searchData:{}
        })

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

    }

    formatListData(listData){
        let rate_limit_period = '-';

        return listData.map((item,idx)=>{
            switch (item.rate_limit_period){
                case '1' :
                   rate_limit_period = '每秒';
                   break;
                case '60' :
                   rate_limit_period = '每分';
                   break;
                case '3600' :
                   rate_limit_period = '每小时';
                   break;
                case '86400' :
                   rate_limit_period = '每天';
                   break;
            }

            return {
                key:idx,
                idx:idx + 1,
                id:item.id || '',
                gateway_id:item.gateway_id,
                host_id:item.host_id,
                name:item.name || {},
                gateway_code:item.gateway_code || {},
                host:item.host || {},
                rate_limit_count:item.rate_limit_count || '',
                rate_limit_period:item.rate_limit_period,
                rate_limit_period_txt:rate_limit_period,
                enable:item.enable,
                enable_txt:item.enable == '0'? '禁用':'启用',
                is_blocked:item.is_blocked,
                is_blocked_txt:item.is_blocked == '0'? '不阻塞':'阻塞',
                block_time:item.block_time || '',
                rate_type: item.rate_type.toString(),                // 后台传入的类型为数字
                effect_s_time: item.effect_s_time,
                effect_e_time: item.effect_e_time,
                property_detail: item.property_detail || [],
                http_status: item.http_status || '',
                content_type: item.content_type,
                message: item.message,
                host_enable:item.host_enable
            }

        })

    }

    searchInputChange(key,e) {

        const target = e.target;

        const value = target ? target.value : e ;

        let searchData = this.state.searchData;

        searchData[key] = value;
        if (key == 'gateway_code'){
            this.fetchSearchHost(value)
            searchData['host_id']='';
        }

    	this.setState({
    		searchData: searchData
    	})

    }

    // 编辑（或新增）配置信息修改内容执行方法
    modalInputChange(key,e) {
        const target = e.target;

        const value = target ? target.value : e ;
        const host_enable = target ? target.enable : e ;

        let modalData = this.state.modalData;

        if (typeof value === 'string') {
            modalData[key] = value.trim();
        } else {
            modalData[key] = value
        }

        let modalFieldsArr = this.state.modalFieldsArr,
            disabled = false,
            temp = '',
            newFieldsArr = this.state.modalFieldsArr;

        if (key == 'gateway_id'){
            this.fetchIEHost(value)
            modalData['host_id'] = ''
        }

        if (key == 'host_id'){
            if(value != 'defaultValue'){
                hostListModel.setParam({id:value});
                hostListModel.excute((res)=> {
                    const resData = res.data[0] || {};
                    if (resData.enable == '0') {
                        const noticeConfig = {
                            description: '该主机信息已经被禁用',
                            type: 'warning'
                        };
                        this.showNotification(noticeConfig);
                     }
                },(err)=>{
                    reject(err)
                })
            }
        }

        if(key == 'is_blocked'){
            if(value == 1){
                disabled = false;
                modalData.block_time = '';
            }else{
                disabled = true;
                
            }

            newFieldsArr = modalFieldsArr.map(item=>{

                temp = item;

                if(item.key == 'block_time'){

                    temp.disabled = disabled;

                }

                return temp

            })

        }
        if (key === 'effect_s_time' || key === 'effect_e_time') {
            modalData[key] = moment(e).format('HH:mm:ss')
        }


        this.setState({
            modalData: modalData,
            modalFieldsArr:newFieldsArr
        })
    }

    handleSearch(e) {

    	e.preventDefault();

    	this.searchPropretyList();

    }

    fetchEditKey(record){
        const listData = this.state.listData;

        let editKey = '';

        listData.forEach((item,idx)=>{

            if(item.id == record.id){
               editKey = idx; 
            }

        })

        return editKey

    }

    showModal(flag,record){
        
        let modalData = this.state.modalData;

        let editKey = '';

        let confirmParam ;

        let disabledArr = [];

        if(flag == 'modal_edit'){
            const itemData = record;
            editKey = this.fetchEditKey(record);

            modalData = {
                name:itemData.name,
                gateway_id:itemData.gateway_id,
                host_id:itemData.host_id,
                enable:itemData.enable == '1'?'1':'0',
                rate_limit_count:itemData.rate_limit_count,
                block_time:itemData.block_time,
                rate_limit_period:itemData.rate_limit_period,
                is_blocked:itemData.is_blocked == '1' ? '1':'0',
                rate_type: itemData.rate_type,
                effect_s_time: itemData.effect_s_time || moment().format('HH:mm:ss'),
                effect_e_time: itemData.effect_e_time || moment().format('HH:mm:ss'),
                http_status:itemData.http_status || '',
                content_type: itemData.content_type,
                message: itemData.message || ''
            }

            //根据gateway_id获取所属主机的数据源
            this.fetchIEHost(record.gateway_id)
            if(itemData.is_blocked == 0){
                disabledArr.push('block_time')
            }


            confirmParam = {
                title:'编辑配置信息',
                cancelText:'取消',
                okText:'确认',
                content:this.renderModalContent.bind(this),
                onOk:this.modalHandleOk.bind(this),
                width:'50%'
            }
        } else {
            // 新增时默认有开始时间和结束时间
            modalData = {
                effect_s_time: moment().format('HH:mm:ss'),
                effect_e_time: moment().format('HH:mm:ss'),
                enable:'0'
            };

            confirmParam = {
                title:'新增配置信息',
                cancelText:'取消',
                okText:'确认',
                content:this.renderModalContent.bind(this),
                onOk:this.modalHandleOk.bind(this),
                width:'50%'
            }
        }

        this.resetModalFieldsArr(disabledArr);
        const { modalFieldsArr } = this.state,
                messageIndex = modalFieldsArr.findIndex(item => item.key === 'message')
            
        modalFieldsArr[messageIndex].disabled = false

        this.setState({
            modalType:flag,
            modalData:modalData,
            editKey:editKey,
            modalFieldsArr
        })

        this.addModal.show(confirmParam);

    }

    resetModalFieldsArr(disabledArr){

        let modalFieldsArr = this.state.modalFieldsArr;

        let temp;

        let newModalFields =  modalFieldsArr.map(item=>{

            temp = item;
            delete temp.help;
            delete temp.validateStatus;
            delete temp.hasFeedback;

            if(disabledArr.length > 0){

                disabledArr.forEach(disabledKey=>{
                    if(item.key == disabledKey){
                        temp.disabled = true
                    }
                })

            }

            return temp
        })

        modalFieldsArr = newModalFields;

        this.setState({
            modalFieldsArr:modalFieldsArr
        })

    }

    modalHandleOk(){

        const modalType = this.state.modalType;

        if(this.paramValidate()){

            if(modalType == 'modal_add'){
                this.addPropretySetting();
            }else if (modalType == 'modal_edit'){
                this.editPropretySettingp();
            }
        }

    }

    //检验参数
    paramValidate(){
        let modalData = this.state.modalData || {},
            modalFieldsArr = this.state.modalFieldsArr,
            flag = 0,
            key,
            value,
            temp,
            reg = /^[0-9]*$/,
            reg2 = /^[a-zA-Z0-9\-_]+$/;

        let newFields = modalFieldsArr.map(item=>{

            key = item.key;
            value = modalData[key];
            temp= item;

            if((item.type == 'input' && !value) || (item.type == 'textArea' && !value) || (item.type == 'select' && (value == 'defaultValue' || !value))){
                if(item.key == 'block_time' && item.disabled){
                    temp.validateStatus = 'success';
                    temp.help = '';
                }else{
                    if (item.key === 'content_type' || item.key === 'http_status') {
                        // 不做处理
                    } else if (item.key === 'message') {
                        if ((modalData['content_type'] && modalData['content_type'] !== 'defaultValue')) {
                            temp.validateStatus = 'error';
                            flag++;

                            const messageIndex = modalFieldsArr.findIndex(item => item.key === 'message')
                            modalFieldsArr[messageIndex].disabled = true
                            this.setState({
                                modalFieldsArr
                            })
                        }
                    }else {
                        temp.validateStatus = 'error';
                        temp.help = '必填项不能为空';
                        flag++;
                    }
                }

            
            
            }else if(item.key == 'property_name' && !reg2.test(value)){
                temp.validateStatus = 'error';
                temp.help = '仅支持字母数字-_';
                flag++;
            }else if((item.key == 'rate_limit_count' || item.key == 'block_time') && !reg.test(value)){
                temp.validateStatus = 'error';
                temp.help = '仅支持数字';
                flag++;
            }else if ( /^effect_(s|e)_time$/.test(item.key) ) {
                if (!value) {
                    temp.validateStatus = 'error';
                    flag++;
                } else {
                    if (item.key === 'effect_e_time') {
                        const { effect_s_time, effect_e_time } = modalData,
                            endTimeUseful = (effect_s_time.split(':').join('') - effect_e_time.split(':').join('')) > 0
                        if (endTimeUseful) {
                            temp.validateStatus = 'error';
                            flag++;
                        }
                    }
                }
            } else{
                temp.validateStatus = 'success';
                temp.help = '';
            }

            item.hasFeedback = true;

            return temp

        })

        this.setState({
            modalFieldsArr:newFields
        })

        flag = flag == 0 ?true:false;

        return flag;
    }

    //新增配置信息
    addPropretySetting(){
        const self = this;

        let listData = this.state.listData,
            modalData = this.state.modalData,
            modalFieldsArr = this.state.modalFieldsArr;

        if (modalData['content_type'] === 'defaultValue' || !modalData['content_type']) {
            modalData['content_type'] = '';
            modalData['message'] = '';
        }

        const param = formatObj(modalData);

        addPropretyLimitModel.setParam(param);

        addPropretyLimitModel.excute(addApiSucess,addApiFaild);

        function addApiSucess(res){


            const noticeConfig = {
                description:'新增成功',
                type:'success'
            }
            self.fetchAllList();
            self.showNotification(noticeConfig);

            self.addModal.hide();

        }

        function addApiFaild(err){
            const errMsg = err.msg;
            if(errMsg === 'property_type-property_name已存在'){
                let temp;
                let newModalFields = modalFieldsArr.map(item=>{
                    temp = item;

                    if(temp.key== 'property_name'){
                        temp.help = '特征类型和名称组合已存在';
                        temp.validateStatus = 'error';
                    }

                    return temp

                })

                self.setState({
                    modalFieldsArr:newModalFields,
                    modalData:modalData
                })
            }

            const noticeConfig = {
                description:'新增失败',
                type:'faild'
            }

            self.showNotification(noticeConfig);

        }

    }
    //编辑配置信息
    editPropretySettingp(){

        const self = this;

        let listData = this.state.listData,
            editKey = this.state.editKey,
            modalData = this.state.modalData,
            modalFieldsArr = this.state.modalFieldsArr;


        if (modalData.rate_type==0 ){
            modalData.effect_e_time=''
            modalData.effect_s_time=''
        }

        modalData.id = listData[editKey].id;
        if (modalData['content_type'] === 'defaultValue' || !modalData['content_type']) {
            modalData['content_type'] = '';
            modalData['message'] = '';
        }

        const param = formatObj(modalData);

        editPropretyLimitModel.setParam(param);

        editPropretyLimitModel.excute(editApiSucess,editApiFaild);

        function editApiSucess(res){

            listData[editKey] = Object.assign(listData[editKey],modalData);

            listData = self.formatListData(listData);

            self.setState({

                listData:listData

            })

            const noticeConfig = {
                description:'更新成功',
                type:'success'
            }
            self.fetchAllList()

            self.showNotification(noticeConfig);

            self.addModal.hide();

        }

        function editApiFaild(err){

            const errMsg = err.msg;
            if(errMsg == 'property_type-property_name已存在'){
                let temp;
                let newModalFields = modalFieldsArr.map(item=>{
                    temp = item;

                    if(temp.key== 'property_name'){
                        temp.help = '特征类型和名称组合已存在';
                        temp.validateStatus = 'error';
                    }

                    return temp

                })

                self.setState({
                    modalFieldsArr:newModalFields,
                    modalData:modalData
                })
            }

            const noticeConfig = {
                description:'更新失败',
                type:'faild'
            }

            self.showNotification(noticeConfig);

        }

    }

    renderSearchBar() {

        const InputChangeHandle = this.searchInputChange.bind(this);
        
        const fieldsValue = this.state.searchData;

        let fieldsArr = this.indata.searchFieldsArr;

        const spanNum = 6;

        const fieldsConfig = {InputChangeHandle,fieldsValue,fieldsArr,spanNum};

    	return (
    		<Form 
                className="ant-advanced-search-form"
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
                    <Col span={2}>
                        <Button
                            type="button"
                            onClick={this.resetSearchData.bind(this)}
                            icon='reload'

                        >
                        重置
                        </Button>
                    </Col>

                </Row>
        			
    		</Form>
    	)

    }

    renderModalContent(){
        const InputChangeHandle = this.modalInputChange.bind(this);
        
        const fieldsValue = this.state.modalData;

        let fieldsArr = this.state.modalFieldsArr;

        const spanNum = 24;

        const fieldsConfig = {InputChangeHandle,fieldsValue,fieldsArr,spanNum};

        return (

            <Form 
                layout='inline'
                className='modal_form'
            >
               <FieldsContent fieldsConfig ={fieldsConfig}></FieldsContent>
            </Form>

        )

    }
    // 渲染属性详情操作列
    renderDetaisControl (text, record) {
        const { id: subId, property_type, property_name, biz_id: mainId } = record
        return (
            <div key={ subId }>
                <a href="javascript:;" onClick={ () => this.handleShowPropertyDetail(property_type, property_name, mainId, subId) }><Icon type="edit" /></a>&nbsp;
                <Divider type="vertical" />
                <Popconfirm
                    title="你确定删除吗?"
                    placement="left"
                    onConfirm={ () => this.deleteRespTemplate(subId) }
                    cancelText='取消'
                    okText='确定'
                >
                    <a href="javascript:;"><Icon type='delete' /></a>
                </Popconfirm>
            </div>
        )
    }
    // 添加特征信息
    addProportyDetails (row) {
        // 这里的id为父集的id
        const { property_detail, id: mainId } = row
        return (
            <div>
                <Button className="editable-add-btn" icon='plus' type='primary' onClick={ () => this.handleShowPropertyDetail(null, null, mainId) }>新增特征信息</Button>
                <Table
                    columns={this.indata.detailColumns}
                    dataSource={ row.property_detail.map((item, index) => ({ index, key: item.id, ...item })) }
                    bordered
                    pagination={false}
                />
            </div>
        )
    }
    // 删除特征信息
    deleteRespTemplate (id) {
        const self = this
        function success (res) {
            if (res.success) {
                const noticeConfig = {
                    description:'删除成功',
                    type:'success'
                }
                self.showNotification(noticeConfig);
                self.fetchAllList()
            }
        }
        function fail (err) {
            const noticeConfig = {
                description:'删除失败',
                type:'faild'
            }
            self.showNotification(noticeConfig);

        }
        deleteRespTemplate.setParam({id})
        deleteRespTemplate.excute(success, fail)
    }
    // 添加特征信息
    addRespTemplate (id) {
        const self = this
        function success (res) {
            if (res.success) {
                const noticeConfig = {
                    description:'添加成功',
                    type:'success'
                }
                self.showNotification(noticeConfig);
                self.handleCancelProportyDetail()
                self.fetchAllList()
            }
        }
        function fail (err) {
            const noticeConfig = {
                description:'添加失败',
                type:'faild'
            }
            if (+err.err_no === 3001) {
                noticeConfig.description = err.msg
            }
            self.showNotification(noticeConfig);

        }
        addRespTemplate.setParam({
            property_type: this.state.propertyType,
            prl_id: id,
            property_name: this.state.propertyName
        })
        addRespTemplate.excute(success, fail)
    }
    // 编辑特征信息
    editRespTemplate (mainId, subId) {
        const self = this
        function success (res) {
            if (res.success) {
                const noticeConfig = {
                    description:'编辑成功',
                    type:'success'
                }
                self.showNotification(noticeConfig);
                self.handleCancelProportyDetail()
                self.fetchAllList()
            }
        }
        function fail (err) {
            const noticeConfig = {
                description:'编辑失败',
                type:'faild'
            }
            if (+err.err_no === 3001) {
                noticeConfig.description = err.msg
            }
            self.showNotification(noticeConfig);
        }
        editRespTemplate.setParam({
            property_type: this.state.propertyType,
            prl_id: mainId,
            id: subId,
            property_name: this.state.propertyName
        })
        editRespTemplate.excute(success, fail)
    }
    handleProportyDetail () {
        const { editOrAddPropertyModal, propertyType, propertyName, mainId, subId } = this.state,
            self = this
        if ((!propertyType || propertyType === '请选择') || !propertyName) {
            const noticeConfig = {
                description:'所有参数都为必填',
                type:'error'
            }
            self.showNotification(noticeConfig);
            return null
        }
        if (editOrAddPropertyModal === 1) {
            this.editRespTemplate(mainId, subId)
        } else {
            this.addRespTemplate(mainId)
        }
    }
    // 取消处理特征信息子集数据
    handleCancelProportyDetail () {
        this.setState({
            showPropertyDetail: false
        })
    }
    /**
     * 
     * @description 展示特征属性编辑(添加)弹窗 默认判定为编辑
     * @param {* 特征类型} propertyType 
     * @param {* 特征名称} propertyName 
     * @param {* 主键id或主键下的子集数据的id} id
     */
    handleShowPropertyDetail (propertyType, propertyName, mainId, subId) {
        if (propertyType) {
            this.setState({
                propertyType,
                propertyName,
                mainId,
                subId,
                showPropertyDetail: true,
                editOrAddPropertyModal: 1       // 编辑特征详情
            })
        } else {
            this.setState({
                propertyType: '请选择',
                propertyName: '',
                showPropertyDetail: true,
                mainId,
                editOrAddPropertyModal: 2       // 添加特征详情
            })
        }
    }
    changePropertyType (value) {
        if (value.match(/(URI|IP|Referer|UserAgent|Host)/)) {
            this.setState({
                propertyType: value,
                propertyName: value
            })
        } else {
            this.setState({
                propertyType: value,
                propertyName: ''
            })
        }
    }
    // 特征属性名称输入
    changePropertyName (e) {
        const value = e.target.value
        if ( /^(\w|\d|\.|#|-)+$/.test(value) || value === '' ) {
            this.setState({
                propertyName: value
            })
        }
    }

    renderMain() {
        let pagenationObj = {
            pageSize: 10,
            total:this.state.listData.length,
            showTotal:(total, range) => {
                return '总共：' + total + '条';
            }
        };

        return (

        	<div style={{padding:'20px'}}>
        		{this.renderSearchBar()}
     			<Content>
                    <div className='btn_box'>
                        <Button className="editable-add-btn" onClick={this.showModal.bind(this,'modal_add')}  icon='plus' type='primary' className='right_btn'>新增</Button>
                    </div>
                    <Table
                        columns={this.indata.tableColumns}
                        dataSource={this.state.listData}
                        title={()=>{return (<h2 style={{ textAlign: "center" }}>特征限速防刷配置列表</h2>)}}
                        bordered
                        pagination={pagenationObj}
                        expandedRowRender={ this.addProportyDetails.bind(this) }
                    />
                    <WkModal ref={(wkmodal)=>{this.addModal = wkmodal}} />
                    <Modal
                        title={ this.state.propertyModalTitle }
                        okText='确定'
                        cancelText='取消'
                        visible={ this.state.showPropertyDetail }
                        onOk={ this.handleProportyDetail.bind(this) }
                        onCancel={ this.handleCancelProportyDetail.bind(this) }>
                        <div style={{ marginBottom: '10px' }}>
                            特征类型
                            <Select value={ this.state.propertyType } style={{ width: 150, marginLeft: '10px' }} onChange={ this.changePropertyType.bind(this) }>
                                {
                                    this.indata.propertyTypes.map(propertyType => (
                                        <Select.Option  key={ propertyType } value={ propertyType }>{ propertyType }</Select.Option>
                                    ))
                                }
                            </Select>
                        </div>
                        <div>
                            特征属性名称
                            <Input
                                placeholder='最长支持49位'
                                value ={ this.state.propertyName }
                                maxLength='49'
                                size='default'
                                onChange={ this.changePropertyName.bind(this) }
                                disabled={ (/(URI|IP|Referer|UserAgent|Host)/).test(this.state.propertyName) }
                            />
                        </div>
                        
                    </Modal>
                    { this.renderErrorMessage() }
     			</Content>
               
        	</div>

        );

    }

}

export default PropretyRateLimit;
