import React, { Component } from 'react'
import { Layout, Form, Button, Input, Radio, Row, Col, Divider, Popconfirm, Table, notification, Icon, Select, DatePicker } from 'antd'

import BaseView from '../../core/view.base'
import FieldsContent from '../../ui/ui.fiedld'

import moment from 'moment';

import {
    BlockedListModel,
    LimitListModel
} from '../../models/proprety_ratelimit_models'
import {GatewayListModel, HostListModel} from "../../models/host_manager_models";


const { Header, Content } = Layout;
const FormItem = Form.Item;

let blockedListModel = BlockedListModel.getInstance(),
    limitListModel = LimitListModel.getInstance(),
    gatewayListModel = GatewayListModel.getInstance(),
    hostListModel = HostListModel.getInstance();

class PropretyRateLimit extends BaseView {

    constructor(props) {

        super(props);

        this.state = {

            listData: [],

            searchData: {
                date: moment().format('YYYY-MM-DD'),  //今天
                tableType: '0'                         //表类型  默认防阻止
            }
        }

        this.indata = {

            tableColumns: [
                {
                    title: '序号',
                    dataIndex: 'idx',
                    width: '50px',
                    align: 'center',
                    render: this.renderCollapse.bind(this, 'idx')
                },
                {
                    title: '特征防刷器名称',
                    dataIndex: 'name',
                    width: '150px',
                    align: 'center',
                    render: this.renderCollapse.bind(this, 'name')
                },
                {
                    title: '所属网关编码',
                    dataIndex: 'gateway_code',
                    width: '150px',
                    align: 'center'
                },
                {
                    title: '所属主机',
                    dataIndex: 'host',
                    width: '150px',
                    align: 'center'
                },
                {
                    title: '特征详情',
                    dataIndex: 'property_detail',
                    align: 'center',
                    children: [
                        {
                            title: '特征类型',
                            dataIndex: 'property_type',
                            key: 'property_type',
                            width: '100px',
                            align: 'center'
                        },
                        {
                            title: '特征属性名称',
                            dataIndex: 'property_name',
                            key: 'property_name',
                            width: '100px',
                            align: 'center'
                        },
                        {
                            title: '特征值',
                            dataIndex: 'actual_value',
                            key: 'actual_value',
                            width: '100px',
                            align: 'center'
                        }
                    ]
                },
            ],

            limitColumn: [
                {
                    title: '命中时间',
                    dataIndex: 'limit_time',
                    width: '100px',
                    align: 'center'
                },
                {
                    title: '命中日期',
                    dataIndex: 'limit_date',
                    width: '100px',
                    align: 'center'
                }
            ],
            blockedColumn: [
                {
                    title: '命中时间',
                    dataIndex: 'blocked_time',
                    width: '100px',
                    align: 'center',
                    render: this.renderCollapse.bind(this, 'blocked_time')
                },
                {
                    title: '命中日期',
                    dataIndex: 'blocked_date',
                    width: '100px',
                    align: 'center',
                    render: this.renderCollapse.bind(this, 'blocked_date')
                }
            ],

            searchFieldsArr: [
                {
                    key: 'tableType',
                    type: 'select',
                    label: '命中类型',
                    options: [
                        {
                            value: '0',
                            desc: '限速且阻塞'
                        }, {
                            value: '1',
                            desc: '仅限速'
                        }
                    ]
                },
                {
                    key: 'date',
                    type: 'select',
                    label: '日期',
                    options: this.getDateOptions()
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

                }
            ]

        }

    }
    renderCollapse (type, value, row) {
        const res = {
            children: value,
            props: {
                rowSpan: 1
            }
        }
        if ( /^idx|name|blocked_time|blocked_date$/.test(type) ) {
            res.props.rowSpan = row.rowSpan
        }

        return res
    }

    componentDidMount() {
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
                searchFieldsArr[2].options =searchFieldsArr[2].options.concat(option.gateway_codes);
                self.setState({searchFieldsArr:searchFieldsArr})
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
                let listData = res.data;
                let option = {};
                option.hosts = [];
                option.hosts.push({value:"defaultValue",desc:"请选择..."});
                listData.forEach((item,idx)=>{
                    option.hosts.push({value:item.id,desc:item.host});
                })

                searchFieldsArr[3].options =option.hosts;
                self.setState({searchFieldsArr:searchFieldsArr})
                resolve(res)
            },(err)=>{
                reject(err)
            })
        }).catch(err => {

        })
    }

    getDateOptions() {

        let options = [], value = '', temp = '', desc = '';

        for (var i = 0; i < 5; i++) {
            value = moment().subtract(i, 'days').format('YYYY-MM-DD');
            temp = value.split('-');
            desc = `${temp[0]}年${temp[1]}月${temp[2]}日`;
            options.push({
                value: value,
                desc: desc
            })
        }

        return options

    }

    fetchList() {
        const searchData = this.state.searchData;

        const searchFn = searchData.tableType == '0' ? blockedListModel : limitListModel;
        const param = {}
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

        searchFn.setParam(param, true);

        searchFn.excute(this.seachSuccess.bind(this), this.seachFaild.bind(this));

    }

    seachSuccess(res) {

        const resData = res.data || [];

        const listData = this.formatListData(resData);

        this.setState({
            listData
        })

    }

    seachFaild(err) {

        this.setState({
            listData: []
        })

        const noticeConfig = {
            description:err.msg || '查询失败',
            type:'faild'
        }

        this.showNotification(noticeConfig);

    }

    formatListData(listData) {
        const res = []

        listData.map((item, idx) => {
            return (item.property_detail || []).forEach((details, index) => {
                res.push({
                    rowSpan: index === 0 ? item.property_detail.length : 0,
                    key: res.length + 1,
                    idx: idx + 1,
                    name: item.name || '',
                    gateway_code:item.gateway_code,
                    host:item.host,
                    id: item.id || '',
                    blocked_time: item.blocked_time || '',
                    limit_time: item.limit_time || '',
                    limit_date: item.limit_date || '',
                    blocked_date: item.blocked_date || '',
                    property_type: details.property_type,
                    property_name: details.property_name,
                    actual_value: details.actual_value
                })
            })

        })
        return res

    }

    searchInputChange(key, e) {

        const target = e.target;

        const value = target ? target.value : e;

        let searchData = this.state.searchData;

        if(key =='gateway_code') {

            if(value =='defaultValue'){
                let searchFieldsArr = this.indata.searchFieldsArr;
                searchFieldsArr[3].options =[{value:"defaultValue",desc:"请选择..."}];
                searchData["host_id"]=''
            }

            this.fetchSearchHost(value)
            searchData["host_id"]=''

        }
        searchData[key] = value;

        this.setState({
            searchData: searchData
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

        const fieldsConfig = { InputChangeHandle, fieldsValue, fieldsArr, spanNum };

        return (
            <Form
                className="ant-advanced-search-form isolated_search_content"
                onSubmit={this.handleSearch.bind(this)}
            >

                <FieldsContent fieldsConfig={fieldsConfig}></FieldsContent>
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

        const tableType = this.state.searchData.tableType,
            listData = this.state.listData;

        let tableColumns = this.indata.tableColumns;

        const blockedColumn = this.indata.blockedColumn,
            limitColumn = this.indata.limitColumn;
        const column = tableType == '0' ? blockedColumn : limitColumn;

        tableColumns = tableColumns.concat(column);

        const title = tableType == '0' ? '限速且阻塞命中列表' : '限速命中列表';

        return (

            <div style={{ padding: '20px' }}>
                {this.renderSearchBar()}
                <Content>
                    <Table
                        columns={tableColumns}
                        dataSource={listData}
                        title={() => { return (<h2 style={{ textAlign: "center" }}>{title}</h2>) }}
                        bordered
                        pagination={ false }
                        expandRowByClick={true}
                        pageSize={10}
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

export default PropretyRateLimit;
