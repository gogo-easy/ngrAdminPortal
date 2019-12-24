import Login from './view/login';
import loadable from '../src/util/loadable'
const Dashboard = loadable(()=>import('./view/general/dashboard'))

const UserListView = loadable(()=>import('./view/user_manager/user_list'))
const OperationLog = loadable(()=>import('./view/user_manager/operation_log'))

const PluginGeneral = loadable(()=>import('./view/plugin_manager/plugin_general'))
const Firewall = loadable(()=>import('./view/plugin_manager/firewall'))

const FirewallIsolated = loadable(()=>import('./view/plugin_manager/firewall_isolated'))
const PropertyRatelimit = loadable(()=>import('./view/plugin_manager/property_ratelimit'))
const PropertyIsolated = loadable(()=>import('./view/plugin_manager/property_isolated'))
const AntiAqlInjection = loadable(()=>import('./view/plugin_manager/anti_sql_injection'))

const HostManage = loadable(()=>import('./view/router_manager/host_manage'))
const GatewayManage = loadable(()=>import('./view/router_manager/gateway_manage'))
const RouteGroup = loadable(()=>import('./view/router_manager/route_group'))
const GrayDivide = loadable(()=>import('./view/router_manager/gray_divide'))

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
