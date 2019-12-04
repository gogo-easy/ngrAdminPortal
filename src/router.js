import Login from './view/login';

import Dashboard from './view/general/dashboard';

import UserListView from './view/user_manager/user_list';
import OperationLog from './view/user_manager/operation_log';

import PluginGeneral from './view/plugin_manager/plugin_general';
import Firewall from './view/plugin_manager/firewall';
import FirewallIsolated from './view/plugin_manager/firewall_isolated';
import PropertyRatelimit from './view/plugin_manager/property_ratelimit';
import PropertyIsolated from './view/plugin_manager/property_isolated';
import AntiAqlInjection from './view/plugin_manager/anti_sql_injection';

import HostManage from './view/router_manager/host_manage';
import GatewayManage from './view/router_manager/gateway_manage';
import RouteGroup from './view/router_manager/route_group';
import GrayDivide from './view/router_manager/gray_divide';


const basePath ='';


 const Router = [

 	{
		path:basePath + '/',
		page:Dashboard
	},
	{
		path:basePath + '/dashboard',
		page:Dashboard
	},
	{
		path:basePath + '/general/dashboard',
		page:Dashboard
	},
	{
		path:basePath + '/login',
		page:Login
	},
	{
		path:basePath + '/user_manager/user_list',
		page:UserListView
	},
	{
		path:basePath + '/user_manager/operation_log',
		page:OperationLog
	},

	{
		path:basePath + '/plugin_manager/plugin_general',
		page:PluginGeneral
	},
	{
		path:basePath + '/plugin_manager/firewall',
		page:Firewall
	},
	{
		path:basePath + '/plugin_manager/firewall_isolated',
		page:FirewallIsolated
	},
	{
		path:basePath + '/plugin_manager/property_ratelimit',
		page:PropertyRatelimit
	},
	{
		path:basePath + '/plugin_manager/property_isolated',
		page:PropertyIsolated
	},
	{
		path:basePath + '/plugin_manager/anti_sql_injection',
		page:AntiAqlInjection
	},

	{
		path:basePath + '/router_manager/host_manage',
		page:HostManage
	},
	{
		path:basePath + '/router_manager/gateway_manage',
		page:GatewayManage
	},
	{
		path:basePath + '/router_manager/route_group',
		page:RouteGroup
	},
	{
		path:basePath + '/router_manager/gray_divide',
		page:GrayDivide
	},
	
];

export default  Router;
