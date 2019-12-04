import React, {Component} from 'react'
import {Layout,Form, Button, Modal, Row, Col, Divider, Popconfirm, Table, notification, Icon,Tooltip} from 'antd'

import BaseView from '../../core/view.base'
import WkModal from '../../ui/ui.modal'
import FieldsContent from '../../ui/ui.fiedld'

import {formatObj} from '../../util/util'

import { 
    FirewallListModel,
    DelFirewallModel,
    AddFirewallModel,
    EditFirewallModel,

    AddFwRuleModel,
    EditFwRuleModel,
    DelFwRuleModel,
    DelFwRuleByFwIdModel,
    UpdateEnableModel

} from '../../models/firewall.models'
import {GatewayListModel, HostListModel} from "../../models/host_manager_models";


const { Header, Content } = Layout;

let firewallListModel = FirewallListModel.getInstance(),
    delFirewallModel = DelFirewallModel.getInstance(),
    addFirewallModel = AddFirewallModel.getInstance(),
    editFirewallModel = EditFirewallModel.getInstance(),

    addFwRuleModel = AddFwRuleModel.getInstance(),
    editFwRuleModel = EditFwRuleModel.getInstance(),
    delFwRuleModel = DelFwRuleModel.getInstance(),
    delFwRuleByFwIdModel = DelFwRuleByFwIdModel.getInstance(),
    gatewayListModel = GatewayListModel.getInstance(),
    hostListModel = HostListModel.getInstance(),
    updateEnableModel = UpdateEnableModel.getInstance();


class Firewall extends BaseView {

    constructor(props) {

        super(props);


        this.indata = {

            tableColumns:[
                {
                    title: '序号',
                    dataIndex:'idx',
                    width:'50px',
                    align:'center'
                }, {
                    title: '防火墙名称',
                    dataIndex: 'name',
                    width:'100px',
                    align:'center'
                },{
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
                    title: '是否拒绝',
                    dataIndex: 'is_allowed_txt',
                    width:'100px',
                    align:'center'
                }, {
                    title: '当前状态',
                    width:'100px',
                    align:'center',
                    render:this.cellEnable.bind(this)
                },
                {
                    title: '选择器名称',
                    dataIndex:'selector_name',
                    width:'100px',
                    align:'center',
                },{
                    title: '选择器类型',
                    dataIndex: 'selector_type_txt',
                    width:'100px',
                    align:'center'
                },
                {
                    title: '操作',
                    width:'100px',
                    align:'center',
                    render:this.operationColumn.bind(this)

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
                },{
                    title:'操作',
                    align:'center',
                    render:this.operationChildrenColumn.bind(this)
                }

            ],

            searchFieldsArr:[    //搜索
                {
                    key:'name',
                    label:'名称',
                    type:'input',
                    placeholder:'请输入防火墙名称'

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
                    key:'enable',
                    label:'是否启用',
                    type:'select',
                    options:[
                        {
                            value:'defaultValue',
                            desc:'请选择是否启用'
                        },
                        {
                            value:'1',
                            desc:'启用'
                        },{
                            value:'0',
                            desc:'禁用'
                        }
                    ],

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

        }

        let modalFieldsArr = {
            firewall:[        //防火墙新增和编辑
                {
                    key:'name',
                    label:'防火墙名称',
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
                    key:'is_allowed',
                    label:'命中策略',
                    type:'select',
                    options:[
                        {
                            value:'defaultValue',
                            desc:'请选择是否拒绝'
                        },
                        {
                            value:'0',
                            desc:'拒绝'
                        },{
                            value:'1',
                            desc:'放行'
                        }
                    ]

                },{
                    key:'enable',
                    label:'是否启用',
                    type:'select',
                    options:[
                        {
                            value:'defaultValue',
                            desc:'请选择是否启用'
                        },
                        {
                            value:'1',
                            desc:'启用'
                        },{
                            value:'0',
                            desc:'禁用'
                        },
                    ],
                    disabled:true

                },
                {
                    key:'selector_name',
                    label:'选择器名称',
                    type:'input',
                    placeholder:'最长支持49位',
                    maxlength:49

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
                    ]

                },
                {
                    key:'http_status',
                    label:'http响应码',
                    type:'input',
                    placeholder:'仅支持数字,最长3位',
                    maxlength:3

                },
                {
                    key:'content_type',
                    label:'拦截响应类型',
                    type:'select',
                    options:[
                        {
                            value:'defaultValue',
                            desc:'请选择拦截响应类型'
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
                    label:'拦截响应内容',
                    type:'textArea',
                    placeholder:'若拦截响应类型已选择，则命中响应内容必填，类型为选择，内容可不填',
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
        }

        this.state = {

            allList:[],
            listData : [],

            editKey:'',

            searchData:{},

            modalType:'',
            modalData:{},
            addFwStatus:'done',
            modalFieldsArr:modalFieldsArr,
            responseMessage: {                  // 返回错误信息详情
                title: '',
                content_type: '',
                message: '',
                visible: false,
            } 
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
                modalFieldsArr.firewall[1].options=modalFieldsArr.firewall[1].options.concat(optionData.gateway_codes);
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

    fetchIEHost(gateway_id){
        let self = this;
        let modalFieldsArr = this.state.modalFieldsArr;
        const param = {}
        param.gateway_id = gateway_id
        hostListModel.setParam(param)
        return new Promise((resolve, reject) => {

            hostListModel.excute((res)=>{
                const optionData = self.seachParFormatListHostData(res.data);
                modalFieldsArr.firewall[2].options =optionData.hosts;
                self.setState({modalFieldsArr:modalFieldsArr})
                resolve(res)
            },(err)=>{
                reject(err)
            })
        }).catch(err => {

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

    renderCellContent(key,text, row, index){

        return {
            children:row[key],
            props:{
                rowSpan:row.rowSpan
            }
        }

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

    renderConditionInfo(record,index){

        const cowInfo = {
            record:record,
            index:index
        }

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

    operationColumn(text, record, index){

        const cowInfo = {
            index:index,
            record:record
        }

        const children = (
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
                <a href="javascript:;" onClick={this.showModal.bind(this,'fw_edit',cowInfo)}><Icon type='edit' /></a>
                <Divider type="vertical" />
                <Popconfirm 
                    title="你确定删除吗?" 
                    onConfirm={() => this.onDelete(record.id)}
                    cancelText='取消'
                    okText='确定'
                >
                  <a href="javascript:;"><Icon type='delete' /></a>
                </Popconfirm>
            </span>
        )

        return children

    }


    updateEnable(record){

        let self = this,
            listData = this.state.listData;

        const id = record.id;
        const enable = record.enable == '0' ? '1' : '0'
        if(record.conditions.length<1 && record.enable == '0'){
            const noticeConfig = {
                description:'条件未定义，不能开启!',
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

    operationChildrenColumn(text, record, index){

        const cowInfo = {
            index:index,
            record:record
        }

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
        )

        return children

    }

    onDelete(id){

        let self = this,
            listData = this.state.listData,
            allList = this.state.allList;

        delFirewallModel.setParam({
            id:id
        })

        delFirewallModel.excute(delSuccess,delFalid);

        function delSuccess(res){

            listData = listData.filter(item=>{
                return item.id !== id
            })

            allList = allList.filter(item=>{
                return item.id !== id
            })

            self.setState({
                listData:listData,
                allList:allList
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

    onConditionDelete(record){
        let self = this,
            listData = this.state.listData;

        const id = record.id,
              waf_idx = record.waf_idx;

        const index =this.getEditKey(id);

        let conditionData = listData[index].conditions;

        delFwRuleModel.setParam({
            id:id
        })

        delFwRuleModel.excute(delSuccess,delFalid);

        function delSuccess(res){

            conditionData = conditionData.filter(item=>{

                return item.id !== id;

            })

            listData[waf_idx].conditions = conditionData;

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

        firewallListModel.excute((res)=>{

            const listData = self.formatListData(res.data);

            self.setState({
                allList:listData,
                listData:listData
            })

        },(err)=>{

        })
    }

    searchFirewallList() {


        let param = {};

        const searchData = this.state.searchData;

        if(searchData.name){
            param.name = searchData.name
        }
        if(searchData.gateway_code && searchData.gateway_code !== 'defaultValue'){
            param.gateway_id = searchData.gateway_code
        }

        if(searchData.host_id && searchData.host_id !== 'defaultValue'){
            param.host_id = searchData.host_id
        }
        if(searchData.name){
            param.name = searchData.name
        }
        if(searchData.id){
            param.id = searchData.id
        }
        if(searchData.enable && searchData.enable !== 'defaultValue'){
            param.enable = searchData.enable
        }

        firewallListModel.setParam(param,true);

        firewallListModel.excute(this.seachSuccess.bind(this),this.seachFaild.bind(this));

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

        let key = 0,newData = [],selector_type_txt = '',condition_opt_type_txt = '',tempData = {},conditonData = [];

        listData.forEach((item,idx)=>{

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
                tempData.waf_id = item.id;
                tempData.waf_idx = idx;

                
                return tempData
            })

            newData.push({
                key:idx,
                idx:idx + 1,
                id:item.id || '',
                name:item.name || {},
                gateway_id:item.gateway_id ||'',
                gateway_code:item.gateway_code,
                host_id:item.host_id,
                host:item.host,
                host_enable:item.host_enable,
                selector_id:item.selector_id || '',
                selector_name:item.selector_name || '',
                enable:item.enable,
                enable_txt:item.enable == '0'? '禁用':'启用',
                is_allowed:item.is_allowed,
                is_allowed_txt:item.is_allowed == '1'? '放行':'拒绝',
                need_log:item.need_log,
                selector_type:item.selector_type,
                selector_type_txt:selector_type_txt,
                conditions: conditonData,
                http_status:item.http_status,
                content_type: item.content_type,
                message: item.message
            })

        })

        return newData;

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

    modalInputChange(key,e) {

        const target = e.target;

        const value = target ? target.value : e ;

        let modalData = this.state.modalData,
            modalType = this.state.modalType;

        if (typeof value === 'string') {
            modalData[key] = value.trim();
        } else {
            modalData[key] = value
        }


        const type = (modalType == 'fw_add' || modalType == 'fw_edit')?'firewall':'condition';

        let modalFieldsArr = this.state.modalFieldsArr,
            temp = '',
            disabled = false,
            newFieldsArr = this.state.modalFieldsArr[type];

        if(key == 'param_type'){

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

            modalFieldsArr[type] = newFieldsArr;

        }

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


        this.setState({
            modalData: modalData,
            modalFieldsArr:modalFieldsArr
        })

    }

    handleSearch(e) {
        e.preventDefault();
        this.searchFirewallList();
    }

    showModal(flag,cowInfo){
        let modalData = this.state.modalData;

        let editKey = '';

        let confirmParam ;

        const { modalFieldsArr } = this.state,
            messageIndex = modalFieldsArr.firewall.findIndex(item => item.key === 'message')
    
        modalFieldsArr.firewall[messageIndex].disabled = false
        if(flag == 'fw_edit'){

            const itemData= this.state.listData[cowInfo.index];
            editKey = cowInfo.index;

            modalData = {
                name:itemData.name,
                gateway_id:itemData.gateway_id,
                host_id:itemData.host_id,
                selector_name:itemData.selector_name,
                enable:itemData.enable == '1'?'1':'0',
                selector_type:itemData.selector_type,
                is_allowed:itemData.is_allowed == '1' ? '1':'0',
                need_log:itemData.need_log == '1' ? '1':'0',
                http_status:itemData.http_status || '',
                content_type: itemData.content_type,
                message: itemData.message || ''
            }
            //根据gateway_id获取所属主机的数据源
            this.fetchIEHost(itemData.gateway_id)
            confirmParam = {
                title:'编辑防火墙配置',
                cancelText:'取消',
                okText:'确认',
                content:this.renderModalContent.bind(this),
                onOk:this.modalHandleOk.bind(this),
                width:'50%'

            }
        }else if(flag == 'fw_add'){

            modalData = {
                is_allowed:'0',
                enable:'0'
            };

            confirmParam = {
                title:'新增防火墙配置',
                cancelText:'取消',
                okText:'确认',
                content:this.renderModalContent.bind(this),
                onOk:this.modalHandleOk.bind(this),
                width:'50%'
            }
        }else if(flag == 'condition_add'){
            editKey = cowInfo.index;
            modalData = {};
            confirmParam = {
                title:'新增条件配置',
                cancelText:'取消',
                okText:'确认',
                content:this.renderModalContent.bind(this),
                onOk:this.modalHandleOk.bind(this),
                width:'50%'
            }
            // 新增时，将param_name字段的状态重置
            const { condition } = this.state.modalFieldsArr
            condition.find(item => item.key === 'param_name').disabled = false
        }else if(flag == 'condition_edit'){

            editKey = this.getEditKey(cowInfo.record.id);

            const record = cowInfo.record;

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
            }
            // 查询param_type字段数据，如果匹配则将参数名称设为不可更改
            let { condition } = this.state.modalFieldsArr,
                param_type = modalData['param_type']
            if (/^(IP|RI|REFERER|USERAGENT|Host|URI)$/.test(param_type)) {
                condition.find(item => item.key === 'param_name').disabled = true
            } else {
                condition.find(item => item.key === 'param_name').disabled = false
            }

            
        }

        this.resetModalFieldsArr(flag);

        this.setState({
            modalType:flag,
            modalData:modalData,
            editKey:editKey,
            modalFieldsArr: this.state.modalFieldsArr
        })

        this.addModal.show(confirmParam);

    }

    resetModalFieldsArr(modalType){

        let contentData = this.state.modalFieldsArr;

        let type;
        if(modalType.indexOf('fw') > -1){
            type = 'firewall'
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

    modalHandleOk(){

        const modalType = this.state.modalType;

        if(this.paramValidate()){

            if(modalType == 'fw_add'){
                this.addFirewall();
            }else if (modalType == 'fw_edit'){
                this.editFirewall();
            }else if(modalType == 'condition_add'){
                this.addCondition();
            }else if (modalType == 'condition_edit'){
                this.editCondition();
            }
        }

    }

    modalHandleCancel(){

        const addFwStatus = this.state.addFwStatus;

        if(addFwStatus == 'doing'){
            this.setState({
                tempData:'',
                addFwStatus:'done'
            })

            const noticeConfig = {
                description:'由于您取消了防火墙的条件配置，该防火墙不会生效，如需生效，请添加条件配置。',
                type:'faild'
            }

            this.showNotification(noticeConfig);    
        }

        this.addModal.hide();
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
            modalFields,
            reg = /^[a-zA-Z0-9\-_]+$/;

        const type = (modalType == 'fw_add' || modalType == 'fw_edit')?'firewall':'condition';

        const itemData = listData[editKey];

        let newFields = modalFieldsArr[type].map(item=>{
            key = item.key;
            value = modalData[key];
            temp= item;
            if((item.type == 'input' && !value) || (item.type == 'textArea' && !value) || (item.type == 'select' && (value == 'defaultValue' || !value))){
                if(item.key == 'block_time' && item.disabled){
                    temp.validateStatus = 'success';
                    temp.help = '';
                } else {
                    if (item.key === 'content_type' || item.key === 'http_status') {
                        // 不做处理
                    } else if (item.key === 'message') {
                        if ((modalData['content_type'] && modalData['content_type'] !== 'defaultValue')) {
                            temp.validateStatus = 'error';
                            flag++;

                            const messageIndex = modalFieldsArr[type].findIndex(item => item.key === 'message')
                            modalFieldsArr[type][messageIndex].disabled = true
                            this.setState({
                                modalFieldsArr
                            })
                        }
                    } else {
                        temp.validateStatus = 'error';
                        temp.help = '必填项不能为空';
                        flag++;
                    }
                }
                
            }else if(modalType == 'fw_edit' && item.key == 'selector_type' && modalData.selector_type == 1 && itemData.conditions && itemData.conditions.length > 1){ //多条件改为单条件

                    temp.validateStatus = 'error';
                    flag++;

                    const noticeConfig = {
                        description:'当前防火墙匹配了多个条件，无法修改为单条件选择器，如需修改，请先删除条件。',
                        type:'faild'
                    }

                    this.showNotification(noticeConfig);

            }else if(type == 'condition' && item.key == 'param_name' && !reg.test(value)){
                temp.validateStatus = 'error';
                temp.help = '仅支持字母数字-_';
                flag++;

            }else{
                temp.validateStatus = 'success';
                temp.help = '';
            }
            item.hasFeedback = true;

            return temp

        })

        modalFieldsArr[type] = newFields;

        this.setState({
            modalFieldsArr:modalFieldsArr
        })

        flag = flag == 0 ?true:false;

        return flag;
    }

    //新增配置信息
    addFirewall(){

        const self = this;

        let listData = this.state.listData,
            modalData = this.state.modalData;

        if (modalData['content_type'] === 'defaultValue' || !modalData['content_type']) {
            modalData['content_type'] = '';
            modalData['message'] = '';
        }

        const param = formatObj(modalData);

        addFirewallModel.setParam(param);

        addFirewallModel.excute(addFwSucess,addFwFaild);

        function addFwSucess(res){



            const noticeConfig = {
                description:'新增成功',
                type:'success'
            }
            self.fetchAllList();
            self.showNotification(noticeConfig);

            self.addModal.hide();

            /*
              const resData = res.data || {};

              modalData.id = resData.id || '-';
              modalData.conditions = [];

              listData.push(modalData);

              listData = self.formatListData(listData);

              self.fetchAllList();

              self.addModal.show(confirmParam);


              self.setState({
                  modalData:{},
                  listData:listData,
                  addFwStatus:'doing',
                  modalType:'condition_add',
              },()=>{
                  self.showModal('condition_add',modalData);
                  const confirmParam = {
                      title:'新增条件配置',
                      cancelText:'取消',
                      okText:'确认',
                      content:self.renderModalContent.bind(self),
                      onOk:self.modalHandleOk.bind(self),
                      onCancel:self.modalHandleCancel.bind(self),
                      width:'50%'
                  }

                  self.addModal.show(confirmParam);

              })
  */
            

        }

        function addFwFaild(err){

            const noticeConfig = {
                description:'新增失败',
                type:'faild'
            }

            self.showNotification(noticeConfig);

        }

    }
    //编辑配置信息
    editFirewall(){

        const self = this;

        let listData = this.state.listData,
            editKey = this.state.editKey,
            modalData = this.state.modalData;

        modalData.id = listData[editKey].id;
        if (modalData['content_type'] === 'defaultValue' || !modalData['content_type']) {
            modalData['content_type'] = '';
            modalData['message'] = '';
        }

        const param = formatObj(modalData);

        editFirewallModel.setParam(param);

        editFirewallModel.excute(editApiSucess,editApiFaild);

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

            self.showNotification(noticeConfig);
            self.fetchAllList();

            self.addModal.hide();

        }

        function editApiFaild(err){

            const noticeConfig = {
                description:'更新失败',
                type:'faild'
            }

            self.showNotification(noticeConfig);

        }

    }

    addCondition(){
        const self = this;
        let {listData,addFwStatus,modalData,editKey} = this.state;

        editKey = (editKey == 0 || editKey)?editKey:listData.length -1;

        modalData.waf_id = listData[editKey].id;

        let itemData = listData[editKey];

        const param = formatObj(modalData);

        addFwRuleModel.setParam(param);

        addFwRuleModel.excute(res=>{

            modalData.id = res.data.id;
            
            listData[editKey].conditions.push(modalData)

            listData = self.formatListData(listData);

            self.setState({
                listData:listData,
                editKey:'',
            })

            const noticeConfig = {
                description:'新增防火墙条件成功',
                type:'success'
            }

            self.showNotification(noticeConfig);

            self.addModal.hide();

        },err=>{

            const description = err.msg == '条件已存在'?'条件已存在，不能重复添加':'新增防火墙条件失败';

            const noticeConfig = {
                description:description,
                type:'faild'
            }

            self.showNotification(noticeConfig);


        })
    }

    editCondition(){

        const self = this;
        let {listData,addFwStatus,modalData,editKey} = this.state;

        modalData.waf_id = listData[editKey].id;

        const param = formatObj(modalData);

        editFwRuleModel.setParam(param);

        editFwRuleModel.excute(res=>{

            let conditions = listData[editKey].conditions;

            let newConditions = conditions.map(item=>{

                if(item.id == modalData.id){

                    return Object.assign(item,modalData)

                }else{

                    return item

                }

            })

            listData[editKey].conditions = newConditions;

            listData = self.formatListData(listData);

            self.setState({
                listData:listData,
                editKey:'',
            })

            const noticeConfig = {
                description:'编辑防火墙条件成功',
                type:'success'
            }

            self.showNotification(noticeConfig);

            self.addModal.hide();


        },err=>{

            const description = err.msg == '条件已存在'?'条件已存在，不能重复添加':'新增防火墙条件失败';

            const noticeConfig = {
                description:description,
                type:'faild'
            }

            self.showNotification(noticeConfig);

        })

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

            })

            if(flag){
                editKey = idx;
            }

        })

        return editKey;

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

        const modalType = this.state.modalType;

        const InputChangeHandle = this.modalInputChange.bind(this);
        
        const fieldsValue = this.state.modalData;

        let fieldsArr = '';

        if(modalType == 'fw_edit' || modalType == 'fw_add'){
            fieldsArr = this.state.modalFieldsArr.firewall;
        }else if(modalType == 'condition_edit' || modalType == 'condition_add'){
            fieldsArr = this.state.modalFieldsArr.condition;
        }

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
    showErrorMessage (record) {
        const { content_type, message, name ,http_status} = record
        this.setState({
            responseMessage: {
                title: `防火墙配置${ name }组命中响应信息详情`,
                content_type,
                message,
                visible: true,
                http_status,
            }
        })
    }
    closeErrorMessage () {
        this.setState({
            responseMessage: {...this.state.responseMessage, visible: false}
        })
    }
    // 展示错误信息详情组件
    renderErrorMessage () {
        const { visible, title, content_type, message ,http_status} = this.state.responseMessage
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
                <div>拦截响应类型：{ content_type }</div>
                <div>拦截响应内容：{ message }</div>
            </Modal>
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
                        <Button className="editable-add-btn" onClick={this.showModal.bind(this,'fw_add')} icon='plus' type='primary' className='right_btn'>新增</Button>
                    </div>
                     <Table 
                        columns={this.indata.tableColumns} 
                        dataSource={this.state.listData}
                        title={()=>{return (<div style={{textAlign:'center',fontSize:'20px',color:"#000"}}>防火墙插件使用配置表</div>)}}
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

export default Firewall;