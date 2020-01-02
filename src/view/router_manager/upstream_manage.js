/*
    service group
    added by robin
*/
import React, {Component} from 'react'
import classnames from 'classnames'
import {Layout,Form, Button,Row,Col,Divider,Popconfirm,Table,notification,Icon, Modal,Tooltip} from 'antd'

import TargetModal from './TargetModal.js'

import BaseView from '../../core/view.base'
import WkModal from '../../ui/upstream_manage/modal'
import FieldsContent from '../../ui/upstream_manage/field'

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
    EnableTargetModel,
    
    AddUpStreamModel,
    DeleteUpStreamModel,
    UpStreamListModel,
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

let addUpstreamModel = AddUpStreamModel.getInstance();
let delUpstreamModel = DeleteUpStreamModel.getInstance();
let upstreamListModel = UpStreamListModel.getInstance();

class ServiceGroup extends BaseView {
    constructor (props){
        super(props);

        let modalFieldsArr = {
            group:[        //新增和编辑
                {
                    key:'upstream_name',
                    label:'上游组名称',
                    type:'input',
                    placeholder:'输入上游组名称',
                    disabled: false
                },
                {
                    key:'upstream_type',
                    label:'类型',
                    type:'select',
                    options:[
                        {
                            value: 'defaultValue',
                            desc: '请选择'

                        },
                        {
                            value: 'input',
                            desc: '手动'
                        },
                        {
                            value: 'domain',
                            desc: '域名'
                        },
                        {
                            value: 'register',
                            desc: '服务发现'
                        },
                    ],
                    disabled: false
                },
                {
                    key: 'lb_type',
                    label: '负载均衡策略',
                    type: 'select',
                    options: [
                        {
                            value: 'defaultValue',
                            desc: '请选择'

                        },
                        {
                            value: 'rr',
                            desc: '轮询'
                        },
                        {
                            value: 'ip_hash',
                            desc: 'ip哈希'
                        },
                        {
                            value: 'random',
                            desc: '随机'
                        },
                        {
                            value: 'weighted',
                            desc: '权重'
                        },
                    ],
                    disabled: false
                }
            ]
        }

        this.indata = {
            selectData: {},
            tableColumns: [
                {
                    title: '名称',
                    dataIndex: 'upstream_name',
                    width:'100px',
                    align:'center'
                },
                {
                    title: '类型',
                    dataIndex: 'upstream_type',
                    width:'100px',
                    align:'center'
                },
                {
                    title: '负载均衡策略',
                    dataIndex: 'lb_type',
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
            searchFieldsArr: [
                {
                    key:'upstream_name',
                    label:'上游组名称',
                    type:'input',
                    placeholder:'请输入上游名称'
                }
            ]
        };

        this.state = {
            listData : [],
            editKey: '',
            searchFieldsArr: this.indata.searchFieldsArr,
            searchData: {},
            modalType: 'search',
            modalData: new Array(),
            modalFieldsArr:modalFieldsArr,
            upstreamModalVisible: false,
            upstreamModalTitle: '',
            upstreamData: {},
            responseMessage: {                  // 返回错误信息详情}
                title: '',
                content_type: '',
                message: '',
                visible: false,
                http_status:'',
            }
        };


    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }
    
    onDelete(id){

        let self = this,
            listData = this.state.listData;

        delUpstreamModel.setParam({
            id:id
        })

        delUpstreamModel.excute(delSuccess,delFalid);

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
    
    operationColumn(text, record, index){
        return (
            <span>
                <a href="javascript:;" onClick={ this.showModal.bind(this,'group_edit',record) }><Icon type="edit" /></a>
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

    searchInputChange(key,e) {

        const target = e.target;

        const value = target ? target.value : e ;

        let searchData = this.state.searchData;
        let searchFieldsArr = this.state.searchFieldsArr;

        searchData[key] = value;


        if(key === 'upstream_name'){
            let upstreamOptions = this.formatSrvGrpList(this.indata.selectData.upstream_name,value);
            searchFieldsArr[0].options=[{"value":"defaultValue","desc":"请选择..."}].concat(upstreamOptions);
            searchData['srvgrp_name']='';
        }


        this.setState({
            searchFieldsArr:searchFieldsArr,
            searchData: searchData
        })

    }

    resetSearchData(){

        let searchFieldsArr = this.state.searchFieldsArr;
        //清空网关数据源
        searchFieldsArr[0].options=[{"value":"defaultValue","desc":"请选择..."}];

        const searchData = {
            upstream_name: ''
        };

        this.setState({
            searchData:searchData,
            searchFieldsArr:searchFieldsArr
        })

    }

    searchSuccess() {

    }

    searchFailed() {

    }

    searchServiceGroupList() {
        let param = {};

        const searchData = this.state.searchData;

        if(searchData.upstream_name){
            param.upstream_name = searchData.upstream_name
        }

        upstreamListModel.setParam(param,true);

        upstreamListModel.excute(this.seachSuccess.bind(this),this.seachFailed.bind(this));
    }

    handleSearch(e) {

        e.preventDefault();

        this.searchServiceGroupList();

    }

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


        this.setState({
            modalFieldsArr: modalFieldsArr
        })

        flag = flag == 0 ?true:false;

        return flag;
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

    renderModalContent() {

        const InputChangeHandle = this.modalInputChange.bind(this);

        const fieldsValue = this.state.modalData;
        let fieldsArr = this.state.modalFieldsArr.group;

        const spanNum = 20;
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

    formatListData(listData){
        return listData.map((item,idx)=>{
            item['key'] = idx;
            return item
        });
    }

    addUpstream() {
        let self = this;
        let {listData, modalData} = this.state;
        let param = formatObj(modalData);
        addUpstreamModel.setParam(param);
        addUpstreamModel.excute(executeSuccess, executeFail);
        function executeSuccess(res) {

            self.addModal.hide();
            listData.push(modalData);
            listData = self.formatListData(listData);
            self.setState({
                    listData: listData,
                    modalData: {}
                }
            )
            const noticeConfig = {
                description:'新增成功',
                type:'success'
            }
            self.showNotification(noticeConfig);
        }
        function executeFail(err){
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

    editUpstream() {}

    modalHandleOk() {
        const modalType = this.state.modalType;
        if(this.paramValidate()){

            if(modalType == 'upstream_add'){
                this.addUpstream();
            }else if (modalType == 'upstream_edit'){
                this.editUpstream();
            }

        }
    }

    modalInputChange(key,e) {
        const target = e.target,
            value = target ? target.value : e
        let { modalFieldsArr, modalData } = this.state

        if (typeof value === 'string') {
            modalData[key] = value.trim();
        } else {
            modalData[key] = value
        }

        switch(key){
            case 'upstream_type':
                // if(modalData[key]==value){ break; }
                while(modalFieldsArr.group.findIndex(item => item.key.startsWith('member'))>=0){
                    modalFieldsArr.group.splice(modalFieldsArr.group.findIndex(item => item.key.startsWith('member')), 1);
                }
                let tmpKeyList = new Array();
                for(let tmpkey in modalData){
                    if(tmpkey.startsWith('member')){
                        tmpKeyList.push(tmpkey);
                    }
                }
                tmpKeyList.forEach((item, index) => delete modalData[item]);
                switch (value){
                    case 'input':
                        modalFieldsArr.group.push(
                            {
                                key: 'memberButton',
                                label: '添加上游成员',
                                type: 'button',
                                disabled: false
                            }
                        );
                        break;
                    case 'domain':
                        modalFieldsArr.group.push(
                            {
                                key: 'memberInput',
                                label: '域名',
                                type: 'input',
                                placeholder: 'domain.com',
                                disabled: false
                            }
                        );
                        break;
                }
                break;
            case 'memberButton':
                modalFieldsArr.group.push(
                    {
                        key: 'memberInput'+ (modalFieldsArr.group.length - 3),
                        label: '上游成员'+ (modalFieldsArr.group.length - 3),
                        type: 'memberInput',
                        disabled: false
                    }
                );
                break;
            case (key.match('memberInput') || {}).input:
                if(typeof e === 'string'){
                    modalFieldsArr.group.splice(modalFieldsArr.group.findIndex(item => item.key == key), 1);
                    delete modalData[key];
                }
                break;
            default:
                break;
        }

        this.setState({
            modalData,
            modalFieldsArr
        })
    }

    resetModalFieldsArr(modalType){

        let contentData = this.state.modalFieldsArr;

        this.setState({
            modalFieldsArr:contentData
        })
    }

    showModal(flag,record){
        let modalData = this.state.modalData;
        let editKey = '';
        let confirmParam ;
        if(flag == 'upstream_edit'){

            if(upstream_domain_name.indexOf('http') > -1){
                const tempArr = upstream_domain_name.split('//');
                upstream_domain_protocol = tempArr[0] + '//';
                upstream_domain_host = tempArr[1];
            }

            modalData = {
            };

            confirmParam = {
                title:'编辑上游组',
                cancelText:'取消',
                okText:'确认',
                content:this.renderModalContent.bind(this),
                onOk:this.modalHandleOk.bind(this),
                width:'50%'
            }


        }
        else{
            modalData = {
            };
            confirmParam = {
                title:'新增上游组',
                cancelText:'取消',
                okText:'确认',
                content:this.renderModalContent.bind(this),
                onOk:this.modalHandleOk.bind(this),
                width:'50%'
            }
        }
        this.resetModalFieldsArr(flag);
        this.setState({
            modalType:flag,
            modalData,
            editKey
        });

        this.addModal.show(confirmParam);

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

    handleTargetOk (params) {
        const { updateOrAddTarget } = this.state,
            _this = this;

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
                description:'添加上游失败',
                type:'failed'
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
                description:'更新上游失败',
                type:'faild'
            }
            if (+err.err_no === 3001) {
                noticeConfig.description = err.msg
            }
            _this.showNotification(noticeConfig);
        }
    }

    closeErrorMessage () {
        this.setState({
            responseMessage: {...this.state.responseMessage, visible: false}
        })
    }

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
        const { upstreamModalTitle, upstreamModalVisible, upstreamData } = this.state;
        let pagenationObj = {
            pageSize: 50,
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
                        <Button className="editable-add-btn" onClick={this.showModal.bind(this,'upstream_add')} icon='plus' type='primary' className='right_btn'>新增上游</Button>
                    </div>
                    <Table
                        columns={this.indata.tableColumns}
                        dataSource={this.state.listData}
                        title={()=>{return (<div style={{textAlign:'center',fontSize:'20px',color:"#000"}}>上游列表</div>)}}
                        bordered
                        pagination={pagenationObj}
                    />
                    <WkModal ref={(wkmodal)=>{this.addModal = wkmodal}}

                    />
                    <TargetModal
                        handleOk={ this.handleTargetOk.bind(this) }
                        cancel={ () => this.setState({upstreamModalVisible: false}) }
                        propertyModalTitle={ upstreamModalTitle }
                        targetVisible={ upstreamModalVisible }
                        dataSource={ upstreamData } />
                    { this.renderErrorMessage() }
                </Content>
            </div>

        ); 
    }
}

export default ServiceGroup;