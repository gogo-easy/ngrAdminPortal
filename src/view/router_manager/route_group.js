import React, {Component} from 'react'
import classnames from 'classnames'
import {Layout,Form, Button,Row,Col,Divider,Popconfirm,Table,notification,Icon, Modal,Tooltip} from 'antd'

import TargetModal from './TargetModal.js'

import BaseView from '../../core/view.base'
import WkModal from '../../ui/ui.modal'
import FieldsContent from '../../ui/ui.fiedld'

import {formatObj, gotoPage} from '../../util/util'

import {
    ApiGroupListModel,
    ApiGroupRateListModel,
    DelApiGroupModel,
    AddApiGroupModel,
    EditApiGroupModel,
    EnableApiGroupModel,

    ApiGroupRateLimitListModel,
    AddGroupRateLimitModel,
    EditGroupRateLimitModel,
    DelGroupRateLimitModel,

    AddGroupTargetModel,
    UpdateGroupTargetModel,
    DeleteGroupTargetModel,
    EnableTargetModel
} from '../../models/router_manager_models'

import {
    GatewayListModel,
    HostListModel
} from '../../models/host_manager_models'


const { Header, Content } = Layout;

let apiGroupListModel = ApiGroupListModel.getInstance(),
    apiGroupRateListModel = ApiGroupRateListModel.getInstance(),
    delApiGroupModel = DelApiGroupModel.getInstance(),
    addApiGroupModel = AddApiGroupModel.getInstance(),
    editApiGroupModel = EditApiGroupModel.getInstance(),
    enableApiGroupModel = EnableApiGroupModel.getInstance(),

    //网关
    gatewayListModel = GatewayListModel.getInstance(),
    //主机
    hostListModel = HostListModel.getInstance(),
    //组限速
    apiGroupRateLimitListModel = ApiGroupRateLimitListModel.getInstance(),
    addGroupRateLimitModel = AddGroupRateLimitModel.getInstance(),
    editGroupRateLimitModel = EditGroupRateLimitModel.getInstance(),
    delGroupRateLimitModel = DelGroupRateLimitModel.getInstance(),
    // target
    addGroupTargetModel = AddGroupTargetModel.getInstance(),
    updateGroupTargetModel = UpdateGroupTargetModel.getInstance(),
    deleteGroupTargetModel = DeleteGroupTargetModel.getInstance(),
    enableTargetModel = EnableTargetModel.getInstance();


class RouteGroup extends BaseView {

    constructor(props) {

        super(props);

        let modalFieldsArr = {
            group:[        //新增和编辑
                {
                    key:'group_name',
                    label:'路由规则组名称',
                    type:'input',
                    placeholder:'最长支持31位',
                    maxlength:31,
                    disabled: false
                },
                {
                    key:'group_context',
                    label:'路由规则上下文PATH',
                    type:'input',
                    placeholder:'最长支持250位',
                    maxlength:250,
                    onChange: this.changeGroupContextStatus.bind(this),
                    disabled: false
                },
                {
                    key:'enable_rewrite',
                    label:'是否重写上下文',
                    type:'select',
                    options:[
                        {
                            value:'defaultValue',
                            desc:'请选择...'
                        },
                        {
                            value:'0',
                            desc:'不重写'
                        },{
                            value:'1',
                            desc:'重写'
                        }
                    ],
                    disabled: false
                },
                {
                    key:'rewrite_to',
                    label:'上下文重写为',
                    type:'',
                    placeholder:'最长支持250位',
                    maxlength:250,
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
                    key:'upstream_service_id',
                    label:'后端服务ID',
                    type:'input',
                    placeholder:'最长支持63位',
                    maxlength:64,
                    disabled: false
                },
                {
                    key:'enable_balancing',
                    label:'是否启用动态负载均衡',
                    type:'select',
                    options:[
                        {
                            value:'defaultValue',
                            desc:'请选择启用状态'
                        },
                        {
                            value:'1',
                            desc:'开启'
                        },{
                            value:'0',
                            desc:'关闭'
                        }
                    ],
                    disabled: false
                },
                {
                    key:'lb_algo',
                    label:'负载均衡算法',
                    type:'select',
                    options:[
                        {
                            value:'defaultValue',
                            desc:'请选择是否启用'
                        },
                        {
                            value:'1',
                            desc:'轮询'
                        },
                        {
                            value:'2',
                            desc:'客户端ip_hash'
                        }
                    ],
                    disabled: false
                },
                {
                    key:'upstream_domain_protocol',
                    label:'后端服务内网协议',
                    type:'select',
                    options:[
                        {
                            value:'defaultValue',
                            desc:'请选择协议'
                        },
                        {
                            value:'http://',
                            desc:'http'
                        },{
                            value:'https://',
                            desc:'https'
                        }
                    ],
                    disabled: false
                },
                {
                    key:'upstream_domain_host',
                    label:'后端服务内网域名',
                    type:'input',
                    placeholder:'最长支持56位',
                    maxlength:56,
                    disabled: false
                },
                {
                    key:'need_auth',
                    label:'是否需要授权',
                    type:'select',
                    options:[
                        {
                            value:'defaultValue',
                            desc:'请选择是否需要授权'
                        },
                        {
                            value:'1',
                            desc:'需要'
                        },{
                            value:'0',
                            desc:'不需要'
                        }
                    ],
                    disabled: false
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
                            desc:'开启'
                        },{
                            value:'0',
                            desc:'关闭'
                        }
                    ],
                    disabled: true
                },
                {
                    key:'gen_trace_id',
                    label:'是否生成跟踪ID',
                    type:'switch'
                },
                {
                    key:'http_status',
                    label:'http响应码',
                    type:'input',
                    placeholder:'只支持数字，最长支持3位',
                    maxlength:3,
                    disabled: false
                },
                {
                    key:'content_type',
                    label:'后端服务错误响应类型',
                    type:'select',
                    options:[
                        {
                            value:'defaultValue',
                            desc:'请选择响应类型'
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
                    ],
                    disabled: false
                },
                {
                    key:'message',
                    label:'后端服务错误响应内容',
                    type:'textArea',
                    placeholder:'若错误响应类型已选择，则错误响应内容必填，类型未选择，内容可不填',
                    disabled: false
                }
            ],
            rateLimit:[
                {
                    key:'rate_limit_count',
                    label:'限速值(单机)',
                    type:'input',
                    placeholder:'最长支持11位',
                    maxlength:11
                },
                {
                    key:'rate_limit_period',
                    label:'限速时间单位',
                    type:'select',
                    options:[
                        {
                            value:'defaultValue',
                            desc:'请选择限速时间单位'
                        },
                        {
                            value:1,
                            desc:'每秒'
                        },
                        {
                            value:60,
                            desc:'每分'
                        },
                        {
                            value:3600,
                            desc:'每小时'
                        },
                        {
                            value:86400,
                            desc:'每天'
                        }

                    ]

                },
                {
                    key:'enable',
                    label:'当前状态',
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

                },
                {
                    key:'http_status',
                    label:'http响应码',
                    type:'input',
                    placeholder:'只支持数字，最长支持3位',
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
                    placeholder:'请输入对应命中响应类型的响应内容',
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
                    title: '路由规则组名称',
                    dataIndex: 'group_name',
                    width:'100px',
                    align:'center'
                },
                {
                    title: '上下文PATH',
                    dataIndex: 'group_context',
                    width:'100px',
                    align:'center'
                },
                {
                    title: '是否重写',
                    dataIndex: 'enable_rewrite_txt',
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
                    align:'center',
                    render:this.columnTooltip.bind(this)
                },
                {
                    title: '后端服务内网域名',
                    dataIndex: 'upstream_domain_name',
                    width:'100px',
                    align:'center'
                },
                {
                    title: '后端服务ID',
                    dataIndex: 'upstream_service_id',
                    width:'100px',
                    align:'center'
                },
                {
                    title: '动态负载均衡',
                    dataIndex: 'enable_balancing_txt',
                    width:'80px',
                    align:'center'
                },
                {
                    title: '授权',
                    dataIndex: 'need_auth_txt',
                    width:'80px',
                    align:'center'
                },
                {
                    title: '当前状态',
                    width:'80px',
                    align:'center',
                    render:this.cellEnable.bind(this)
                },
                {
                    title: '负载均衡算法',
                    width:'80px',
                    align:'center',
                    render: this.renderCelllAlgo.bind(this)
                },
                {
                    title: '生成跟踪id',
                    width:'80px',
                    align:'center',
                    render: this.renderCelllGenId.bind(this)
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
                    key:'group_name',
                    label:'路由规则组名称',
                    type:'input',
                    placeholder:'请输入路由规则组名称'

                },
                {
                    key:'group_context',
                    label:'路由上下文PATH',
                    type:'input',
                    placeholder:'路由上下文PATH'

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
                    key:'ip',
                    label:'上游服务节点',
                    type:'input',
                    maxlength:20,
                    size:20,
                    placeholder:'请输入ip'
                }

            ],
            targetColumns: [
                {
                    title: '权重',
                    dataIndex: 'weight',
                    width:'100px',
                    align:'center'
                },
                {
                    title: '服务ip地址',
                    dataIndex: 'host',
                    width:'350px',
                    align:'center'
                },
                {
                    title: '端口',
                    dataIndex: 'port',
                    width:'350px',
                    align:'center'
                },
                {
                    title: '仅用于AB分流',
                    width:'350px',
                    align:'center',
                    render:this.renderIsOnlyAB.bind(this)
                },
                {
                    title: '当前状态',
                    dataIndex: 'enable',
                    width:'80px',
                    align:'center',
                    render:this.cellTargetEnable.bind(this)
                },
                {
                    title: '操作',
                    width:'200px',
                    align:'center',
                    render:this.renderTargetDetails.bind(this)
                }
            ],
        }

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
            targetData: {},                 // targetModal数据，编辑传入相应数据，添加则传主键id: group_id
            updateOrAddTarget: 0,           // 判断是编辑还是添加target 1:编辑  2:添加
            targetModalTitle: '',
            responseMessage: {              // 返回错误信息详情
                title: '',
                content_type: '',
                message: '',
                visible: false,
                http_status:'',
            }
        }

    }

    componentDidMount(){
        this.fetchAllApiGroup();
        this.fetchListDataSource();
    }
    changeGroupContextStatus (e) {
        const { modalFieldsArr, modalData } = this.state,
            { group } = modalFieldsArr
        const index = group.findIndex(item => item.key === 'group_context')
        group[index].disabled = !group[index].disabled
        if (e.target.checked) {
            modalData['group_context'] = '-default-'
        } else {
            modalData['group_context'] = ''
        }
        this.setState({
            modalFieldsArr: this.state.modalFieldsArr
        })
    }
    cellEnable(text,record,index){

        const cellStyle = record.enable_txt == '禁用'?{color:'#f00'}:{};

        return (
            <span style={cellStyle} >{record.enable_txt}</span>
        )

    }

    cellTargetEnable(text,record,index){

        const cellStyle = record.enable == '0'?{color:'#f00'}:{};

        return (
            <span style={cellStyle} >{record.enable == '0'?"禁用":"启用"}</span>
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
    renderCelllAlgo (text) {
        let content = ''
        if (text['lb_algo'] === 1) {
            content = '轮询'
        } else if (text['lb_algo'] === 2) {
            content = '客户端ip_hash'
        }
        return (
            <span>{ content }</span>
        )
    }

    renderCelllGenId(text){
        let content = ''
        if (text['gen_trace_id'] === 1) {
            content = '是'
        } else if (text['gen_trace_id'] === 0) {
            content = '否'
        }
        return (
            <span>{ content }</span>
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
                <a href="javascript:;" onClick={ this.showModal.bind(this,'group_edit',record) }><Icon type="edit" /></a>
                <Divider type="vertical" />
                { record.has_gray_divide && (<a href="javascript:;" onClick={ this.goToGrayDivide.bind(this,record) }><Icon type="profile"/></a>) }
                { record.has_gray_divide && (<Divider type="vertical" />) }
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

    onRateLimitDelete(record){

        let self = this,
            listData = this.state.listData;

        const key = this.fetchEditKey(record);

        delGroupRateLimitModel.setParam({
            group_id:record.group_rate_limit.group_id

        });

        delGroupRateLimitModel.excute(delSuccess,delFalid);

        function delSuccess(res){

            listData[key].group_rate_limit = {};

            self.setState({
                listData:listData
            });

            const noticeConfig = {
                description:'删除组限速成功',
                type:'success'
            }

            self.showNotification(noticeConfig);

        }

        function delFalid(){
            const noticeConfig = {
                description:'删除组限速失败',
                type:'faild'
            }

            self.showNotification(noticeConfig);
        }

    }

    renderIsOnlyAB(record){
        let showText = record.is_only_ab_check == true?'是':'否';

        let cellStyle = {};
        if(record.is_only_ab_check == true && record.gray_divide_count == 0){
            cellStyle = {color:'#f00'};
        }
        return (
            <span style={cellStyle} >{showText}</span>
        )
    }

    renderTargetDetails (record) {
        return (
            <span>
                <Popconfirm
                    title={record.enable == '0' ?'您确定启用吗？':'您确定禁用吗？'}
                    placement="left"
                    onConfirm={() => this.onTargetEnable(record)}
                    cancelText='取消'
                    okText='确定'>
                  <a href="javascript:;">{record.enable == '0' ? <Icon type="unlock"/> : <Icon type="lock"/>}</a>
                </Popconfirm>
                <Divider type="vertical" />

                <a href="javascript:;" onClick={ () => this.showTargetModal(1, record) }><Icon type="edit" /></a>
                <Divider type="vertical" />
                <Popconfirm
                    title="你确定删除吗?"
                    onConfirm={() => this.deleteTarget(record.id,record.group_id)}
                    cancelText='取消'
                    okText='确定'
                >
                  <a href="javascript:;"><Icon type="delete" /></a>
                </Popconfirm>
            </span>
        )
    }
    showTargetModal (type, record = {}) {
        this.setState({
            targetModalVisible: true,
            updateOrAddTarget: type,
            targetData: record,
            targetModalTitle: type === 1 ? '编辑上游' : '添加上游'
        })
    }
    deleteTarget (id,group_id) {
        const _this = this
        deleteGroupTargetModel.setParam({id:id,group_id:group_id})
        deleteGroupTargetModel.excute(deleteSuccess, deleteFail)

        function deleteSuccess (res) {
            if (res.success) {
                _this.fetchAllApiGroup()
            }
        }
        function deleteFail (err) {
            let msg = "删除失败";
            if(err.err_no == 3001){
                msg = err.msg;
            }
            const noticeConfig = {
                description:msg,
                type:'faild'
            }
            _this.showNotification(noticeConfig);
        }
    }

    handleTargetOk (params) {
        const { updateOrAddTarget } = this.state,
            _this = this;

        let is_only_ab = params.is_only_ab_check == true? 1: 0;
        params.is_only_ab = is_only_ab;

        if (updateOrAddTarget === 1) {
            updateGroupTargetModel.setParam(params)
            updateGroupTargetModel.excute(updateSuccess, updateFail)
        } else if (updateOrAddTarget === 2) {
            addGroupTargetModel.setParam(params)
            addGroupTargetModel.excute(addSuccess, addFail)
        }
        function addSuccess (res) {
            if (res.success) {
                _this.setState({
                    targetModalVisible: false,
                })
                _this.fetchAllApiGroup()
            }
        }
        function addFail (err) {
            const noticeConfig = {
                description:'添加target失败',
                type:'faild'
            }
            if (+err.err_no === 3001) {
                noticeConfig.description = err.msg
            }
            _this.showNotification(noticeConfig);
        }
        function updateSuccess (res) {
            if (res.success) {
                _this.setState({
                    targetModalVisible: false
                })
                _this.fetchAllApiGroup()
            }
        }
        function updateFail (err) {
            const noticeConfig = {
                description:'更新target失败',
                type:'faild'
            }
            if (+err.err_no === 3001) {
                noticeConfig.description = err.msg
            }
            _this.showNotification(noticeConfig);
        }
    }

    renderGroupRateLimit(record){
        const {group_rate_limit: itemData, enable_balancing} = record

        const self = this;
        const { rate_limit_count, rate_limit_period, enable, content_type, message,http_status } = itemData,
            content = rate_limit_count && rate_limit_period

        return (
            <div>
                <div className='rate_limit_container'>
                    <h3>路由限流详细信息</h3>
                    { content && (
                        <span className='clear rate_limit_detail'>
                            <div className='fl'>限速值(单机)：{ rate_limit_count }</div>
                            <div className='fl'>限速时间：{ rate_limit_period }秒</div>
                            <div className='fl'>当前状态：{ enable == '1'?'启用':'禁用' }</div>
                            { http_status &&  <div className='fl'>http响应码：{ http_status }</div> }
                            { content_type &&  <div className='fl'>错误类型：{ content_type }</div> }
                            { message && <div className='fl'>错误内容：{ message }</div> }
                        </span>
                    ) }
                    {content?<a className='edit_rate_limit' href="javascript:;" onClick={self.showModal.bind(self,'ratelimit_edit',record)}><Icon type="edit" /></a>:<Button icon='plus' type='primary' onClick={self.showModal.bind(self,'ratelimit_add',record)}>新增组限流信息</Button>}
                    {content &&
                    (<span className='delete_rate_limit'>
                            <Divider type="vertical" />
                            <Popconfirm
                                title="你确定删除吗?"
                                onConfirm={() => self.onRateLimitDelete(record)}
                                cancelText='取消'
                                okText='确定'
                            >
                            <a href="javascript:;"><Icon type="delete" /></a>
                            </Popconfirm>
                        </span>)
                    }
                </div>
                <div className={ classnames('target_container', {
                    none: +enable_balancing === 0
                }) }>
                    <Button className='editable-add-btn' onClick={ () => this.showTargetModal(2, {group_id: record.id}) } icon='plus' type='primary' className='right_btn'>新增target信息</Button>
                    <h4>target信息列表</h4>
                    <Table
                        columns={this.indata.targetColumns}
                        dataSource={ (record.group_target || []).map((item, index) => ({ index, key: item.id, ...item })) }
                        bordered
                        pagination={false}
                    />
                </div>
            </div>

        )


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


        if(enable_state == 1 && record.enable_balancing==1 && record.group_target.length==0){
            const noticeConfig = {
                description:'target信息为空，不能开启',
                type:'warning'
            };

            self.showNotification(noticeConfig);
            return
        }


        enableApiGroupModel.setParam(param,true);

        //load gateway info
        enableApiGroupModel.excute((res)=>{

            listData.map((item,idx)=>{
                if(item.id == id){
                    record.enable_txt= enable_state=='1'?'启用':'禁用';
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

    onTargetEnable(record){
        //1:enable;0:disable
        let self = this;
        let listData = this.state.listData;

        const enable_state = record.enable == '0' ? '1' : '0';
        const id = record.id;
        let param={
            id:id,
            enable:enable_state
        };


        enableTargetModel.setParam(param,true);

        enableTargetModel.excute((res)=>{
            const noticeConfig = {
                description:'操作成功',
                type:'success'
            };
            self.fetchAllApiGroup();
            self.showNotification(noticeConfig);

        },(err)=>{
            let msg = '操作失败';
            if(err.err_no == 3001){
                msg = err.msg;
            }
            const noticeConfig = {
                description:msg,
                type:'faild'
            }

            self.showNotification(noticeConfig);
        });

    }

    onDelete(id){

        let self = this,
            listData = this.state.listData;

        delApiGroupModel.setParam({
            id:id
        })

        delApiGroupModel.excute(delSuccess,delFalid);

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

    /**
     * 根据data【所属主机】，和value【值】，渲染
     * @param data
     * @param value
     */
    renderSelectHostInSearchBar(data,value){
        let hostOptions = this.formatHostList(data);
        
        const hostIndex = this.indata.searchFieldsArr.findIndex(item => item.key === 'host_id')
        this.indata.searchFieldsArr[hostIndex].options = [{"value":"defaultValue","desc":"请选择..."}].concat(hostOptions);
        //根据参数设置 所属主机的值
        let searchData = this.state.searchData;
        const host_id = this.props.location.query?this.props.location.query.host_id:'';
        if (host_id) {
            searchData.host_id = parseInt(host_id);
        }

        this.setState({
            searchFieldsArr:this.indata.searchFieldsArr,
            searchData:searchData
        });
    }


    goToGrayDivide(record){
        gotoPage('/router_manager/gray_divide?group_id='+record.id+'&host_id='+record.host_id +'&gateway_id='+record.gateway_id);
    }

    renderSearchField(){
        let self = this;
        let gatewayOptions = self.indata.selectData["gateway"];
        let hostOptions = self.indata.selectData["host"];
        const hostIndex = this.indata.searchFieldsArr.findIndex(item => item.key === 'host_id')
        //网关数据源
        this.indata.searchFieldsArr[hostIndex].options = [{"value":"defaultValue","desc":"请选择..."}].concat(hostOptions);
        //根据参数设置 所属主机的值
        let searchData = this.state.searchData;
        const host_id = this.props.location.query?this.props.location.query.host_id:'';
        const gateway_id = this.props.location.query?this.props.location.query.gateway_id:'';
        if (gateway_id && host_id) {
            searchData.gateway_id=parseInt(gateway_id);
            this.searchInputChange('gateway_id',searchData.gateway_id)
            searchData.host_id = parseInt(host_id);
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
            let searchFieldsArr = self.indata.searchFieldsArr;
            const gatewayIdIndex = searchFieldsArr.findIndex(item => item.key === 'gateway_id');
            searchFieldsArr[gatewayIdIndex].options=[{"value":"defaultValue","desc":"请选择..."}].concat(gatewayOptions);

            let modalFieldsArr = self.state.modalFieldsArr;
            const gatewayIdModalIndex = modalFieldsArr.group.findIndex( item => item.key === 'gateway_id');
            modalFieldsArr.group[gatewayIdModalIndex].options=[{"value":"defaultValue","desc":"请选择..."}].concat(gatewayOptions);

            //load host info
            hostListModel.setParam({},true);
            hostListModel.excute((res)=>{
                self.indata.selectData["host"]=res.data||[];

                //render search field
                self.renderSearchField();
            },(err)=>{

            });
        },(err)=>{

        });
    }

    fetchAllApiGroup(){
        let self = this;

        const host_id = this.urlQuery.host_id;

        let param={}

        if (host_id) {
            param.host_id = host_id
            apiGroupRateListModel.setParam(param,true);
        }

        apiGroupRateListModel.excute((res)=>{

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

    searchApiGroupList() {


        let param = {};

        const searchData = this.state.searchData;

        if(searchData.group_name){
            param.group_name = searchData.group_name
        }
        if(searchData.group_context){
            param.group_context = searchData.group_context
        }
        if(searchData.ip){
            param.ip = searchData.ip
        }
        if(searchData.enable && searchData.enable !== 'defaultValue'){
            param.enable = searchData.enable
        }
        if(searchData.gateway_id && searchData.gateway_id != 'defaultValue'){
            param.gateway_id = searchData.gateway_id;
        }
        if(searchData.host_id && searchData.host_id != 'defaultValue'){
            param.host_id = searchData.host_id;
        }
        if(searchData.id){
            param.id = searchData.id
        }


        apiGroupRateListModel.setParam(param,true);

        apiGroupRateListModel.excute(this.seachSuccess.bind(this),this.seachFaild.bind(this));

    }

    resetSearchData(){

        let searchFieldsArr = this.state.searchFieldsArr;
        //清空网关数据源
        searchFieldsArr[4].options=[{"value":"defaultValue","desc":"请选择..."}];


        const searchData = {
            group_name:'',
            group_context:'',
            id:'',
            enable:'',
            gateway_id:'',
            host_id:'',
            ip:''
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


    formatListData(listData){
        return listData.map((item,idx)=>{

            let all_targets = item.group_target || [];
            let group_targets = [];
            let has_gray_divide = false;

            for(let i = 0; i < all_targets.length; i++){
                let temp_target = all_targets[i];

                temp_target.is_only_ab_check = temp_target.is_only_ab == 1;
                if(temp_target.gray_divide_count > 0){
                    has_gray_divide = true;
                }
            }
            group_targets = all_targets;


            return {
                key:idx,
                idx:idx + 1,
                id:item.id || '-',
                group_rate_limit:item.group_rate_limit || {},
                group_name:item.group_name || '-',
                group_context:item.group_context || '-',
                include_context:item.include_context == 1 ? '1':'0',
                include_context_txt:item.include_context == 1 ? '包含':'不包含',
                upstream_domain_name:item.upstream_domain_name || '-',
                upstream_service_id:item.upstream_service_id || '-',
                upstream_timeout:item.upstream_timeout || '-',
                enable_balancing:item.enable_balancing == 1?'1':'0',
                enable_balancing_txt:item.enable_balancing == '0'? '禁用':'启用',
                need_auth:item.need_auth == 1?'1':'0',
                need_auth_txt:item.need_auth == '0'? '不需要':'需要',
                enable:item.enable == 1 ?'1':'0',
                enable_txt:item.enable == '0'? '禁用':'启用',
                enable_rewrite:item.enable_rewrite == 1 ?'1':'0',
                rewrite_to:item.rewrite_to,
                lb_algo: item.lb_algo || '',
                http_status:item.http_status || '',
                content_type: item.content_type || '',
                message: item.message || '',
                group_target: group_targets || [],
                host:item.host || '-',
                host_id:item.host_id,
                gateway_id:item.gateway_id,
                gateway_code:item.gateway_code || '-',
                host_enable:item.host_enable,
                gen_trace_id:item.gen_trace_id,
                has_gray_divide:has_gray_divide
            }

        })

    }

    searchInputChange(key,e) {

        const target = e.target;

        const value = target ? target.value : e ;

        let searchData = this.state.searchData;
        let searchFieldsArr = this.state.searchFieldsArr;

        searchData[key] = value;


        if(key === 'gateway_id'){
            let hostOptions = this.formatHostList(this.indata.selectData.host,value);
            searchFieldsArr[4].options=[{"value":"defaultValue","desc":"请选择..."}].concat(hostOptions);
            searchData['host_id']='';
        }


        this.setState({
            searchFieldsArr:searchFieldsArr,
            searchData: searchData
        })

    }

    modalInputChange(key,e) {
        const target = e.target,
            value = target ? target.value : e,
            { modalFieldsArr, modalData } = this.state
        if (typeof value === 'string') {
            modalData[key] = value.trim();
        } else {
            modalData[key] = value
        }
        if (key === 'enable_balancing') {
            const lb_algoIndex = modalFieldsArr.group.findIndex(item => item.key === 'lb_algo'),
                protocolIndex = modalFieldsArr.group.findIndex(item => item.key === 'upstream_domain_protocol'),
                hostIndex = modalFieldsArr.group.findIndex(item => item.key === 'upstream_domain_host')
            if (e === '1') {
                modalFieldsArr.group[lb_algoIndex].disabled = false
                modalFieldsArr.group[protocolIndex].disabled = true
                modalFieldsArr.group[hostIndex].disabled = true
            } else if (e === '0') {
                modalFieldsArr.group[lb_algoIndex].disabled = true
                modalFieldsArr.group[protocolIndex].disabled = false
                modalFieldsArr.group[hostIndex].disabled = false
            }
        }
        if(key === 'gateway_id'){
            
            let hostOptions = this.formatHostList(this.indata.selectData.host,value);
            //let modalFieldsArr = this.state.modalFieldsArr;
            const hostIdIndex = modalFieldsArr.group.findIndex( item => item.key === 'host_id')
            modalFieldsArr.group[hostIdIndex].options=[{"value":"defaultValue","desc":"请选择..."}].concat(hostOptions);
            modalData['host_id']='';
        }
        if(key === 'host_id'){
            if(value != 'defaultValue'){
                let hostItem = this.getHostById(value);
                if(hostItem && hostItem.enable == 0){
                    const noticeConfig = {
                        description:'该主机已经被禁用',
                        type:'warning'
                    };

                    this.showNotification(noticeConfig);
                }
            }
        }
        if(key === 'enable_rewrite'){
            const lb_algoIndex = modalFieldsArr.group.findIndex(item => item.key === 'rewrite_to')
            modalFieldsArr.group[lb_algoIndex].type = e==1?'input':''
        }
        this.setState({
            modalData,
            modalFieldsArr
        })
    }

    handleSearch(e) {

        e.preventDefault();

        this.searchApiGroupList();

    }
    showErrorMessage (record) {
        const { content_type, message, group_name ,http_status} = record
        this.setState({
            responseMessage: {
                title: `路由${ group_name }组返回错误信息详情`,
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
    showModal(flag,record){
        let modalData = this.state.modalData;
        let editKey = '';
        let confirmParam ;
        if(flag == 'group_edit'){

            const itemData = record;

            editKey = this.fetchEditKey(record);
            const upstream_domain_name = itemData.upstream_domain_name;

            let upstream_domain_protocol ='http://',
                upstream_domain_host = upstream_domain_name;

            if(upstream_domain_name.indexOf('http') > -1){
                const tempArr = upstream_domain_name.split('//');
                upstream_domain_protocol = tempArr[0] + '//';
                upstream_domain_host = tempArr[1];
            }

            modalData = {
                group_name: itemData.group_name,
                group_context: itemData.group_context,
                include_context:itemData.include_context,
                enable: itemData.enable,
                enable_rewrite:itemData.enable_rewrite,
                rewrite_to:itemData.rewrite_to,
                upstream_domain_name: itemData.upstream_domain_name,
                upstream_domain_protocol: upstream_domain_protocol,
                upstream_domain_host: upstream_domain_host,
                upstream_service_id: itemData.upstream_service_id,
                upstream_timeout: itemData.upstream_timeout,
                enable_balancing: itemData.enable_balancing,
                need_auth: itemData.need_auth,
                lb_algo: itemData.lb_algo + '',
                http_status:itemData.http_status,
                content_type: itemData.content_type,
                message: itemData.message,
                // group_target: itemData.group_target,
                gateway_id:itemData.gateway_id,
                host_id:itemData.host_id,
                gen_trace_id:itemData.gen_trace_id+''
            };

            let { modalFieldsArr } = this.state,
                lb_algoIndex = modalFieldsArr.group.findIndex(item => item.key === 'lb_algo'),                      // 负载均衡算法在定义的数组种的序列
                protocolIndex = modalFieldsArr.group.findIndex(item => item.key === 'upstream_domain_protocol'),    // 内网协议在定义的数组种的序列
                upstreamDomainHostIndex = modalFieldsArr.group.findIndex(item => item.key === 'upstream_domain_host'),            // 内网域名在定义的数组种的序列
                groupContextIndex = modalFieldsArr.group.findIndex(item => item.key === 'group_context'),           // API组上下文在定义的数组种的序列
                gatewayIndex = modalFieldsArr.group.findIndex(item => item.key === 'gateway_id'),
                hostIdIndex = modalFieldsArr.group.findIndex(item => item.key === 'host_id'),
                rewritetoIndex = modalFieldsArr.group.findIndex(item => item.key === 'rewrite_to'),
                messageIndex = modalFieldsArr.group.findIndex(item => item.key === 'message');

            //根据gateway_id获取所属主机的数据源
            let hostOptions = this.formatHostList(this.indata.selectData.host,record.gateway_id);
            modalFieldsArr.group[hostIdIndex].options=[{"value":"defaultValue","desc":"请选择..."}].concat(hostOptions);

            modalFieldsArr.group[messageIndex].disabled = false
            if (itemData.enable_balancing === '1') {
                modalFieldsArr.group[lb_algoIndex].disabled = false
                modalFieldsArr.group[protocolIndex].disabled = true
                modalFieldsArr.group[upstreamDomainHostIndex].disabled = true
            } else if (itemData.enable_balancing === '0') {
                modalFieldsArr.group[lb_algoIndex].disabled = true
                modalFieldsArr.group[protocolIndex].disabled = false
                modalFieldsArr.group[upstreamDomainHostIndex].disabled = false
            }
            if (itemData.group_context === '-default-') {
                modalFieldsArr.group[groupContextIndex].disabled = true
            } else {
                modalFieldsArr.group[groupContextIndex].disabled = false
            }
            if(itemData.enable_rewrite==='1'){
                modalFieldsArr.group[rewritetoIndex].type = 'input'
            }
            else{
                modalFieldsArr.group[rewritetoIndex].type = ''
            }
            confirmParam = {
                title:'编辑API组路由',
                cancelText:'取消',
                okText:'确认',
                content:this.renderModalContent.bind(this),
                onOk:this.modalHandleOk.bind(this),
                width:'50%'
            }


        }else if(flag == 'ratelimit_edit' || flag == 'ratelimit_add'){

            const itemData = record,
                { modalFieldsArr } = this.state,
                messageIndex = modalFieldsArr.rateLimit.findIndex(item => item.key === 'message')

            modalFieldsArr.rateLimit[messageIndex].disabled = false
            editKey = this.fetchEditKey(record);

            const rateItemData = itemData.group_rate_limit;

            if(flag == 'ratelimit_edit'){
                modalData = {
                    group_id:itemData.id,
                    id: rateItemData.id,
                    rate_limit_count:rateItemData.rate_limit_count || '',
                    rate_limit_period:rateItemData.rate_limit_period || '',
                    enable:rateItemData.enable == '0'?'0': '1',                  //默认启用
                    http_status:rateItemData.http_status || '',
                    content_type: rateItemData.content_type || '',
                    message: rateItemData.message || ''
                }
            }else{
                modalData = {
                    group_id:itemData.id
                }
            }
            confirmParam = {
                title:`配置${itemData.group_name}组限速`,
                cancelText:'取消',
                okText:'确认',
                content:this.renderModalContent.bind(this),
                onOk:this.modalHandleOk.bind(this),
                width:'50%'
            }

        }else{
            modalData = {
                enable:'0',
                gen_trace_id:'0'
            };
            confirmParam = {
                title:'新增API组路由',
                cancelText:'取消',
                okText:'确认',
                content:this.renderModalContent.bind(this),
                onOk:this.modalHandleOk.bind(this),
                width:'50%'
            }
            const { modalFieldsArr } = this.state
            modalFieldsArr['group'].find(item => item.key === 'group_context').disabled = false;
            modalFieldsArr['group'].find(item => item.key === 'message').disabled = false;
        }
        this.resetModalFieldsArr(flag);
        this.setState({
            modalType:flag,
            modalData,
            editKey
        });

        this.addModal.show(confirmParam);

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

    modalHandleOk(){
        const modalType = this.state.modalType;

        if(this.paramValidate()){

            if(modalType == 'group_add'){
                this.addApiGroup();
            }else if (modalType == 'group_edit'){
                this.editApiGroup();
            }else if(modalType == 'ratelimit_add'){
                this.addRateLimit();
            }else if(modalType == 'ratelimit_edit'){
                this.editRateLimit();
            }

        }

    }

    resetModalFieldsArr(modalType){

        let contentData = this.state.modalFieldsArr;

        let type;
        if(modalType.indexOf('group') > -1){
            type = 'group'
        }else{
            type = 'rateLimit'
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

    //检验参数
    paramValidate(){
        let modalData = this.state.modalData || {},
            modalType = this.state.modalType,
            modalFieldsArr = this.state.modalFieldsArr,
            flag = 0,
            key,
            value,
            temp,
            reg= /^[1-9]\d*$/,
            reg2 = /^[a-zA-Z0-9\-_\.\/:]+$/,
            _this = this;

        const type = (modalType == 'group_add' || modalType == 'group_edit')?'group':'rateLimit';

        let newFields = modalFieldsArr[type].map(item=>{

            key = item.key;
            value = modalData[key];
            temp= item;

            if((item.type == 'input' && !value) || (item.type == 'textArea' && !value) || (item.type == 'select' && (value == 'defaultValue' || !value))){
                if (item.key === 'content_type' || item.key === 'http_status') {
                    // 不做处理
                } else if (item.key === 'message') {
                    // 类型选择了，内容也未填则验证不通过
                    if ((modalData['content_type'] && modalData['content_type'] !== 'defaultValue')) {
                        temp.validateStatus = 'error';
                        flag++;

                        const messageIndex = modalFieldsArr[type].findIndex(item => item.key === 'message')
                        modalFieldsArr[type][messageIndex].disabled = true
                        this.setState({
                            modalFieldsArr
                        })
                    }
                } else if (item.key === 'lb_algo') {
                    if (modalData['enable_balancing'] === '1') {
                        temp.validateStatus = 'error';
                        temp.help = '必填项不能为空';
                        flag++;
                    }
                } else if (item.key === 'upstream_domain_protocol' || item.key === 'upstream_domain_host') {
                    if (modalData['enable_balancing'] === '0') {
                        temp.validateStatus = 'error';
                        temp.help = '必填项不能为空';
                        flag++;
                    }
                } else {
                    temp.validateStatus = 'error';
                    temp.help = '必填项不能为空';
                    flag++;
                }
            }else if((item.key == 'group_context' || item.key == 'upstream_service_id' || item.key == 'upstream_domain_host') && !reg2.test(value)){
                temp.validateStatus = 'error';
                temp.help = '仅支持字母数字-_/.';
                flag++;
            }else if(item.key == 'rate_limit_count' && !reg.test(value)){
                temp.validateStatus = 'error';
                temp.help = '仅支持正整数';
                flag++;
            } else {
                temp.validateStatus = 'success';
                temp.help = '';
            }
            item.hasFeedback = true;
            return temp
        })

        modalFieldsArr[type] = newFields

        this.setState({
            modalFieldsArr: modalFieldsArr
        })

        flag = flag == 0 ?true:false;

        return flag;
    }

    //新增api组
    addApiGroup(){

        const self = this;

        let listData = this.state.listData,
            modalData = this.state.modalData,
            modalType = this.state.modalType,
            modalFieldsArr = this.state.modalFieldsArr;

        modalData.upstream_domain_name = modalData.upstream_domain_protocol + modalData.upstream_domain_host;
        //暂时写死
        modalData.upstream_timeout = 5000;

        delete modalData.upstream_domain_protocol;
        delete modalData.upstream_domain_host;
        if (modalData['content_type'] === 'defaultValue' || !modalData['content_type']) {
            modalData['content_type'] = '';
            modalData['message'] = '';
        }
        if (modalData['enable_balancing'] === '0') {
            modalData['lb_algo'] = '0'
        } else {
            modalData['upstream_domain_name'] = ''
        }

        const param = formatObj(modalData);

        addApiGroupModel.setParam(param);

        addApiGroupModel.excute(addApiSucess,addApiFaild);

        function addApiSucess(res){

            const resData = res.data || {};

            modalData.id = resData.id || '-';

            listData.push(modalData);

            listData = self.formatListData(listData);

            self.setState({
                listData:listData,
                modalData:{}
            })
            self.addModal.hide();
            self.fetchAllApiGroup();

            const noticeConfig = {
                description:'新增成功',
                type:'success'
            }

            self.showNotification(noticeConfig);

        }

        function addApiFaild(err){
            if(+err.err_no == 3001){
                const type = modalType.indexOf('group') > -1 ?'group':'rateLimit';
                let temp;
                let newModalFields = modalFieldsArr[type].map(item=>{
                    temp = item;

                    if(temp.key === 'group_context'){
                        temp.help = '您填写的API路由规则上下文已存在';
                        temp.validateStatus = 'error';
                    }

                    return temp

                })
                modalFieldsArr[type] = newModalFields;
                const upstream_domain_name = modalData.upstream_domain_name;
                let upstream_domain_protocol ='http://',
                    upstream_domain_host = upstream_domain_name;
                if(upstream_domain_name.indexOf('http')>-1){
                    const tempArr = upstream_domain_name.split('//');
                    upstream_domain_protocol = tempArr[0] + '//';
                    upstream_domain_host = tempArr[1];
                }

                modalData.upstream_domain_protocol = upstream_domain_protocol;
                modalData.upstream_domain_host = upstream_domain_host;

                self.setState({
                    modalFieldsArr:modalFieldsArr,
                    modalData:modalData
                })
            }
            let msg = "新增失败";
            if (err.err_no == 3001){
                msg = err.msg
            }
            const noticeConfig = {
                description:msg,
                type:'faild'
            }

            self.showNotification(noticeConfig);

        }

    }
    //编辑api组
    editApiGroup(){

        const self = this;

        let listData = this.state.listData,
            editKey = this.state.editKey,
            modalData = this.state.modalData,
            modalType = this.state.modalType,
            modalFieldsArr = this.state.modalFieldsArr;

        modalData.id = listData[editKey].id;

        modalData.upstream_domain_name = modalData.upstream_domain_protocol + modalData.upstream_domain_host;

        modalData.upstream_timeout = 5000;

        delete modalData.upstream_domain_protocol;
        delete modalData.upstream_domain_host;
        if (modalData['content_type'] === 'defaultValue' || !modalData['content_type']) {
            modalData['content_type'] = '';
            modalData['message'] = '';
        }
        if (modalData['enable_balancing'] === '0') {
            modalData['lb_algo'] = '0'
        } else {
            modalData['upstream_domain_name'] = ''
        }

        const param = formatObj(modalData);

        editApiGroupModel.setParam(param);

        editApiGroupModel.excute(editApiSucess,editApiFaild);

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
            self.fetchAllApiGroup()

            self.showNotification(noticeConfig);

            self.addModal.hide();

        }

        function editApiFaild(err){
            const errMsg = err.msg;
            if(errMsg == 'grout_context已存在'){
                const type = modalType.indexOf('group') > -1 ?'group':'rateLimit';
                let temp;
                let newModalFields = modalFieldsArr[type].map(item=>{
                    temp = item;

                    if(temp.key + '已存在' == 'group_context已存在'){
                        temp.help = '您填写的API路由规则上下文已存在';
                        temp.validateStatus = 'error';
                    }

                    return temp

                })
                modalFieldsArr[type] = newModalFields;
                const upstream_domain_name = modalData.upstream_domain_name;
                let upstream_domain_protocol ='http://',
                    upstream_domain_host = upstream_domain_name;
                if(upstream_domain_name.indexOf('http')>-1){
                    const tempArr = upstream_domain_name.split('//');
                    upstream_domain_protocol = tempArr[0] + '//';
                    upstream_domain_host = tempArr[1];
                }

                modalData.upstream_domain_protocol = upstream_domain_protocol;
                modalData.upstream_domain_host = upstream_domain_host;

                self.setState({
                    modalFieldsArr:modalFieldsArr,
                    modalData:modalData
                })
            }
            let msg = "更新失败";
            if(err.err_no == 3001){
                msg = err.msg;
            }
            const noticeConfig = {
                description:msg,
                type:'faild'
            }

            self.showNotification(noticeConfig);

        }

    }
    // 新增限速值
    addRateLimit(){

        const self = this;

        let editKey = this.state.editKey,
            modalData = this.state.modalData,
            listData = this.state.listData;

        const param = formatObj(modalData);

        addGroupRateLimitModel.setParam(param);

        addGroupRateLimitModel.excute(editSucess,editFaild);

        function editSucess(res){

            modalData.id = res.id;
            listData[editKey].group_rate_limit = modalData;

            self.setState({
                listData:listData
            })

            const noticeConfig = {
                description:'更新成功',
                type:'success'
            }

            self.showNotification(noticeConfig);

            self.addModal.hide();

        }

        function editFaild(err){

            const noticeConfig = {
                description:'更新失败',
                type:'faild'
            }

            self.showNotification(noticeConfig);

        }
    }

    // 编辑限速值
    editRateLimit(){

        const self = this;

        let listData = this.state.listData,
            editKey = this.state.editKey,
            modalData = this.state.modalData;

        if (modalData['content_type'] === 'defaultValue' || !modalData['content_type']) {
            modalData['content_type'] = '';
            modalData['message'] = '';
        }
        const param = formatObj(modalData);

        editGroupRateLimitModel.setParam(param);

        editGroupRateLimitModel.excute(editSucess,editFaild);

        function editSucess(res){

            listData[editKey].group_rate_limit = modalData;

            self.setState({
                listData:listData
            })

            const noticeConfig = {
                description:'更新成功',
                type:'success'
            }

            self.showNotification(noticeConfig);

            self.addModal.hide();

        }

        function editFaild(err){

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

        const spanNum = 8;

        const fieldsConfig = {
            fieldsValue:fieldsValue,
            fieldsArr:fieldsArr,
            InputChangeHandle:InputChangeHandle,
            spanNum:spanNum

        }

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

        if(modalType == 'group_edit' || modalType == 'group_add'){
            fieldsArr = this.state.modalFieldsArr.group;
        }else if(modalType == 'ratelimit_edit' || modalType == 'ratelimit_add'){
            fieldsArr = this.state.modalFieldsArr.rateLimit;
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
                <div>后端服务错误响应类型：{ content_type }</div>
                <div>后端服务错误响应内容：{ message }</div>
            </Modal>
        )
    }

    renderMain() {
        const { targetModalTitle, targetModalVisible, targetData } = this.state;
        let pagenationObj = {
            pageSize: 50,
            total:this.state.listData.length,
            showTotal:(total, range) => {
                return '总共：' + total + '条';
            }
        };
        console.log(this.state.listData)
        return (

            <div style={{padding:'20px'}}>
                {this.renderSearchBar()}
                <Content>
                    <div className='btn_box'>
                        <Button className="editable-add-btn" onClick={this.showModal.bind(this,'group_add')} icon='plus' type='primary' className='right_btn'>新增路由规则</Button>
                    </div>
                    <Table
                        columns={this.indata.tableColumns}
                        dataSource={this.state.listData}
                        title={()=>{return (<h2 style={{ textAlign: "center" }}>路由规则列表</h2>)}}
                        bordered
                        pagination={pagenationObj}
                        expandedRowRender={this.renderGroupRateLimit.bind(this)}
                    />
                    <WkModal ref={(wkmodal)=>{this.addModal = wkmodal}}

                    />
                    <TargetModal
                        handleOk={ this.handleTargetOk.bind(this) }
                        cancel={ () => this.setState({targetModalVisible: false}) }
                        propertyModalTitle={ targetModalTitle }
                        targetVisible={ targetModalVisible }
                        dataSource={ targetData } />
                    { this.renderErrorMessage() }
                </Content>
            </div>

        );

    }

}

export default RouteGroup;
