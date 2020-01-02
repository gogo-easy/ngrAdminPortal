import React, { Component } from 'react'
import { render } from 'react-dom'
import { Layout, Avatar, Icon } from 'antd'

// import 'antd/dist/antd.min.css'; 
import '../common/less/private.less';

import { parseQuery } from '../util/util';

import SideMenu from '../ui/sidermenu'
import Nav from "./nav"

const { Content, Sider } = Layout;

class BaseView extends Component {

    constructor(props) {

        super(props);

        this.urlQuery = parseQuery(window.location.search);

        this.state = {
            pluginStatus: {},
            isMini:false
        }
    }

    updateSlider(pluginStatus) {

        this.setState({
            pluginStatus: pluginStatus
        });

    }
    isminiFn(){
        this.setState({
            isMini:!this.state.isMini
        })
    }
    renderSider() {

        return (
            <Sider class={this.state.isMini?'ismini':''} style={{ overflow: 'auto', height: '100vh', position: 'fixed', left: 0, zIndex: 1 }}>
                <div style={{textAlign: 'right',height: '40px',lineHeight: '40px',paddingRight: '20px'}} onClick={this.isminiFn.bind(this)}>{!this.state.isMini?<Icon type="left"></Icon>:<Icon type="right"></Icon>}</div>
                <SideMenu routepath={this.props.location.pathname} pluginStatus={this.state.pluginStatus} />
            </Sider>
        );

    }

    renderMain() {

        return ('');

    }

    render() {
        
        return (
            <div id="g_body" ref={(viewContainer) => { this.viewContainer = viewContainer }}>
                <Layout>
                    {this.renderSider()}
                    <Content style={{ paddingLeft: !this.state.isMini?200:50}}>
                        <Nav></Nav>
                        {this.renderMain()}
                        <div style={{textAlign: "center",marginRight: '22px'}}>Copyright @ 2019-2020 GoGo Easy Team</div>
                    </Content>
                </Layout>
            </div>
        );
    }
}


export default BaseView;
