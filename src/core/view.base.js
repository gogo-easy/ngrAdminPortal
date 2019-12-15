import React, { Component } from 'react'
import { render } from 'react-dom'
import { Layout, Avatar } from 'antd'

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
            pluginStatus: {}
        }
    }

    updateSlider(pluginStatus) {

        this.setState({
            pluginStatus: pluginStatus
        });

    }

    renderSider() {

        return (
            <Sider style={{ overflow: 'auto', height: '100vh', position: 'fixed', left: 0, zIndex: 1 }}>
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
                    <Content style={{ paddingLeft: 200, minWidth: 1180 }}>
                        <Nav></Nav>
                        {this.renderMain()}
                        <div style={{textAlign: "center",marginRight: '22px'}}>Copyright@2019 Go Go Easy Team</div>
                    </Content>
                </Layout>
            </div>
        );
    }
}


export default BaseView;
