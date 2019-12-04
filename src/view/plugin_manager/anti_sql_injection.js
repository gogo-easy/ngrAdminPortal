import React, {Component} from 'react'
import {Layout,Form, Button,Row,Col,Divider,Popconfirm,Table,notification, Icon, Modal, Input, Select, Option,Tooltip} from 'antd'
import moment from 'moment'

import BaseView from '../../core/view.base'
import WkModal from '../../ui/ui.modal'
import FieldsContent from '../../ui/ui.fiedld'

import {formatObj} from '../../util/util'

import {
    AntiSqlInjectionListModel,
    AntiSqlInjectionCreateModel,
    AntiSqlInjectionUpdateModel,
    AntiSqlInjectionDeleteModel,
    AntiSqlInjectionUpdateEnableModel,

    ASICOParameterUpdateModel,
    ASICOParameterCreateModel,
    ASICOParameterDeleteModel,
    ASICOParameterQueryModel
} from '../../models/anti_sql_injection_models'
import {GatewayListModel, HostListModel} from "../../models/host_manager_models";
import {ApiGroupRateListModel} from "../../models/router_manager_models";


const { Header, Content } = Layout;
const FormItem = Form.Item;

let antiSqlInjectionListModel = AntiSqlInjectionListModel.getInstance(),
    antiSqlInjectionCreateModel = AntiSqlInjectionCreateModel.getInstance(),
    antiSqlInjectionUpdateModel = AntiSqlInjectionUpdateModel.getInstance(),
    antiSqlInjectionDeleteModel = AntiSqlInjectionDeleteModel.getInstance(),
    antiSqlInjectionUpdateEnableModel = AntiSqlInjectionUpdateEnableModel.getInstance(),
    aSICOParameterUpdateModel = ASICOParameterUpdateModel.getInstance(),
    aSICOParameterCreateModel = ASICOParameterCreateModel.getInstance(),
    aSICOParameterDeleteModel=ASICOParameterDeleteModel.getInstance(),
    aSICOParameterQueryModel=ASICOParameterQueryModel.getInstance(),
    gatewayListModel = GatewayListModel.getInstance(),
    hostListModel = HostListModel.getInstance(),
    apiGroupRateListModel = ApiGroupRateListModel.getInstance()

class AntiSqlInjection extends BaseView {

    constructor(props) {

        super(props);

        let modalFieldsArr = [                  //新增和编辑
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
                key:'group_id',
                label:'所属API组',
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
                key:'path',
                label:'path',
                type:'input',
                placeholder:'最长支持180位',
                maxlength:180
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
                key:'database_type',
                label:'数据库类型',
                type:'select',
                options:[
                    {
                        value:'MYSQL',
                        desc:'MYSQL'
                    },
                    {
                        value:'POSTGRESQL',
                        desc:'POSTGRESQL'
                    }
                ],
                disabled: false
            },
            {
                key:'remark',
                label:'描述',
                type:'textArea',
                placeholder:'',
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
            }
        }

        this.indata = {
            propertyTypes: ['Header', 'Query_String', 'PostParam', 'JsonParam'],
            detailColumns: [
                {
                    title: '参数类型',
                    dataIndex: 'property_type',
                    width:'450px',
                    align:'center'
                },
                {
                    title: '参数名称',
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
                    title: '所属API组',
                    dataIndex: 'group_context',
                    width:'100px',
                    align:'center'
                },
                {
                    title: 'path',
                    dataIndex: 'path',
                    width:'100px',
                    align:'center'
                },
                {
                    title: '数据库类型',
                    dataIndex: 'database_type',
                    width:'100px',
                    align:'center'
                },
                {
                    title: '描述',
                    dataIndex: 'remark',
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
                    title: '操作',
                    width:'150px',
                    align:'center',
                    render:this.operationColumn.bind(this)
                }
            ],

            searchFieldsArr:[    //搜索
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
                    key:'group_id',
                    label:'所属API组',
                    type:'select',
                    options:[
                        {
                            value:'defaultValue',
                            desc:'请选择...'
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
                searchFieldsArr[0].options =searchFieldsArr[1].options.concat(optionData.gateway_codes);
                self.setState({searchFieldsArr:searchFieldsArr})
                // 初始化新增编辑页面gateway_code
                modalFieldsArr[0].options=modalFieldsArr[1].options.concat(optionData.gateway_codes);
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
                searchFieldsArr[1].options =optionData.hosts;
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
                modalFieldsArr[1].options =optionData.hosts;
                self.setState({modalFieldsArr:modalFieldsArr})
                resolve(res)
            },(err)=>{
                reject(err)
            })
        }).catch(err => {

        })
    }



        fetchGroupContext(host_id){
            let self = this;
            let searchFieldsArr = this.indata.searchFieldsArr;
            const param = {}
            param.host_id = host_id
            apiGroupRateListModel.setParam(param)
            return new Promise((resolve, reject) => {

                apiGroupRateListModel.excute((res)=>{
                    const optionData = self.parFormatListGroupContextData(res.data);
                    searchFieldsArr[2].options =optionData.group_context;
                    self.setState({searchFieldsArr:searchFieldsArr})
                    resolve(res)
                },(err)=>{
                    reject(err)
                })
            }).catch(err => {

            })
    }

    fetchIEGroupContext(host_id){
        let self = this;
        let modalFieldsArr = this.state.modalFieldsArr;
        const param = {}
        param.host_id = host_id
        apiGroupRateListModel.setParam(param)
        return new Promise((resolve, reject) => {

            apiGroupRateListModel.excute((res)=>{
                const optionData = self.parFormatListGroupContextData(res.data);
                modalFieldsArr[2].options =optionData.group_context;
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

    parFormatListGroupContextData(listData){
            let option = {};
            option.group_context = [];
            option.group_context.push({value:"defaultValue",desc:"请选择..."});
            listData.forEach((item,idx)=>{
                option.group_context.push({value:item.id,desc:item.group_context});
            })
            return option
    }

    cellEnable(text,record,index){

        const cellStyle = record.enable == '0'?{color:'#f00'}:{color:'#15ff0a'};

        return (
            <span style={cellStyle} >{record.enable_txt}</span>
        )

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
        const { visible, title, content_type, message } = this.state.responseMessage
        return (
            <Modal
                visible={ visible }
                width='800px'
                cancelText='返回'
                okText='知道了'
                onOk={ this.closeErrorMessage.bind(this) }
                onCancel={ this.closeErrorMessage.bind(this) }
                title={ title }>
                <div>命中响应类型：{ content_type }</div>
                <div>命中响应内容：{ message }</div>
            </Modal>
        )
    }


    operationColumn(text, record, index){
        return (
            <span>
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

        antiSqlInjectionDeleteModel.setParam({
            id:id
        })

        antiSqlInjectionDeleteModel.excute(delSuccess,delFalid);

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

        function delFalid(err){
            const noticeConfig = {
                description:err.msg || '删除失败',
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

        if(record.parameter_list.length<1 && record.enable == '0'){
            const noticeConfig = {
                description:'未定义参数列表，不能开启!',
                type:'warning'
            }

            self.showNotification(noticeConfig);
            return
        }

        antiSqlInjectionUpdateEnableModel.setParam({
            id:id,enable:enable
        })

        antiSqlInjectionUpdateEnableModel.excute(ueSuccess,ueFalid);

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
            antiSqlInjectionListModel.excute((res)=>{
                const listData = self.formatListData(res.data);

                self.setState({
                    listData:listData
                })
                resolve(res)
            },(err)=>{
                const noticeConfig = {
                    description: err.msg || '查询失败',
                    type:'error'
                }
                self.showNotification(noticeConfig);
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

        if(searchData.id){
            param.id = searchData.id || null
        }

        if(searchData.gateway_code && searchData.gateway_code !== 'defaultValue'){
            param.gateway_id = searchData.gateway_code
        }

        if(searchData.host_id && searchData.host_id !== 'defaultValue'){
            param.host_id = searchData.host_id
        }
        if(searchData.group_id && searchData.group_id !== 'defaultValue'){
            param.group_id = searchData.group_id
        }


        if(searchData.enable && searchData.enable !== 'defaultValue'){
            param.enable = searchData.enable
        }

        antiSqlInjectionListModel.setParam(param,true);

        antiSqlInjectionListModel.excute(this.seachSuccess.bind(this),this.seachFaild.bind(this));

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

    seachFaild(err){

        this.setState({
            listData:[]
        })


    }

    formatListData(listData){
        return listData.map((item,idx)=>{
            return {
                key:idx,
                idx:idx + 1,
                id:item.id || '',
                gateway_id:item.gateway_id,
                host_id:item.host_id,
                gateway_code:item.gateway_code || {},
                host:item.host || {},
                group_id:item.group_id,
                group_context:item.group_context,
                path:item.path || '',
                database_type:item.database_type,
                remark:item.remark,
                enable:item.enable,
                enable_txt:item.enable == '0'? '禁用':'启用',
                host_enable:item.host_enable,
                parameter_list: item.parameter_list || [],
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
            if (value == 'defaultValue'){
                let searchFieldsArr = this.indata.searchFieldsArr;
                searchFieldsArr[1].options =[{value:"defaultValue",desc:"请选择..."}];
                searchFieldsArr[2].options =[{value:"defaultValue",desc:"请选择..."}];
                this.setState({searchFieldsArr:searchFieldsArr})
            }
            searchData['host_id']='';
            searchData['group_id']='';
        }

        if(key == 'host_id'){
            this.fetchGroupContext(value)
            if (value == 'defaultValue'){
                let searchFieldsArr = this.indata.searchFieldsArr;
                searchFieldsArr[2].options =[{value:"defaultValue",desc:"请选择..."}];
                this.setState({searchFieldsArr:searchFieldsArr})
            }
            searchData['group_id']='';
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
            if (value == 'defaultValue'){
                let searchFieldsArr = this.indata.searchFieldsArr;
                searchFieldsArr[1].options =[{value:"defaultValue",desc:"请选择..."}];
                this.setState({searchFieldsArr:searchFieldsArr})
            }
            modalData['host_id'] = ''
            modalData['group_id'] = ''
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

            this.fetchIEGroupContext(value)
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
                gateway_id:itemData.gateway_id,
                host_id:itemData.host_id,
                enable:itemData.enable == '1'?'1':'0',
                group_id:itemData.group_id,
                path:itemData.path,
                database_type:itemData.database_type == 'POSTGRESQL' ? 'POSTGRESQL' : 'MYSQL',
                remark:itemData.remark
            }

            //根据gateway_id获取所属主机的数据源
            this.fetchIEHost(record.gateway_id)

            this.fetchIEGroupContext(record.host_id)


            confirmParam = {
                title:'编辑配置信息',
                cancelText:'取消',
                okText:'确认',
                content:this.renderModalContent.bind(this),
                onOk:this.modalHandleOk.bind(this),
                width:'50%'
            }
        } else {

            confirmParam = {
                title:'新增配置信息',
                cancelText:'取消',
                okText:'确认',
                content:this.renderModalContent.bind(this),
                onOk:this.modalHandleOk.bind(this),
                width:'50%'
            }
            modalData = {
                enable:'0',
                database_type:'MYSQL'
            }
        }

        this.resetModalFieldsArr(disabledArr);
        let modalFieldsArr = this.state.modalFieldsArr;

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
                    if (item.key == 'remark') {
                        // 不做处理
                    }else {
                        temp.validateStatus = 'error';
                        temp.help = '必填项不能为空';
                        flag++;
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
            modalData = this.state.modalData;

        const param = formatObj(modalData);

        antiSqlInjectionCreateModel.setParam(param);

        antiSqlInjectionCreateModel.excute(addApiSucess,addApiFaild);

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

            self.setState({
                modalData:modalData
            })

            const noticeConfig = {
                description:err.msg || '新增失败',
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
        modalData.id = listData[editKey].id;


        const param = formatObj(modalData);
        antiSqlInjectionUpdateModel.setParam(param);

        antiSqlInjectionUpdateModel.excute(editApiSucess,editApiFaild);

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

                self.setState({
                    modalData:modalData
                })

            const noticeConfig = {
                description:'更新失败',
                type:'faild'
            }

            self.showNotification(noticeConfig);

        }

    }

    renderSearchBar(){

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
                    onConfirm={ () => this.deleteParameter(subId) }
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
        const { parameter_list, id: mainId } = row
        return (
            <div>
                <Button className="editable-add-btn" icon='plus' type='primary' onClick={ () => this.handleShowPropertyDetail(null, null, mainId) }>新增参数信息</Button>
                <Table
                    columns={this.indata.detailColumns}
                    dataSource={ row.parameter_list.map((item, index) => ({ index, key: item.id, ...item })) }
                    bordered
                    pagination={false}
                />
            </div>
        )
    }

    // 删除参数信息
    deleteParameter (id) {
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
                description:err.msg || '删除失败',
                type:'faild'
            }
            self.showNotification(noticeConfig);

        }
        aSICOParameterDeleteModel.setParam({id})
        aSICOParameterDeleteModel.excute(success, fail)
    }
    // 添加特征信息
    addCOParameter(id) {
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
        aSICOParameterCreateModel.setParam({
            property_type: this.state.propertyType,
            biz_id: id,
            property_name: this.state.propertyName
        })
        aSICOParameterCreateModel.excute(success, fail)
    }
    // 编辑特征信息
    editCOParameter (mainId, subId) {
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
                description:err.msg || '编辑失败',
                type:'faild'
            }
            if (+err.err_no === 3001) {
                noticeConfig.description = err.msg
            }
            self.showNotification(noticeConfig);
        }
        aSICOParameterUpdateModel.setParam({
            property_type: this.state.propertyType,
            biz_id: mainId,
            id: subId,
            property_name: this.state.propertyName
        })
        aSICOParameterUpdateModel.excute(success, fail)
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
            this.editCOParameter(mainId, subId)
        } else {
            this.addCOParameter(mainId)
        }
    }
    // 取消处理特征信息子集数据
    handleCancelProportyDetail () {
        this.setState({
            showPropertyDetail: false
        })
    }



    handleShowPropertyDetail (propertyType, propertyName, mainId, subId) {
        if (propertyType) {
            this.setState({
                propertyType,
                propertyName,
                mainId,
                subId,
                showPropertyDetail: true,
                editOrAddPropertyModal: 1       // 编辑参数详情
            })
        } else {
            this.setState({
                propertyType: '请选择',
                propertyName: '',
                showPropertyDetail: true,
                mainId,
                editOrAddPropertyModal: 2       // 添加参数详情
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
                        title={()=>{return (<div style={{textAlign:'center',fontSize:'20px',color:"#000"}}>SQL防控列表</div>)}}
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
                            参数类型
                            <Select value={ this.state.propertyType } style={{ width: 150, marginLeft: '10px' }} onChange={ this.changePropertyType.bind(this) }>
                                {
                                    this.indata.propertyTypes.map(propertyType => (
                                        <Select.Option  key={ propertyType } value={ propertyType }>{ propertyType }</Select.Option>
                                    ))
                                }
                            </Select>
                        </div>
                        <div>
                            参数属性名称
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

export default AntiSqlInjection;