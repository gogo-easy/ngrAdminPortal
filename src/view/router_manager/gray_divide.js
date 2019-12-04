import React, {Component} from 'react'
import classnames from 'classnames'
import {Layout,Form, Button,Row,Col,Divider,Popconfirm,Table,notification,Icon, Modal,Tooltip} from 'antd'


import BaseView from '../../core/view.base'
import WkModal from '../../ui/ui.modal'
import FieldsContent from '../../ui/ui.fiedld'

import {formatObj, gotoPage} from '../../util/util'

import {
    GrayDivideQueryModel,
    GrayDivideAdddModel,
    GrayDivideUpdateModel,
    GrayDivideDeleteModel,
    GrayDivideEnableModel,
    TargetsQueryModel,
    ConditionAddModel,
    ConditionUpdateModel,
    ConditionDeleteModel
} from '../../models/gray_divide_models'

import {
    SimpleGroupQueryModel
} from '../../models/router_manager_models'

import {
    GatewayListModel,
    HostListModel
} from '../../models/host_manager_models'


const { Header, Content } = Layout;

let grayDivideQueryModel = GrayDivideQueryModel.getInstance(),
    grayDivideAddModel = GrayDivideAdddModel.getInstance(),
    grayDivideUpdateModel = GrayDivideUpdateModel.getInstance(),
    grayDivideDeleteModel = GrayDivideDeleteModel.getInstance(),
    grayDivideEnableModel = GrayDivideEnableModel.getInstance(),
    simpleGroupQueryModel = SimpleGroupQueryModel.getInstance(),
    conditionAddModel = ConditionAddModel.getInstance(),
    conditionUpdateModel = ConditionUpdateModel.getInstance(),
    conditionDeleteModel = ConditionDeleteModel.getInstance(),

    targetsQueryModel = TargetsQueryModel.getInstance(),

    //网关
    gatewayListModel = GatewayListModel.getInstance(),
    //主机
    hostListModel = HostListModel.getInstance();


class GrayDivide extends BaseView {

    constructor(props) {

        super(props);

        let modalFieldsArr = {
            gray_divide:[        //新增和编辑
                {
                    key:'gray_divide_name',
                    label:'AB分流名称',
                    type:'input',
                    placeholder:'最长支持31位',
                    maxlength:31,
                    disabled: false
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
                    key:'group_targets',
                    mode:'multiple',
                    label:'分流target',
                    type:'select',
                    options:[

                    ],
                    disabled: false
                },
                {
                    key:'gray_domain',
                    label:'后端内网域名',
                    type:'input',
                    placeholder:'最长支持63位',
                    maxlength:64,
                    disabled: false
                },
                {
                    key:'enable',
                    label:'是否启用',
                    type:'select',
                    options:[
                        {
                            value:'defaultValue',
                            desc:'请选择...'
                        },{
                            value:'1',
                            desc:'开启'
                        },{
                            value:'0',
                            desc:'关闭'
                        }
                    ],
                    disabled: true
                },
                {
                    key:'selector_type',
                    label:'选择器类型',
                    type:'select',
                    options:[
                        {
                            value:'defaultValue',
                            desc:'请选择选择器类型'
                        },
                        {
                            value:1,
                            desc:'单条件选择器'
                        },
                        {
                            value:2,
                            desc:'多条件取与'
                        },
                        {
                            value:3,
                            desc:'多条件取或'
                        }
                    ],
                    disabled: false
                },
                {
                    key:'seq_num',
                    label:'优先级',
                    type:'input',
                    placeholder:'最长支持4位',
                    maxlength:4,
                    disabled: false
                }
            ],
            condition:[        //条件新增和编辑
                {
                    key:'param_type',
                    label:'选择条件参数类型',
                    type:'select',
                    options:[
                        {
                            value:'defaultValue',
                            desc:'请选择参数类型'
                        },{
                            value:'IP',
                            desc:'IP'
                        },{
                            value:'USERAGENT',
                            desc:'USER_AGENT'
                        },{
                            value:'REFERER',
                            desc:'REFERER'
                        },{
                            value:'QUERY_STRING',
                            desc:'QUERY_STRING'
                        },{
                            value:'HEADER',
                            desc:'HEADER'
                        },{
                            value:'POSTPARAM',
                            desc:'POST_PARAM'
                        },{
                            value:'JSONPARAM',
                            desc:'JSON_PARAM'
                        },{
                            value:'URI',
                            desc:'URI'
                        },
                    ]
                },

                {
                    key:'param_name',
                    label:'参数名称',
                    type:'input',
                    placeholder:'最长支持255位',
                    maxlength:255

                },{
                    key:'condition_opt_type',
                    label:'条件匹配类型',
                    type:'select',
                    options:[
                        {
                            value:'defaultValue',
                            desc:'请选择匹配类型'
                        },
                        {
                            value:'equals',
                            desc:'相等'
                        },
                        {
                            value:'not_equals',
                            desc:'不相等'
                        },
                        {
                            value:'match',
                            desc:'正则匹配'
                        },{
                            value:'not_match',
                            desc:'正则匹配非'
                        },{
                            value:'gt',
                            desc:'大于'
                        },{
                            value:'gt_eq',
                            desc:'大于等于'
                        },{
                            value:'lt',
                            desc:'小于'
                        },{
                            value:'lt_eq',
                            desc:'小于等于'
                        },
                    ]

                },{
                    key:'param_value',
                    label:'参数匹配值',
                    type:'input',
                    placeholder:'最长支持255位',
                    maxlength:255

                }
            ]
        };

        this.indata = {

            selectData:{},

            tableColumns:[
                {
                    title: '序号',
                    dataIndex: 'idx',
                    width:'10px',
                    align:'center'
                }, {
                    title: 'AB分流名称',
                    dataIndex: 'gray_divide_name',
                    width:'100px',
                    align:'center'
                },
                {
                    title: '所属服务网关',
                    dataIndex: 'gateway_code',
                    width:'100px',
                    align:'center'
                },
                {
                    title: '所属主机',
                    dataIndex: 'host',
                    width:'100px',
                    align:'center'
                },
                {
                    title: '所属API组',
                    dataIndex: 'group_context',
                    width:'100px',
                    align:'center'
                },
                {
                    title: '是否启用',
                    dataIndex: 'enable',
                    width:'100px',
                    align:'center',
                    render:this.cellEnable.bind(this)
                },
                {
                    title: '选择器类型',
                    dataIndex: 'selector_type',
                    width:'80px',
                    align:'center',
                    render:this.cellSelector.bind(this)
                },
                {
                    title: '分流服务',
                    width:'100px',
                    align:'center',
                    render:this.cellService.bind(this)
                },{
                    title: '优先级',
                    dataIndex: 'seq_num',
                    width:'60px',
                    align:'center'
                },
                {
                    title: '操作',
                    width:'100px',
                    align:'center',
                    render:this.operationColumn.bind(this)

                },
            ],

            searchFieldsArr:[    //搜索
                {
                    key:'gray_divide_name',
                    label:'AB分流器名称',
                    type:'input',
                    placeholder:'AB分流器名称'

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

            ],

            childrenColumns:[
                {
                    title: '序号',
                    dataIndex:'idx',
                    align:'center'
                }, {
                    title: '名称',
                    dataIndex:'param_name',
                    align:'center'
                }, {
                    title: '参数类型',
                    dataIndex:'param_type',
                    align:'center'
                }, {
                    title: '参数匹配值',
                    dataIndex:'param_value',
                    align:'center'
                },  {
                    title: '条件匹配类型',
                    dataIndex:'condition_opt_type_txt',
                    align:'center'
                },
                {
                    title: '优先级',
                    dataIndex:'seq_num',
                    align:'center'
                },
                {
                    title:'操作',
                    align:'center',
                    render:this.operationChildrenColumn.bind(this)
                }

            ],

            opt_type_IP:[
                {
                    value:'defaultValue',
                    desc:'请选择匹配类型'
                },
                {
                    value:'equals',
                    desc:'相等'
                },
                {
                    value:'not_equals',
                    desc:'不相等'
                }
            ],
            opt_type_default:[
                {
                    value:'defaultValue',
                    desc:'请选择匹配类型'
                },
                {
                    value:'equals',
                    desc:'相等'
                },
                {
                    value:'not_equals',
                    desc:'不相等'
                },
                {
                    value:'match',
                    desc:'正则匹配'
                },{
                    value:'not_match',
                    desc:'正则匹配非'
                },{
                    value:'gt',
                    desc:'大于'
                },{
                    value:'gt_eq',
                    desc:'大于等于'
                },{
                    value:'lt',
                    desc:'小于'
                },{
                    value:'lt_eq',
                    desc:'小于等于'
                },
            ]
        };

        //需要动态渲染的数据
        this.state = {
        	listData : [],

            editKey:'',

            searchFieldsArr:this.indata.searchFieldsArr,
            searchData:{},

            modalType:'search',
            modalData:{},
            modalFieldsArr:modalFieldsArr,
            targetModalVisible: false,
            targetModalTitle: '',
            responseMessage: {              // 返回错误信息详情
                title: '',
                content_type: '',
                message: '',
                visible: false,
            }           
        }

    }

    componentDidMount(){
        this.fetchAllTableData();
        this.fetchListDataSource();
    }

    cellEnable(text,record,index){

        const cellStyle = record.enable == '0'?{color:'#f00'}:{color:'#15ff0a'};
        const enable_txt = record.enable == '0' ? '禁用':'启用';

        return (
            <span style={cellStyle} >{enable_txt}</span>
        )
    }

    cellService(text,record,index){
        let show_txt = record.gray_domain;

        if(record.enable_balancing == 1){
            show_txt='';
            let group_targets = record.group_targets;
            for(let i = 0; i < group_targets.length; i++){
                let group_target = group_targets[i];
                show_txt += group_target.host + ":" + group_target.port + "|";
            }

            if(show_txt.length > 0){
                show_txt = show_txt.substr(0, show_txt.length - 1);
            }

        }

        return (
            <span>{show_txt}</span>
        )
    }


    cellSelector(text,record,index){
        let show_txt = '';
        switch (record.selector_type) {
            case 1 :
                show_txt = '单条件选择器';
                break;
            case 2 :
                show_txt = '多条件取与';
                break;
            case 3 :
                show_txt = '多条件取或';
                break;
        }

        return (
            <span>{show_txt}</span>
        )
    }



    operationColumn(text, record, index){
        return (
            <span>
                <Popconfirm
                    title={record.enable == '0' ?'您确定启用吗？':'您确定禁用吗？'}
                    placement="left"
                    onConfirm={() => this.onEnable(record)}
                    cancelText='取消'
                    okText='确定'>
                  <a href="javascript:;">{record.enable == '0' ? <Icon type="unlock"/> : <Icon type="lock"/>}</a>
                </Popconfirm>
                <Divider type="vertical" />
                { record.content_type && (<a href="javascript:;" onClick={ this.showErrorMessage.bind(this, record) }><Icon type="file-text" /></a>) }
                { record.content_type && <Divider type="vertical" /> }
                <a href="javascript:;" onClick={ this.showModal.bind(this,'gd_edit',record) }><Icon type="edit" /></a>
                <Divider type="vertical" />
                <Popconfirm
                    title="你确定删除吗?"
                    placement="left"
                    onConfirm={() => this.onDelete(record.id)}
                    cancelText='取消'
                    okText='确定'
                >
                  <a href="javascript:;"><Icon type="delete" /></a>
                </Popconfirm>
            </span>
        )

    }

    operationChildrenColumn(text, record, index){

        const cowInfo = {
            index:index,
            record:record
        };

        const children = (
            <span>
                <a href="javascript:;" onClick={this.showModal.bind(this,'condition_edit',cowInfo)}><Icon type='edit' /></a>
                <Divider type="vertical" />
                <Popconfirm
                    title="你确定删除吗?"
                    onConfirm={() => this.onConditionDelete(record)}
                    cancelText='取消'
                    okText='确定'
                >
                  <a href="javascript:;"><Icon type='delete' /></a>
                </Popconfirm>
            </span>
        );

        return children;

    }

    onConditionDelete(record){
        let self = this,
            listData = this.state.listData;

        const id = record.id;

        const index =this.getEditKey(id);

        let conditionData = listData[index].conditions;

        conditionDeleteModel.setParam({
            id:id,
            selector_id:record.selector_id,
            gd_id:record.gd_id

        });

        conditionDeleteModel.excute(delSuccess,delFalid);

        function delSuccess(res){

            conditionData = conditionData.filter(item=>{
                return item.id !== id;
            });

            const noticeConfig = {
                description:'删除成功',
                type:'success'
            };

            self.fetchAllTableData()

            self.showNotification(noticeConfig);

        }

        function delFalid(){
            const noticeConfig = {
                description:'删除失败',
                type:'faild'
            };
            self.showNotification(noticeConfig);
        }
    }

    onEnable(record){
        //1:enable;0:disable
        let self = this;
        let listData = this.state.listData;

        const enable_state = record.enable == '0' ? '1' : '0';
        const id = record.id;
        let param={
            id:id,
            enable:enable_state
        };


        if(record.conditions.length==0){
            const noticeConfig = {
                description:'选择条件为空，不能开启',
                type:'warning'
            };

            self.showNotification(noticeConfig);
            return
        }

        if(enable_state=='1' && record.enable_balancing==1 && record.group_targets.length == 0){
            const noticeConfig = {
                description:'AB服务不能为空',
                type:'warning'
            };

            self.showNotification(noticeConfig);
            return;
        }


        grayDivideEnableModel.setParam(param,true);

        //load gateway info
        grayDivideEnableModel.excute((res)=>{

            listData.map((item,idx)=>{
                if(item.id == id){
                    item.enable=enable_state;
                    return item
                }
            });

            self.setState({
                listData:listData,
            });

            const noticeConfig = {
                description:'操作成功',
                type:'success'
            };

            self.showNotification(noticeConfig);

        },(err)=>{
            const noticeConfig = {
                description:'操作失败',
                type:'faild'
            }

            self.showNotification(noticeConfig);
        });

    }

    onDelete(id){

        let self = this,
            listData = this.state.listData;

        grayDivideDeleteModel.setParam({
            id:id
        });

        grayDivideDeleteModel.excute(delSuccess,delFalid);

        function delSuccess(res){

            listData = listData.filter(item=>{
                return item.id !== id
            });

            self.setState({
                listData:listData,
            });

            const noticeConfig = {
                description:'删除成功',
                type:'success'
            };

            self.showNotification(noticeConfig);

        }

        function delFalid(){
            const noticeConfig = {
                description:'删除失败',
                type:'faild'
            };

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

    renderSearchField(){
        let self = this;
        let gatewayOptions = self.indata.selectData["gateway"];

        //网关数据源
        this.indata.searchFieldsArr[1].options = [{"value":"defaultValue","desc":"请选择..."}].concat(gatewayOptions);

        //根据参数设置 所属主机的值
        let searchData = this.state.searchData;
        const host_id = this.props.location.query.host_id;
        const gateway_id = this.props.location.query.gateway_id;
        const group_id = this.props.location.query.group_id;
        if (gateway_id && host_id && group_id) {
            searchData.gateway_id=parseInt(gateway_id);

            this.searchInputChange('gateway_id',searchData.gateway_id);
            searchData.host_id = parseInt(host_id);
            this.searchInputChange('host_id',searchData.host_id);
            searchData.group_id = parseInt(group_id);
        }

        this.setState({
            searchFieldsArr:this.indata.searchFieldsArr,
            searchData:searchData
        });
    }

    fetchListDataSource(){
        let self = this;

        //load gateway info
        gatewayListModel.excute((res)=>{
            let gatewayOptions = self.formatGatewayList(res.data);
            self.indata.selectData["gateway"]=gatewayOptions;
            let modalFieldsArr = this.state.modalFieldsArr;
            modalFieldsArr.gray_divide[1].options=[{"value":"defaultValue","desc":"请选择..."}].concat(gatewayOptions);

            //load host info
            hostListModel.setParam({},true);
            hostListModel.excute((res)=>{
                self.indata.selectData["host"]=res.data||[];

                //load group info
                simpleGroupQueryModel.setParam({},true);
                simpleGroupQueryModel.excute((res)=>{
                    self.indata.selectData["group"]=res.data||[];


                    //render search field
                    self.renderSearchField();
                },(err)=>{
                });
            },(err)=>{

            });
        },(err)=>{

        });
    }

    fetchAllTableData(){
        let self = this;

        const group_id = this.urlQuery.group_id;

        let param={};

        if (group_id) {
            param.group_id = group_id
        }
        grayDivideQueryModel.setParam(param,true);

        grayDivideQueryModel.excute((res)=>{

            const listData = self.formatListData(res.data);
            

            self.setState({
                listData:listData
            })

        },(err)=>{

        })
    }

    getHostById(id){
        let hostItem = null;
        if(id==''){
            return hostItem;
        }
        for(let i = 0; i < this.indata.selectData.host.length; i++){
            let host = this.indata.selectData.host[i];
            if(host.id == id){
                hostItem = host;
                break;
            }
        }
        return hostItem;
    }

    getGroupInfobyId(id){
        let item = null;
        if(id==''){
            return item;
        }
        for(let i = 0; i < this.indata.selectData.group.length; i++){
            let group = this.indata.selectData.group[i];
            if(group.id == id){
                item = group;
                break;
            }
        }
        return item;
    }

    searchGrayDivideList() {

        let param = {};

        const searchData = this.state.searchData;

        if(searchData.gray_divide_name){
            param.gray_divide_name = searchData.gray_divide_name
        }
        if(searchData.gateway_id !== 'defaultValue' && searchData.gateway_id != ''){
            param.gateway_id = searchData.gateway_id
        }
        if(searchData.host_id && searchData.host_id !== 'defaultValue' && searchData.host_id != ''){
            param.host_id = searchData.host_id
        }
        if(searchData.group_id && searchData.group_id != 'defaultValue' && searchData.group_id != ''){
            param.group_id = searchData.group_id;
        }
        if(searchData.enable && searchData.enable != 'defaultValue'){
            param.enable = searchData.enable;
        }


        grayDivideQueryModel.setParam(param,true);

        grayDivideQueryModel.excute(this.seachSuccess.bind(this),this.seachFaild.bind(this));

    }

    resetSearchData(){

        let searchFieldsArr = this.state.searchFieldsArr;
        //清空网关数据源

        searchFieldsArr[2].options=[{"value":"defaultValue","desc":"请选择..."}];
        searchFieldsArr[3].options=[{"value":"defaultValue","desc":"请选择..."}];

        const searchData = {
            gray_divide_name:'',
            gateway_id:'',
            host_id:'',
            group_id:'',
            enable:''
        };

        this.setState({
            searchData:searchData,
            searchFieldsArr:searchFieldsArr
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

    formatGatewayList(listData){
        return (listData || []).map((item,idx)=>{

            return {
                key:idx,
                idx:idx + 1,
                desc:item.gateway_code,
                value:item.id
            }
        });
    }

    formatHostList(listData,gatewayId){

        listData = listData || [];
        let retData = [];

        for(let i = 0; i < listData.length; i++){
            let item = listData[i];
            if(gatewayId==null || item.gateway_id == gatewayId){
                retData.push({
                    'key':i,
                    'idx':i + 1,
                    'value':item.id,
                    'desc':item.host,
                    'enable':item.enable
                });

            }
        }

        return retData;
    }

    formatGroupList(listData,hostId){

        listData = listData || [];
        let retData = [];

        for(let i = 0; i < listData.length; i++){
            let item = listData[i];
            if(hostId ==null || item.host_id == hostId){
                retData.push({
                    'key':i,
                    'idx':i + 1,
                    'value':item.id,
                    'desc':item.group_context
                });

            }
        }

        return retData;
    }

    formatTargetListData(listData){
        listData = listData || [];
        let retData = [];

        for(let i = 0; i < listData.length; i++){
            let item = listData[i];

            retData.push({
                'key':i,
                'idx':i + 1,
                'value':item.id,
                'desc':item.host + ":" + item.port
            });
        }

        return retData;
    }


    formatListData(listData){
        let key = 0,newData = [],selector_type_txt = '',condition_opt_type_txt = '',tempData = {},conditonData = [];

        listData.forEach((item,idx)=>{
            conditonData = (item.conditions || []).map((ctItem,ctIdx)=>{

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

                tempData = ctItem;
                tempData.condition_opt_type_txt = condition_opt_type_txt;
                tempData.key = ctIdx;
                tempData.idx = ctIdx + 1;
                tempData.gd_id = item.id;
                tempData.gd_idx = idx;


                return tempData
            });

            newData.push({
                key:idx,
                idx:idx + 1,
                id:item.id || '-',
                conditions:conditonData || [],
                group_targets:item.group_targets || [],
                host:item.host|| '-',
                gateway_id:item.gateway_id,
                gray_domain:item.gray_domain,
                gateway_code:item.gateway_code|| '-',
                enable:item.enable,
                gray_divide_name:item.gray_divide_name,
                selector_id:item.selector_id,
                host_id:item.host_id,
                enable_balancing:item.enable_balancing,
                group_context:item.group_context,
                group_id:item.group_id,
                seq_num:item.seq_num,
                selector_type:item.selector_type
            })

        });

        return newData;
    }


    searchInputChange(key,e) {

        const target = e.target;

        const value = target ? target.value : e ;

        let searchData = this.state.searchData;
        let searchFieldsArr = this.state.searchFieldsArr;

        searchData[key] = value;


        if(key === 'gateway_id'){
            let hostOptions = this.formatHostList(this.indata.selectData.host,value);
            searchFieldsArr[2].options=[{"value":"defaultValue","desc":"请选择..."}].concat(hostOptions);
            searchFieldsArr[3].options=[{"value":"defaultValue","desc":"请选择..."}];
            searchData['host_id']='';
            searchData['group_id']='';
        }else if(key === 'host_id'){
            let options = this.formatGroupList(this.indata.selectData.group,value);
            searchFieldsArr[3].options=[{"value":"defaultValue","desc":"请选择..."}].concat(options);
            searchData['group_id']='';
        }


    	this.setState({
            searchFieldsArr:searchFieldsArr,
    		searchData: searchData
    	})

    }

    modalInputChange(key,e) {
        let self = this;

        const target = e.target,
            value = target ? target.value : e;

        let modalData = this.state.modalData,
            modalType = this.state.modalType;

        const type = (modalType == 'gd_add' || modalType == 'gd_edit')?'gray_divide':'condition';

        let modalFieldsArr = this.state.modalFieldsArr,
            temp = '',
            disabled = false,
            newFieldsArr = this.state.modalFieldsArr[type];

        if (typeof value === 'string') {
            modalData[key] = value.trim();
        } else {
            modalData[key] = value;
        }


        if(key === 'gateway_id'){
            let hostOptions = this.formatHostList(this.indata.selectData.host,value);

            newFieldsArr[2].options=[{"value":"defaultValue","desc":"请选择..."}].concat(hostOptions);
            newFieldsArr[3].options=[{"value":"defaultValue","desc":"请选择..."}];
            newFieldsArr[4].options=[];
            modalData['group_id']='';
            modalData['host_id']='';
            modalData['group_targets']=[];
            modalData['gray_domain']=''
        }else if(key === 'host_id'){

            let options = this.formatGroupList(this.indata.selectData.group,value);

            newFieldsArr[3].options=[{"value":"defaultValue","desc":"请选择..."}].concat(options);
            newFieldsArr[4].options=[];
            modalData['group_id']='';
            modalData['group_targets']=[];
            modalData['gray_domain']=''
        }else if(key === 'group_id'){
            const targetsIndex = newFieldsArr.findIndex(item => item.key === 'group_targets'),
                domainIndex = newFieldsArr.findIndex(item => item.key === 'gray_domain');

            let param = {
                group_id:value
            };

            let groupInfo = this.getGroupInfobyId(value);
            let enable_balancing = groupInfo.enable_balancing;

            if(enable_balancing == 1){
                newFieldsArr[targetsIndex].disabled = false;
                newFieldsArr[domainIndex].disabled = true;
            }else{
                newFieldsArr[domainIndex].disabled = false;
                newFieldsArr[targetsIndex].disabled = true;
            }

            targetsQueryModel.setParam(param,true);
            targetsQueryModel.excute((res)=>{

                const options = self.formatTargetListData(res.data);
                newFieldsArr[targetsIndex].options=[].concat(options);
                modalData['group_targets']=[];
                modalData['gray_domain']='';

                modalFieldsArr[type] = newFieldsArr;
                self.setState({
                    modalData,
                    modalFieldsArr
                })

            },(err)=>{

            });

            return;
        }else if(key == 'param_type'){

            if(value == 'IP' || value == 'URI' || value == 'REFERER' || value == 'USERAGENT' || value == 'Host'){
                disabled = true;
                modalData.param_name = value;
            }else{
                disabled = false;
                modalData.param_name = '';
            }

            newFieldsArr = modalFieldsArr[type].map(item=>{
                temp = item;

                if(item.key == 'param_name'){
                    temp.disabled = disabled;
                }

                return temp
            });

            if(value == 'IP'){
                modalData.condition_opt_type='';//清空匹配类型
                newFieldsArr[2].options = this.indata.opt_type_IP;
            }else{
                newFieldsArr[2].options = this.indata.opt_type_default;
            }
        }

        modalFieldsArr[type] = newFieldsArr;
        this.setState({
            modalData,
            modalFieldsArr
        })
    }

    handleSearch(e) {

    	e.preventDefault();

    	this.searchGrayDivideList();

    }

    showErrorMessage (record) {
        const { content_type, message, group_name } = record
        this.setState({
            responseMessage: {
                title: `路由${ group_name }组返回错误信息详情`,
                content_type,
                message,
                visible: true,
            }
        })
    }

    closeErrorMessage () {
        this.setState({
            responseMessage: {...this.state.responseMessage, visible: false}
        })
    }

    showModal(flag,rowInfo){
        let modalData = {};
        let editKey = '';
        let confirmParam ;
        let self = this;

        if(flag == 'gd_edit'){

            const itemData = rowInfo;

            editKey = this.fetchEditKey(rowInfo);
            const group_targets = itemData.group_targets || [];

            let new_group_targets = [];
            for(let i = 0; i < group_targets.length; i++){
                let target = group_targets[i];
                new_group_targets.push(target.id);
            }


            modalData = {
                id:rowInfo.id,
                gray_divide_name:rowInfo.gray_divide_name,
                gateway_id:rowInfo.gateway_id,
                host_id:rowInfo.host_id,
                group_id:rowInfo.group_id,
                group_targets:new_group_targets,
                gray_domain:rowInfo.gray_domain,
                enable:rowInfo.enable+'',
                seq_num:rowInfo.seq_num,
                selector_type:rowInfo.selector_type
            };


            let { modalFieldsArr } = this.state;
            modalFieldsArr['gray_divide'].find(item => item.key === 'gray_domain').disabled = true;
            const targetsIndex = modalFieldsArr.gray_divide.findIndex(item => item.key === 'group_targets'),
                domainIndex = modalFieldsArr.gray_divide.findIndex(item => item.key === 'gray_domain'),
                hostIndex = modalFieldsArr.gray_divide.findIndex(item => item.key === 'host_id'),
                groupIndex = modalFieldsArr.gray_divide.findIndex(item => item.key === 'group_id');

            let groupInfo = this.getGroupInfobyId(modalData.group_id);
            let enable_balancing = groupInfo.enable_balancing;

            if(enable_balancing == 1){
                modalFieldsArr.gray_divide[targetsIndex].disabled = false;
                modalFieldsArr.gray_divide[domainIndex].disabled = true;
            }else{
                modalFieldsArr.gray_divide[domainIndex].disabled = false;
                modalFieldsArr.gray_divide[targetsIndex].disabled = true;
            }

            let hostOptions = this.formatHostList(this.indata.selectData.host,modalData.gateway_id);
            modalFieldsArr.gray_divide[hostIndex].options=[{"value":"defaultValue","desc":"请选择..."}].concat(hostOptions);

            let options = this.formatGroupList(this.indata.selectData.group,modalData.host_id);
            modalFieldsArr.gray_divide[groupIndex].options=[{"value":"defaultValue","desc":"请选择..."}].concat(options);

            targetsQueryModel.setParam({
                group_id:modalData.group_id
            },true);
            targetsQueryModel.excute((res)=>{
                const options = self.formatTargetListData(res.data);
                modalFieldsArr.gray_divide[targetsIndex].options=[].concat(options);
                const content = self.renderModalContent.bind(self);
                confirmParam = {
                    title:'编辑AB分流器',
                    cancelText:'取消',
                    okText:'确认',
                    content:content || 'hello',
                    onOk:self.modalHandleOk.bind(self),
                    width:'50%'
                };

                self.resetModalFieldsArr(flag);
                self.setState({
                    modalType:flag,
                    modalData,
                    editKey
                },()=>{
                    self.addModal.show(confirmParam);
                });


            },(err)=>{

            });
            return;
        }else if(flag == 'gd_add'){
            modalData = {
                enable:'0'
            };
            confirmParam = {
                title:'新增AB分流器',
                cancelText:'取消',
                okText:'确认',
                content:this.renderModalContent.bind(this),
                onOk:this.modalHandleOk.bind(this),
                width:'50%'
            };
            let { modalFieldsArr } = this.state;
            modalFieldsArr['gray_divide'].find(item => item.key === 'gray_domain').disabled = true;

        }else if(flag == 'condition_add'){
            editKey = rowInfo.index;
            modalData = {};
            confirmParam = {
                title:'新增条件配置',
                cancelText:'取消',
                okText:'确认',
                content:this.renderModalContent.bind(this),
                onOk:this.modalHandleOk.bind(this),
                width:'50%'
            };
            modalData.selector_id = rowInfo.record.selector_id;
            modalData.gray_id = rowInfo.record.id;
            // 新增时，将param_name字段的状态重置
            const { condition } = this.state.modalFieldsArr;
            condition.find(item => item.key === 'param_name').disabled = false
        }else if(flag == 'condition_edit'){

            editKey = this.getEditKey(rowInfo.record.id);

            const record = rowInfo.record;

            modalData = {
                param_type:record.param_type,
                param_name:record.param_name,
                condition_opt_type:record.condition_opt_type,
                param_value:record.param_value,
                id:record.id
            };

            // 如果选择条件参数类型==IP，那么条件匹配类型更改数据源
            if(record.param_type=='IP'){
                this.state.modalFieldsArr.condition[2].options = this.indata.opt_type_IP;
            }else{
                this.state.modalFieldsArr.condition[2].options = this.indata.opt_type_default;
            }


            confirmParam = {
                title:'编辑条件配置',
                cancelText:'取消',
                okText:'确认',
                content:this.renderModalContent.bind(this),
                onOk:this.modalHandleOk.bind(this),
                width:'50%'
            };
            // 查询param_type字段数据，如果匹配则将参数名称设为不可更改
            let { condition } = this.state.modalFieldsArr,
                param_type = modalData['param_type']
            if (/^(IP|RI|REFERER|USERAGENT|Host)$/.test(param_type)) {
                condition.find(item => item.key === 'param_name').disabled = true
            } else {
                condition.find(item => item.key === 'param_name').disabled = false
            }


        }
        this.resetModalFieldsArr(flag);
        this.setState({
            modalType:flag,
            modalData,
            editKey
        },()=>{
            this.addModal.show(confirmParam);
        });
    }

    getEditKey(condition_id){

        const listData = this.state.listData;

        let editKey = '',flag=false;

        listData.forEach((item,idx)=>{

            flag = false;

            item.conditions.forEach(ctItem=>{

                if(ctItem.id == condition_id){
                    flag = true;
                }

            });

            if(flag){
                editKey = idx;
            }

        });

        return editKey;

    }


    fetchEditKey(record){
        const listData = this.state.listData;

        let editKey = '';

        listData.forEach((item,idx)=>{

            if(item.id == record.id){
               editKey = idx; 
            }

        });

        return editKey

    }

    addGrayDivideGroup(){
        const self = this;

        let listData = this.state.listData,
            modalData = this.state.modalData,
            modalType = this.state.modalType,
            modalFieldsArr = this.state.modalFieldsArr,
           seq_num = this.state.seq_num;

        let groupId = modalData.group_id;

        let gorupInfo = this.getGroupInfobyId(groupId);

        if(gorupInfo.enable_balancing == '0'){
            modalData.group_targets=[];
        }else{
            modalData.gray_domain='';
        }

        let param = formatObj(modalData);
        param.selector_name=param.gray_divide_name + '|selector';
        param.group_targets = JSON.stringify(param.group_targets);

        grayDivideAddModel.setParam(param,true);
        grayDivideAddModel.excute(onSucess,onFailed);

        function onSucess(res){

            self.addModal.hide();
            self.fetchAllTableData();

            const noticeConfig = {
                description:'新增成功',
                type:'success'
            };

            self.showNotification(noticeConfig);

        }

        function onFailed(err){
            let msg = '新增失败';
            if(err.err_no == 3001){
                msg = err.msg;
            }

            const noticeConfig = {
                description:msg,
                type:'faild'
            };

            self.showNotification(noticeConfig);

        }
    }

    editGrayDivideGroup(){
        const self = this;

        let listData = this.state.listData,
            modalData = this.state.modalData,
            modalType = this.state.modalType,
            modalFieldsArr = this.state.modalFieldsArr;

        let groupId = modalData.group_id;

        let gorupInfo = this.getGroupInfobyId(groupId);

        if(gorupInfo.enable_balancing == '0'){
            modalData.group_targets=[];
        }else{
            modalData.gray_domain='';
        }


        let param = formatObj(modalData);
        param.selector_name=param.gray_divide_name + '|selector';
        param.group_targets = JSON.stringify(param.group_targets);

        grayDivideUpdateModel.setParam(param,true);
        grayDivideUpdateModel.excute(onSucess,onFailed);

        function onSucess(res){

            self.addModal.hide();
            self.fetchAllTableData();

            const noticeConfig = {
                description:'操作成功',
                type:'success'
            };

            self.showNotification(noticeConfig);

        }

        function onFailed(err){
            let msg = '操作失败';
            if(err.err_no == 3001){
                msg = err.msg;
            }

            const noticeConfig = {
                description:msg,
                type:'faild'
            };

            self.showNotification(noticeConfig);

        }
    }

    addCondition(){
        const self = this;
        let {listData,modalData,editKey} = this.state;

        editKey = (editKey == 0 || editKey)?editKey:listData.length -1;

        const param = formatObj(modalData);

        conditionAddModel.setParam(param);

        conditionAddModel.excute(res=>{

            modalData.id = res.data.id;

            listData[editKey].conditions.push(modalData);

            listData = self.formatListData(listData);

            self.setState({
                listData:listData,
                editKey:'',
            });

            const noticeConfig = {
                description:'新增条件成功',
                type:'success'
            };

            self.showNotification(noticeConfig);

            self.addModal.hide();

        },err=>{

            const description = err.msg == '条件已存在'?'条件已存在，不能重复添加':'新增条件失败';

            const noticeConfig = {
                description:description,
                type:'faild'
            };

            self.showNotification(noticeConfig);
        })
    }

    editCondition(){

        const self = this;
        let {listData,modalData,editKey} = this.state;

        modalData.gray_id = listData[editKey].id;

        const param = formatObj(modalData);

        conditionUpdateModel.setParam(param);
        conditionUpdateModel.excute(res=>{

            let conditions = listData[editKey].conditions;
            let newConditions = conditions.map(item=>{

                if(item.id == modalData.id){
                    return Object.assign(item,modalData)
                }else{
                    return item
                }
            });

            listData[editKey].conditions = newConditions;
            listData = self.formatListData(listData);

            self.setState({
                listData:listData,
                editKey:'',
            });

            const noticeConfig = {
                description:'编辑条件成功',
                type:'success'
            };

            self.showNotification(noticeConfig);

            self.addModal.hide();


        },err=>{

            const description = err.msg == '条件已存在'?'条件已存在，不能重复添加':'新增条件失败';

            const noticeConfig = {
                description:description,
                type:'faild'
            }

            self.showNotification(noticeConfig);

        })

    }

    modalHandleOk(){
        const modalType = this.state.modalType;

        if(this.paramValidate()){

            if(modalType == 'gd_add'){
                this.addGrayDivideGroup();
            }else if (modalType == 'gd_edit'){
                this.editGrayDivideGroup();
            }else if(modalType == 'condition_add'){
                this.addCondition();
            }else if (modalType == 'condition_edit'){
                this.editCondition();
            }

        }

    }

    resetModalFieldsArr(modalType){

        let contentData = this.state.modalFieldsArr;

        let type;
        if(modalType.indexOf('gd') > -1){
            type = 'gray_divide'
        }else{
            type = 'condition'
        }

        let temp;

        let newModalFields =  contentData[type].map(item=>{

            temp = item;
            delete temp.help;
            delete temp.validateStatus;
            delete temp.hasFeedback;

            return temp
        })

        contentData[type] = newModalFields;

        this.setState({
            modalFieldsArr:contentData
        })

    }

    is_modal_field_disabled(key,type){
        let { modalFieldsArr } = this.state;

        const keyIndex = modalFieldsArr[type].findIndex(item => item.key === key);

        if(keyIndex == -1){
            return true;
        }

        return modalFieldsArr.gray_divide[keyIndex].disabled;

    }

    //检验参数
    paramValidate(){
        let modalData = this.state.modalData || {},
            listData = this.state.listData,
            modalType = this.state.modalType,
            modalFieldsArr = this.state.modalFieldsArr,
            editKey = this.state.editKey,
            flag = 0,
            key,
            value,
            temp,
            reg = /^[a-zA-Z0-9\-_]+$/,
            reg2 = /^[a-zA-Z0-9\-_\.\/:]+$/,
            reg3 = /^[0-9]\d*$/,
            _this = this;

        const type = (modalType == 'gd_add' || modalType == 'gd_edit')?'gray_divide':'condition';
        const itemData = listData[editKey];

        let newFields = modalFieldsArr[type].map(item=>{

            key = item.key;
            value = modalData[key];
            temp= item;


            if(this.is_modal_field_disabled(key,type)==false && ((item.type == 'input' && !value) || (item.type == 'textArea' && !value) || (item.type == 'select' && (value == 'defaultValue' || !value || value.length == 0)))){
                temp.validateStatus = 'error';
                temp.help = '必填项不能为空';
                flag++;
            }else if(this.is_modal_field_disabled(key,type)==false && (item.key == 'gray_domain') && !reg2.test(value)){
                temp.validateStatus = 'error';
                temp.help = '仅支持字母数字-_/.';
                flag++;
            }else if(modalType == 'gd_edit' && item.key == 'selector_type' && modalData.selector_type == 1 && itemData.conditions && itemData.conditions.length > 1){ //多条件改为单条件

                temp.validateStatus = 'error';
                flag++;

                const noticeConfig = {
                    description:'当前匹配了多个条件，无法修改为单条件选择器，如需修改，请先删除条件。',
                    type:'faild'
                }

                this.showNotification(noticeConfig);

            }else if(type == 'condition' && item.key == 'param_name' && !reg.test(value)){
                temp.validateStatus = 'error';
                temp.help = '仅支持字母数字-_';
                flag++;

            }else if ((item.key == 'seq_num') && !reg3.test(value)){
                temp.validateStatus = 'error';
                temp.help = '仅支持0-9的正整数';
                flag++;
            }else {
                temp.validateStatus = 'success';
                temp.help = '';
            }
            item.hasFeedback = true;
            return temp
        });

        modalFieldsArr[type] = newFields

        this.setState({
            modalFieldsArr: modalFieldsArr
        })

        flag = flag == 0 ?true:false;

        return flag;
    }

    renderSearchBar() {

        const InputChangeHandle = this.searchInputChange.bind(this);
        
        const fieldsValue = this.state.searchData;

        let fieldsArr = this.indata.searchFieldsArr;

        const spanNum = 8;

        const fieldsConfig = {
            fieldsValue:fieldsValue,
            fieldsArr:fieldsArr,
            InputChangeHandle:InputChangeHandle,
            spanNum:spanNum

        };

    	return (
    		<Form
                className="ant-advanced-search-form search_container"
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


        const modalType = this.state.modalType;

        const InputChangeHandle = this.modalInputChange.bind(this);
        
        const fieldsValue = this.state.modalData;

        let fieldsArr = [];
        if(modalType == 'gd_add' || modalType == 'gd_edit'){
            fieldsArr = this.state.modalFieldsArr.gray_divide;
        }else if(modalType == 'condition_edit' || modalType == 'condition_add'){
            fieldsArr = this.state.modalFieldsArr.condition;
        }
        const spanNum = 40;
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
                <div>后端服务错误响应类型：{ content_type }</div>
                <div>后端服务错误响应内容：{ message }</div>
            </Modal>
        )
    }

    renderConditionInfo(record,index){

        const cowInfo = {
            record:record,
            index:index
        };

        let btn = '';

        if(record.selector_type !== 1 || (record.selector_type == 1 && record.conditions.length == 0)){//非单条件
            btn = <Button icon='plus' type='primary' onClick={this.showModal.bind(this,'condition_add',cowInfo)}>新增</Button>;
        }

        return (
            <div className='childtable_content'>
                {btn}
                {record.selector_type == 1 && record.conditions.length == 0?'':<Table
                    columns={this.indata.childrenColumns}
                    dataSource={record.conditions}
                    pagination={false}
                    bordered={false}
                    className='child_table'
                />}
            </div>
        )

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
                        <Button className="editable-add-btn" onClick={this.showModal.bind(this,'gd_add')} icon='plus' type='primary' className='right_btn'>新增</Button>
                    </div>
                    <Table
                        columns={this.indata.tableColumns}
                        dataSource={this.state.listData}
                        title={()=>{return (<div style={{textAlign:'center',fontSize:'20px',color:"#000"}}>AB分流管理</div>)}}
                        bordered={true}
                        pagination={pagenationObj}
                        expandedRowRender={this.renderConditionInfo.bind(this)}
                    />
                    <WkModal ref={(wkmodal)=>{this.addModal = wkmodal}}

                    />
                    { this.renderErrorMessage() }
                </Content>

            </div>

        );

    }

}

export default GrayDivide;