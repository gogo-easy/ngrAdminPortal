import BaseModel  from '../core/model.base'
/*
	概况报表
*/
export class DashboardListModel extends BaseModel {

	constructor(props) {

		super(props);

		this.url = 'dashboard/show' ;
		this.method = 'GET';

	}

}

/*
	登陆接口
*/
export class LoginModel extends BaseModel {

	constructor(props) {

		super(props);

		this.url = 'login' ;
		// this.method = 'GET';

	}

}

