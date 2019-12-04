import React, {Component} from 'react'
import BaseView from '../../core/view.base'

import { 
    PluginListModel,
    TogglePluginEnableModel
} from '../../models/plugin.models'

import {PluginInfoStore} from '../../store/business.store'

import {Button,Row,Col,Divider,Icon,Card,Switch,notification,Popconfirm} from 'antd'


let pluginListModel = PluginListModel.getInstance(),
    togglePluginEnableModel = TogglePluginEnableModel.getInstance();

const pluginInfoStore = PluginInfoStore.getInstance();

class PluginGeneral extends BaseView {

    constructor(props) {

        super(props);

        this.state = {
        	pluginList:[],
        	pageStatus:'init',
        }

    }

    componentDidMount(){
    	this.fetchPluginList();
        
    }

    fetchPluginList(){

    	const self = this;

    	pluginListModel.excute(res=>{

    		const resData = res.data || [];



    		const data = self.formatData(resData.plugins);

            const length = data.length;
            let visible = [];
            visible.length = length;            

            //更新缓存
            let pluginStatue = {};
            resData.plugins.forEach(item=>{ 
                pluginStatue[item.plugin_name] = item.enable;
            })
            
            pluginInfoStore.setData(pluginStatue);

            self.setState({
                pluginList:data,
                pageStatus:'ready',
                visible:visible
            })

            self.updateSlider(pluginStatue)
            

    	},err=>{
    		//TODO
    	})

    }

    formatData(data){

        let title = '',order = 0,urlPath = '';

    	return data.map((item,idx)=>{

            title = item.plugin_name;

            switch (item.plugin_name) {
               
                case 'property_rate_limit' :
                    title = '特征防刷器';
                    order= 1;
                    urlPath = 'plugin_manager/property_ratelimit';
                    break;
                case 'waf' :
                    title = '防火墙';
                    order= 2;
                    urlPath = 'plugin_manager/firewall';
                    break;
                case 'anti_sql_injection':
                    title = 'SQL注入防控器';
                    order = 3;
                    urlPath = 'plugin_manager/anti_sql_injection';
                    break;
            }

            return {
                plugin_name:item.plugin_name,
                enable:item.enable,
                order:order,
                title:title,
                idx:idx,
                urlPath:urlPath
            }

        })

    }

    toggleEnable(item,idx){
        let self = this,
            pluginList = self.state.pluginList;

        const enable = item.enable  == '1' ? 0 : 1;
        const message = enable == 0?'禁用':'启用';

        togglePluginEnableModel.url =  item.plugin_name + '/enable';

        togglePluginEnableModel.setParam({
            enable:enable
        })

        togglePluginEnableModel.excute(res=>{

            pluginList[item.idx].enable = enable;
            self.hidePopConfirm(idx);
            self.setState({
                pluginList:pluginList,
            },()=>{



                let pluginInfo = pluginInfoStore.getData();
                pluginInfo[item.plugin_name] = enable;

                pluginInfoStore.setData(pluginInfo);

                console.log(pluginInfo)

                self.updateSlider(pluginInfo);
            })


            const noticeParam = {
                description:item.title + message + '成功',
                type:'success'
            }
            self.showNotification(noticeParam);

            //更新缓存
            let pluginInfo = pluginInfoStore.getData();
            pluginInfo[item.plugin_name] = enable;
            pluginInfoStore.setData(pluginInfo);
             

        },err=>{

            self.hidePopConfirm(idx);

            const noticeParam = {
                message:item.title + message + '失败',
                type:'success'
            }

            self.showNotification(noticeParam);

        });

    }

    showNotification(param){

        if(!param.description){return};

        if(param.type == 'success'){

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

    showPopConfirm(idx){
        let visible = this.state.visible;
        visible[idx] = true;
        this.setState({
            visible:visible
        })
    }

    hidePopConfirm(idx){
        let visible = this.state.visible;
        visible[idx] = false;
        this.setState({
            visible:visible
        })
    }

    gotoPluginDetail(item){

        __mei_wei__.appHistory.reactHistory.push(__mei_wei__.env.basepath + item.urlPath);
    }

    renderCard(){
        const self = this;
        const pluginList = this.state.pluginList,visible = this.state.visible;

    	let content = pluginList.map((item,idx)=>{

            const visibleItem = visible[idx];

            const enable = item.enable == '1'?true:false;
            const title = item.enable == '1'?"你确定要关闭插件吗？":"你确定要开启插件吗？";
    		return (
    			<Col span={4} key={idx} order={item.order}>
		        	<Card 
		        		title={<p className ='card_title'>{item.title}</p>} 
		        		bordered={true}
		        		hoverable={true}
		        		activeTabKey='-'
		        		className= 'card_content'
                        actions = {enable?[<Icon type='setting' onClick={this.gotoPluginDetail.bind(this,item)}></Icon> ]:''}
		        	>
                    <Switch checkedChildren="开" unCheckedChildren="关" checked={enable} onChange={()=>{this.showPopConfirm(idx)}}/>
                        <Popconfirm
                            title={title}
                            onConfirm={() => self.toggleEnable(item,idx)}
                            onCancel={() => self.hidePopConfirm(idx)}
                            cancelText='取消'
                            okText='确定'
                            visible={visibleItem}
                        >
		        		    
                        </Popconfirm>
		        	</Card>
		      	</Col>
    		)

    	})

    	return (
			<Row gutter={40} type="flex">
		      	{content}
		    </Row>
    	)


    }

    renderPlugins(){

    	return (

    		<div className='card_content'>
    			<div className='content_title'>·插件概况</div>
			    {this.renderCard()}
			</div>

    	)

    }

    renderMain() {

    	const pageStatus = this.state.pageStatus;

    	if(pageStatus == 'ready'){

    		return (
	    		<div style={{padding:'20px'}}>

	    			{this.renderPlugins()}
	    		</div>

    		)
    		

    	}else{

    		return ''
    	}

    }

}

export default PluginGeneral;