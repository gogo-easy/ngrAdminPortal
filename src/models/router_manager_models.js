import BaseModel  from '../core/model.base'
/*
	路由组列表
*/
export class ApiGroupListModel extends BaseModel {

	constructor(props) {

		super(props);

		this.url = 'api_router/query_api_group' ;
		this.method = 'GET';

	}

}

export class SimpleGroupQueryModel extends BaseModel{
    constructor(props) {

        super(props);

        this.url = 'api_router/query_simple_group_info' ;
        this.method = 'GET';

    }
}

/*
	路由组列表（带限速信息）
*/
export class ApiGroupRateListModel extends BaseModel {

	constructor(props) {

		super(props);

		this.url = 'api_router/query_api_group_rate_limit' ;
		this.method = 'GET';

	}

}

/*
	删除路由组
*/
export class DelApiGroupModel extends BaseModel {

	constructor(props) {

		super(props);

		this.url = 'api_router/delete_api_group' ;

	}

}
/*
	新增路由规则组
	
*/
export class AddApiGroupModel extends BaseModel {

	constructor(props) {

		super(props);

		this.url = 'api_router/add_api_group' ;

	}

}

/*
	编辑路由组
	
*/
export class EditApiGroupModel extends BaseModel {

	constructor(props) {

		super(props);

		this.url = 'api_router/update_api_group' ;

	}

}

/*
	编辑路由组

*/
export class EnableApiGroupModel extends BaseModel {


    constructor(props) {

        super(props);

        this.url = 'api_router/enable_api_group' ;

    }

}

/*
	查询路由组限速列表
	
*/
export class ApiGroupRateLimitListModel extends BaseModel {

	constructor(props) {

		super(props);

		this.url = 'group_rate_limit/get/' ;
		this.method = 'GET';

	}

}
/*
	新增路由规则组限速列表
	
*/
export class AddGroupRateLimitModel extends BaseModel {

	constructor(props) {

		super(props);

		this.url = 'group_rate_limit/add' ;

	}

}
/*
	编辑路由规则组限速列表
	
*/
export class EditGroupRateLimitModel extends BaseModel {

	constructor(props) {

		super(props);

		this.url = 'group_rate_limit/update';

	}

}
/*
	删除路由组限速列表
	
*/
export class DelGroupRateLimitModel extends BaseModel {

	constructor(props) {

		super(props);

		this.url = 'group_rate_limit/delete'

	}

}

export class AddGroupTargetModel extends BaseModel {
	constructor(props) {
		super(props)
		this.url = 'api_router/add_target'
	}
}

export class UpdateGroupTargetModel extends BaseModel {
	constructor(props) {
		super(props)
		this.url = 'api_router/update_target'
	}
}

export class DeleteGroupTargetModel extends BaseModel {
	constructor(props) {
		super(props)
		this.url = 'api_router/delete_target'
	}
}

/*
	启禁用target
*/
export class EnableTargetModel extends BaseModel {


    constructor(props) {

        super(props);

        this.url = 'api_router/enable_target' ;

    }

}
