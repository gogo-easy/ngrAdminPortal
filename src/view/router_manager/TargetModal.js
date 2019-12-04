import React, { Component } from 'react'
import { Modal, Input, InputNumber, Checkbox } from 'antd'
import classnames from 'classnames'
import PropTypes from 'prop-types'

export default class TargetModal extends Component {
    static propTypes = {
        handleOk: PropTypes.func,                                   // 确定触发的方法
        cancel: PropTypes.func.isRequired,                          // 取消方法
        propertyModalTitle: PropTypes.string.isRequired,            // modal标题文案
        targetVisible: PropTypes.bool.isRequired,                   // modal是否可见判断值
        dataSource: PropTypes.object.isRequired
    }
    constructor (props) {
        super(props)
        this.state = {
            id: null,
            weight: '',
            host: '',
            port: '',
            is_only_ab_check:false,
            statusList: [true, true, true],                         // 各输入框输入数据状态值
        }
    }
    componentWillReceiveProps (nextProps) {
        if ( this.state.id !== nextProps.dataSource.id ) {
            const { group_id, id, weight, host, port ,is_only_ab_check} = nextProps.dataSource
            this.setState({
                group_id,
                id: id || '',
                weight: weight || '',
                host: host || '',
                port: port || '',
                is_only_ab_check: is_only_ab_check || false,
                statusList: [true, true, true],
            })
        }
    }
    changeInputValue (e = 1, type) {
        // 若为number类型,数据组件已处理好,e值会有不同
        let value = e.target ? e.target.value : e;

        if(type=='is_only_ab_check'){
            value = e.target.checked;
        }

        this.setState({
            [type]: value
        })
    }
    // 输入值验证，若有不符合规则的输入，则修改状态数组中对应序列值下的布尔值
    confirmAndHandleOk () {
        const { handleOk } = this.props,
            { id, weight, host, port, group_id, statusList,is_only_ab_check } = this.state

        statusList[0] = /^[1-9]\d*$/.test(weight)
        statusList[1] = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(host)
        statusList[2] = /^[1-9]\d*$/.test(port)

        const cannotUpload = statusList.some(status => status === false)
        if (cannotUpload) {
            this.setState({
                statusList
            })
            return null
        }
        handleOk({ id, weight, host, port,is_only_ab_check, group_id })
    }
    render() {
        const { propertyModalTitle, targetVisible } = this.props,
            { weight, host, port, statusList, is_only_ab_check } = this.state

        return (
            <Modal
                title={ propertyModalTitle }
                okText='确定'
                cancelText='取消'
                visible={ targetVisible }
                onOk={ this.confirmAndHandleOk.bind(this) }
                onCancel={ this.props.cancel }>
                <div className='target_input'>
                    <span className='label'>权重:</span>
                    <InputNumber
                        size="large"
                        placeholder='请输入权重(数字类型)'
                        value={ weight }
                        onChange={ e => this.changeInputValue(e, 'weight') }
                        style={{ margin: '10px 0', width: '200px' }} />
                    <span className={ classnames('input_tips', {
                        none: statusList[0]
                    }) }>必填项且为正整数</span>
                </div>
                <div className='target_input'>
                    <span className='label'>IP地址:</span>
                    <Input
                        size="large"
                        placeholder='请输入IP地址'
                        value={ host }
                        onChange={ e => this.changeInputValue(e, 'host') }
                        style={{ margin: '10px 0' }} />
                    <span className={ classnames('input_tips', {
                        none: statusList[1]
                    }) }>必填项且必须符合IP地址</span>
                </div>
                <div className='target_input'>
                    <span className='label'>端口:</span>
                    <InputNumber
                        size="large"
                        placeholder='请输入端口'
                        value={ port }
                        onChange={ e => this.changeInputValue(e, 'port') }
                        style={{ margin: '10px 0' }} />
                    <span className={ classnames('input_tips', {
                        none: statusList[2]
                    }) }>必填项且为正整数</span>
                </div>
                <div className='target_input'>
                    <span className='label'>仅用于AB分流:</span>
                    <Checkbox
                        size="large"
                        checked={is_only_ab_check}
                        onChange={ e => this.changeInputValue(e, 'is_only_ab_check') }
                        style={{ margin: '10px 0' }}
                    />
                </div>
            </Modal>
        )
    }
}
