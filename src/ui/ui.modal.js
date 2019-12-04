import React, {Component} from 'react'
import { Modal} from 'antd'


class WkModal extends Component {

	constructor(props) {

		super(props);

		this.state = {
			title:'',
			cancelText:'',
			okText:'',
			visible:false,
			width:'',
			className:'',
			content:'',
			maskClosable:false,
			destroyOnClose:true,
			iconType:'none',
			onOk:function(){},
			onCancel:this.hide.bind(this)
		}
		
	}


	show(config){
	    this.setState({
		 	title:config.title || '',
			cancelText:config.cancelText || '',
			okText:config.okText || '',
			visible:true,
			width:config.width || '',
			className:config.className || '',
			content:config.content || '',
			maskClosable:config.maskClosable || false,
			destroyOnClose:config.destroyOnClose || true,
			onOk:config.onOk || function(){},
			onCancel:config.onCancel || this.hide.bind(this)
	    });

	    this.renderContent = config.content || function(){};
	}

	hide(){
		this.setState({
			visible:false
		})

	}

	render() {
		const {
			title,
			cancelText,
			okText,
			visible,
			onOk,
			onCancel,
			width,
			className,
			content,
			maskClosable,
			destroyOnClose,
			iconType

		} = this.state;

		return (
			<Modal 
				title={title}
                cancelText={cancelText}
                okText={okText}
                visible={visible}
                onOk={onOk}
                onCancel={onCancel}
                width={width}
                className={className}
                maskClosable={maskClosable}
                destroyOnClose={destroyOnClose}
                iconType={iconType}

            >

            {this.renderContent && this.renderContent()}

            </Modal>
		);

	}

}

export default WkModal;