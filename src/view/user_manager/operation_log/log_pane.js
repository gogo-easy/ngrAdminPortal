//  log 详情面板

import { Button, Modal, Card } from 'antd';
import React, { Component } from 'react';

import JSONInput from 'react-json-editor-ajrm';
import locale from 'react-json-editor-ajrm/locale/zh-cn';

export class LogPane extends React.Component {
  state = { visible: false }

  showModal = () => {
    this.setState({
      visible: true,
    });
  }

  hide = () => {
    this.setState({
      visible: false,
    });
  }


  handleCancel = (e) => {
    this.setState({
      visible: false,
    });
  }

  render() {

    const { log } = this.props;


    return (
      <div >
        <Button type="primary" onClick={this.showModal}>
          查看详情
        </Button>
        {
          this.state.visible ? <Modal
            maskClosable={false}
            title='日志详情'
            visible={this.state.visible}
            onOk={this.handleCancel}
            onCancel={this.handleCancel}
            okText="确认"
            cancelText="取消"
            className="log-info-pane"
          >

            <Card bordered={false} style={{ width: 500 }}>
              <p>remark : {log.remark}</p>
              <p>username : {log.username}</p>
              <p>module_desc : {log.module_desc}</p>
              <p>operation_desc : {log.operation_desc}</p>
              <p>in_param : </p>
              <JSONInput
                id='a_unique_id'
                placeholder={JSON.parse(log.in_param)}
                locale={locale}
                viewOnly={true}
                height='auto'
                width="452px"
              />

            </Card>
          </Modal> : ""
        }

      </div>
    );
  }
}


