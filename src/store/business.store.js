import BaseStore from './store.base'


//登陆用户信息
export class UserInfoStore extends BaseStore {

	constructor(props) {
		super(props);

		// 缓存数据标志
		this.key = '__ngr_user_info__';

		// 缓存时间,支持单位 天-"D", 时-"H", 分钟-"M"
		// 如 "30D", "0.5H"
		this.lifetime = '7D';
	}

}

// 用户auth信息
export class HttpAuthInfoStore extends BaseStore {

	constructor(props) {
		super(props);

		// 缓存数据标志
		this.key = '__ngr_http_auth__';

		// 缓存时间,支持单位 天-"D", 时-"H", 分钟-"M"
		// 如 "30D", "0.5H"
		this.lifetime = '2H';
	}

}
// 用户auth信息
export class PluginInfoStore extends BaseStore {

	constructor(props) {
		super(props);

		// 缓存数据标志
		this.key = '__ngr_plugin_info__';

		// 缓存时间,支持单位 天-"D", 时-"H", 分钟-"M"
		// 如 "30D", "0.5H"
		this.lifetime = '7D';
	}

}
