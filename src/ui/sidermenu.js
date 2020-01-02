import React, { Component } from 'react'

import { Menu } from 'antd'

const MenuItemGroup = Menu.ItemGroup;
const SubMenu = Menu.SubMenu;

import { PluginInfoStore, UserInfoStore } from '../store/business.store'

import {
	PluginListModel
} from '../models/plugin.models'
import { UserListModel } from "../models/user_manage_models";

const pluginInfoStore = PluginInfoStore.getInstance();
const userInfoStore = UserInfoStore.getInstance();

const pluginListModel = PluginListModel.getInstance();
const userListModel = UserListModel.getInstance();


class SideMenu extends Component {

	constructor(props) {

		super(props);

		// 菜单数据
		this.menuGroup = [
			{
				key: 'dashboard',
				name: '运行概况报表',
				urlpath: '/general/dashboard'
			}, {
				groupKey: 'router_manager',
				groupTitle: '路由管理',
				menuList: [
					{
						key: 'gateway_manage',
						name: '网关管理',
						urlpath: '/router_manager/gateway_manage'
					},
					{
						key: 'host_manage',
						name: '主机管理',
						urlpath: '/router_manager/host_manage'
					},
					// srv_grp_manage: added by Robin
					{
						key: 'upstream_manage',
						name: '上游管理',
						urlpath: '/router_manager/upstream_manage'
					},
					{
						key: 'route_group',
						name: '路由规则管理',
						urlpath: '/router_manager/route_group'
					},
					{
						key: 'gray_divide',
						name: 'AB分流管理',
						urlpath: '/router_manager/gray_divide'
					}
				]
			},
			{
				groupKey: 'plugin_manager',
				groupTitle: '插件管理',
				menuList: [
					{
						key: 'plugin_general',
						name: '插件列表',
						urlpath: '/plugin_manager/plugin_general'
					}, {
						subGroupKey: 'plugin_manager_property',
						subTitle: '特征防刷器',
						show: true,
						subMenuList: [
							{
								key: 'property_ratelimit',
								name: '特征防刷器配置',
								urlpath: '/plugin_manager/property_ratelimit'
							}, {
								key: 'property_isolated',
								name: '特征命中列表',
								urlpath: '/plugin_manager/property_isolated'
							}
						]
					}, {
						subGroupKey: 'plugin_manager_firewall',
						subTitle: '防火墙',
						show: true,
						subMenuList: [
							{
								key: 'firewall',
								name: '防火墙配置',
								urlpath: '/plugin_manager/firewall'
							}, {
								key: 'firewall_isolated',
								name: '防火墙命中列表',
								urlpath: '/plugin_manager/firewall_isolated'
							}
						]
					},
					{
						subGroupKey: 'plugin_manager_anti_slq',
						subTitle: 'SQL注入防控器',
						show: true,
						subMenuList: [
							{
								key: 'anti_sql_injection',
								name: 'SQL注入防控配置',
								urlpath: '/plugin_manager/anti_sql_injection'
							}
						]
					}
				]
			}
		];



		this.state = {
			menuGroup: this.menuGroup,// 菜单数据
			pluginInfo: {},
			update: true,  //

			selectedMenuKey: this.getSelectedMenuKey(),// 选中的菜单
			defaultOpenKeys: this.getDefaultOpenKeys()  //默认展开的菜单组

		};



	}



	componentDidMount() {
		this.checkAuthority();
		this.getPluginsInfo();
	}

	//查看用户权限,并设置管理模块的显示
	checkAuthority() {

		const user_router = {
			groupKey: 'user_manager',
			groupTitle: '用户管理',
			menuList: [
				{
					key: 'user_list',
					name: '用户列表',
					urlpath: '/user_manager/user_list'
				},
				{
					key: 'operation_log',
					name: '操作日志',
					urlpath: '/user_manager/operation_log'
				}
			]
		};
		const userInfo = userInfoStore.getData() || {};

		userListModel.setParam({
			username: userInfo.userName
		}, true)


		userListModel.excute(res => {
			if (res.data[0].is_admin == 1) {
				this.setState(prevState => {
					const old = prevState.menuGroup;
					return {
						menuGroup: [...old, user_router]
					}
				})
			}
		}, err => {

		})

	}



	getPluginsInfo() {

		let pluginInfo;

		const pluginLocalInfo = pluginInfoStore.getData();

		if (pluginLocalInfo) {

			pluginInfo = pluginLocalInfo;

			this.setMenuGroup(pluginInfo);

		} else {

			this.fetchPluginStatus(this.setMenuGroup.bind(this))

		}



	}
	//
	/*  
			设置插件管理动态菜单
			根据插件的启用禁用状态动态显示侧边栏餐带
	*/
	fetchPluginStatus(cb) {

		pluginListModel.excute(res => {

			const resData = res.data.plugins || [];

			let pluginStatus = {};

			resData.forEach(item => {

				pluginStatus[item.plugin_name] = item.enable;

			})

			pluginInfoStore.setData(pluginStatus);

			cb && cb(pluginStatus);

		}, err => {

		})

	}

	setMenuGroup(pluginInfo) {

		const pluginStatus = pluginInfo ? pluginInfo : this.props.pluginStatus;

		const udpate = this.state.update;

		let menuGroup = this.state.menuGroup, isUpdated = 0;

		if (!pluginStatus) { return menuGroup }

		let subMenuList, temp, subTemp, show;

		let newNemu = menuGroup.map(item => {

			temp = item;

			if (item.groupKey == 'plugin_manager') {

				subMenuList = item.menuList.map(subItem => {

					subTemp = subItem;

					if (subItem.subGroupKey == 'plugin_manager_property') {
						subTemp.show = pluginStatus.property_rate_limit == 1 ? 1 : 0;

					} else if (subItem.subGroupKey == 'plugin_manager_firewall') {
						subTemp.show = pluginStatus.waf == 1 ? 1 : 0;
					} else if (subItem.subGroupKey == 'plugin_manager_anti_slq') {
						subTemp.show = pluginStatus.anti_sql_injection == 1 ? 1 : 0;
					}

					if (subTemp.show !== subItem.show) {
						isUpdated++;
					}

					return subTemp

				})

				temp.menuList = subMenuList;

			}


			return temp

		})

		// return newNemu;

		this.setState({
			menuGroup: newNemu
		})

	}

	getSelectedMenuKey() {

		const routepath = this.props.routepath;

		const pathArr = routepath.split('/');

		const key = pathArr[pathArr.length - 1] || 'index';

		return [key];

	}

	getDefaultOpenKeys() {

		const routepath = this.props.routepath;

		const pathArr = routepath.split('/');

		const key = pathArr[pathArr.length - 2] || 'index';

		return [key];

	}

	onClickMenu(menuData) {
		var urlpath = menuData.item.props.data_urlpath;

		this.gotoMenuUrl(urlpath);
	}

	gotoMenuUrl(urlpath) {

		location.href = urlpath

	}

	renderMenuItems(menuList) {

		const self = this;

		return menuList.map(function (item, idx) {

			if (item.subMenuList) {

				if (item.show) {
					return (

						<MenuItemGroup key={item.subGroupKey} title={item.subTitle}>
							{self.renderMenuItems(item.subMenuList)}
						</MenuItemGroup>

					)
				}

			} else {
				return (<Menu.Item key={item.key} data_urlpath={item.urlpath}>{item.name}</Menu.Item>)

			}


		});

	}

	renderMenu() {

		var self = this;

		const menuGroup = this.state.menuGroup;

		return menuGroup.map(function (group, idx) {

			if (group.menuList && group.menuList.length > 0) {

				return (
					<SubMenu key={group.groupKey} title={group.groupTitle}>
						{self.renderMenuItems(group.menuList)}
					</SubMenu>
				)

			} else {

				return (
					<Menu.Item key={group.key} data_urlpath={group.urlpath}>{group.name}</Menu.Item>
				)

			}
		});

	}

	render() {

		return (
			<Menu
				onClick={this.onClickMenu.bind(this)}
				selectedKeys={this.state.selectedMenuKey}
				mode='inline'
				defaultOpenKeys={this.state.defaultOpenKeys}
			>
				{this.renderMenu()}
			</Menu>
		);

	}

}

export default SideMenu;
