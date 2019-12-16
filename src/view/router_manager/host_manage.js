import React, { Component } from 'react'
import { Layout, Form, Button, Row, Col, Divider, Popconfirm, Table, notification, Icon, Modal, Input, Select, Option } from 'antd'
import moment from 'moment'

import BaseView from '../../core/view.base'
import WkModal from '../../ui/ui.modal'
import FieldsContent from '../../ui/ui.fiedld'

import { formatObj, gotoPage } from '../../util/util'
import { ModifyHostQPS } from "./host_qps"

import {
    HostListModel,
    GatewayListModel,
    ToggleStatusModel
} from '../../models/host_manager_models'


const { Header, Content } = Layout;
const FormItem = Form.Item;


let hostListModel = HostListModel.getInstance(),
    gatewayListModel = GatewayListModel.getInstance(),
    toggleStatusModel = ToggleStatusModel.getInstance();

class HostManage extends BaseView {

    constructor(props) {

        super(props);

        this.state = {
            listData: [],



            searchData: {},


            responseMessage: {                  // 返回错误信息详情
                title: '',
                content_type: '',
                message: '',
                visible: false,
            }
        }

        this.indata = {
            tableColumns: [
                {
                    title: '序号',
                    dataIndex: 'idx',
                    width: '50px',
                    align: 'center'
                }, {
                    title: '主机名称',
                    dataIndex: 'host_desc',
                    width: '100px',
                    align: 'center'
                },
                {
                    title: '所属网关服务',
                    dataIndex: 'gateway_desc',
                    width: '100px',
                    align: 'center'
                },
                {
                    title: '所属网关编码',
                    dataIndex: 'gateway_code',
                    width: '100px',
                    align: 'center'
                },
                {
                    title: '主机域名',
                    dataIndex: 'host',
                    width: '100px',
                    align: 'center'
                },
                {
                    title: '当前状态',
                    render: this.cellEnable.bind(this),
                    width: '100px',
                    align: 'center'
                },
                {
                    title: 'QPS限流阈值(单机)',
                    dataIndex: 'limit_count',
                    width: '100px',
                    align: 'center'
                },
                {
                    title: '操作',
                    width: '150px',
                    align: 'center',
                    render: this.operationColumn.bind(this)
                }
            ],

            searchFieldsArr: [    //搜索
                {
                    key: 'host_desc',
                    label: '主机名称:',
                    type: 'input',
                    placeholder: '请输入主机名称'

                },
                {
                    key: 'host',
                    label: '主机域名:',
                    type: 'input',
                    placeholder: '请输入主机域名'

                },
                {
                    key: 'gateway_desc',
                    label: '所属网关名称:',
                    type: 'select',
                    options: [
                        {
                            value: 'defaultValue',
                            desc: '请选所属网关名称'
                        }
                    ]

                },
                {
                    key: 'gateway_code',
                    label: '所属网关编码:',
                    type: 'select',
                    options: [
                        {
                            value: 'defaultValue',
                            desc: '请选择所属网关编码'
                        }
                    ]

                },
                {
                    key: 'enable',
                    label: '是否启用:',
                    type: 'select',
                    options: [
                        {
                            value: 'defaultValue',
                            desc: '请选择使用状态'
                        },
                        {
                            value: '1',
                            desc: '启用'
                        },
                        {
                            value: '0',
                            desc: '禁用'
                        }
                    ]
                }
            ]
        }

    }

    componentDidMount() {
        this.fetchAllList();
        this.fetchSearchParam();
    }

    cellEnable(text, record, index) {

        const cellStyle = record.enable_txt == '禁用' ? { color: '#f00' } : {};

        return (
            <span style={cellStyle} >{record.enable_txt}</span>
        )

    }

    operationColumn(text, record, index) {
        return (
            <span>
                <ModifyHostQPS {...record}></ModifyHostQPS>
                <Divider type="vertical" />
                <Popconfirm
                    title="你确更改状态吗?"
                    onConfirm={() => this.onToggleStatus(record)}
                    cancelText='取消'
                    okText='确定'
                >
                    <a href="javascript:;">启禁用</a>
                </Popconfirm>
                <Divider type="vertical" />
                <a href="javascript:;" onClick={this.goApiGroup.bind(this, record)}>查看路由规则</a>
            </span>
        )

    }

    onToggleStatus(record) {

        let self = this,
            listData = this.state.listData;

        const id = record.id;
        const idx = record.idx;
        const enable = record.enable;

        toggleStatusModel.setParam({
            id: id,
            enable: enable == 0 ? 1 : 0
        });

        toggleStatusModel.excute(toggleSuccess, toggleFalid);

        function toggleSuccess(res) {
            listData[idx - 1].enable = record.enable == 0 ? 1 : 0;
            listData[idx - 1].enable_txt = listData[idx - 1].enable == 0 ? '禁用' : '启用';
            listData = listData;
            self.setState({
                listData: listData,
            })

            const noticeConfig = {
                description: '状态变更成功',
                type: 'success'
            }

            self.showNotification(noticeConfig);

        }

        function toggleFalid() {
            const noticeConfig = {
                description: '状态变更成功',
                type: "error"
            }

            self.showNotification(noticeConfig);
        }
    }

    goApiGroup(record) {
        gotoPage('/router_manager/route_group?host_id=' + record.id + '&gateway_id=' + record.gateway_id);
    }

    showNotification(param) {

        if (!param.description) { return };

        if (param.type == 'success') {

            notification.success({
                message: param.message || '',
                description: param.description || '',
                duration: 2
            });

        } else {

            notification.error({
                message: param.message || '',
                description: param.description || '',
                duration: 2
            });

        }
    }

    fetchAllList() {
        let self = this;

        return new Promise((resolve, reject) => {
            hostListModel.setParam({}, true)
            hostListModel.excute((res) => {
                const listData = self.formatListData(res.data);

                self.setState({
                    listData: listData
                })
                resolve(res)
            }, (err) => {
                reject(err)
            })
        }).catch(err => {

        })
    }


    fetchSearchParam() {
        let self = this;
        let searchFieldsArr = this.indata.searchFieldsArr;

        return new Promise((resolve, reject) => {
            gatewayListModel.excute((res) => {
                const optionData = self.seachParFormatListData(res.data);
                searchFieldsArr[2].options = searchFieldsArr[2].options.concat(optionData.gateway_descs);
                searchFieldsArr[3].options = searchFieldsArr[3].options.concat(optionData.gateway_codes);
                self.setState({ searchFieldsArr: searchFieldsArr })
                resolve(res)
            }, (err) => {
                reject(err)
            })
        }).catch(err => {

        })
    }

    searchHostList() {
        const param = {};
        const searchData = this.state.searchData;
        param.host_desc = searchData.host_desc || null
        param.id = searchData.id || null
        param.host = searchData.host || null

        if (searchData.gateway_desc && searchData.gateway_desc !== 'defaultValue') {
            param.gateway_desc = searchData.gateway_desc
        }

        if (searchData.gateway_code && searchData.gateway_code !== 'defaultValue') {
            param.gateway_code = searchData.gateway_code
        }

        if (searchData.enable && searchData.enable !== 'defaultValue') {
            param.enable = searchData.enable
        }

        hostListModel.setParam(param, true);

        hostListModel.excute(this.seachSuccess.bind(this), this.seachFaild.bind(this));

    }

    resetSearchData() {

        this.setState({
            searchData: {}
        })

    }


    seachSuccess(res) {

        const resData = res.data || [];

        const listData = this.formatListData(resData);


        this.setState({
            listData: listData

        })

    }

    seachFaild() {

        this.setState({
            listData: []
        })

    }

    formatListData(listData) {

        return listData.map((item, idx) => {
            return {
                key: idx,
                idx: idx + 1,
                id: item.id || '',
                host_desc: item.host_desc || {},
                gateway_desc: item.gateway_desc || '',
                gateway_code: item.gateway_code,
                host: item.host,
                enable: item.enable,
                enable_txt: item.enable == '0' ? '禁用' : '启用',
                limit_count: item.limit_count,
                gateway_id: item.gateway_id
            }

        })

    }

    seachParFormatListData(listData) {
        let option = {};
        option.gateway_descs = [];
        option.gateway_codes = [];
        listData.forEach((item, idx) => {
            option.gateway_descs.push({ value: item.gateway_desc, desc: item.gateway_desc });
            option.gateway_codes.push({ value: item.gateway_code, desc: item.gateway_code });
        })
        return option
    }

    searchInputChange(key, e) {

        const target = e.target;

        const value = target ? target.value : e;

        let searchData = this.state.searchData;

        searchData[key] = value;

        this.setState({
            searchData: searchData
        })

    }


    handleSearch(e) {

        e.preventDefault();

        this.searchHostList();

    }

    renderSearchBar() {

        const InputChangeHandle = this.searchInputChange.bind(this);

        const fieldsValue = this.state.searchData;

        let fieldsArr = this.state.searchFieldsArr;
        if (!fieldsArr) { return false };
        const spanNum = 8;

        const fieldsConfig = { InputChangeHandle, fieldsValue, fieldsArr, spanNum };

        return (
            <Form
                className="ant-advanced-search-form"
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

    renderMain() {
        let pagenationObj = {
            pageSize: 50,
            total: this.state.listData.length,
            showTotal: (total, range) => {
                return '总共：' + total + '条';
            }
        };

        return (

            <div style={{ padding: '20px' }}>
                {this.renderSearchBar()}
                <Content>

                    <Table
                        columns={this.indata.tableColumns}
                        dataSource={this.state.listData}
                        title={() => { return (<div style={{ textAlign: 'center', fontSize: '20px', color: "#000" }}>主机列表</div>) }}
                        bordered
                        pagination={pagenationObj}
                    />
                </Content>

            </div>

        );

    }

}

export default HostManage;
