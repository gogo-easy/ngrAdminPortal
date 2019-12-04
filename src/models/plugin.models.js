import BaseModel  from '../core/model.base'
/*
	插件列表
*/
export class PluginListModel extends BaseModel {

	constructor(props) {

		super(props);

		this.url = 'plugins' ;
		this.method = 'GET';

		this.notParallelism = false;

	}

}

/*
	切换插件状态
*/
export class TogglePluginEnableModel extends BaseModel {

	constructor(props) {

		super(props);

	}

}

