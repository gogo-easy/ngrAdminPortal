import BaseModel  from '../core/model.base'
/*
	防火墙列表
*/
export class FirewallListModel extends BaseModel {

	constructor(props) {

		super(props);

		this.url = 'waf/query_waf' ;
		this.method = 'GET';

	}
}

/*
	删除防火墙
*/
export class DelFirewallModel extends BaseModel {

	constructor(props) {

		super(props);

		this.url = 'waf/delete_waf' ;

	}

}
/*
	新增防火墙
	
*/
export class AddFirewallModel extends BaseModel {

	constructor(props) {

		super(props);

		this.url = 'waf/create_waf' ;

	}

}

/*
	编辑防火墙
	
*/
export class EditFirewallModel extends BaseModel {

	constructor(props) {

		super(props);

		this.url = 'waf/update_waf' ;

	}

}

/*
	启禁用防火墙

*/
export class UpdateEnableModel extends BaseModel {

    constructor(props) {

        super(props);

        this.url = 'waf/update_enable' ;

    }

}

/*
	查询防火墙规则列表
	
*/
export class FwRuleListModel extends BaseModel {

	constructor(props) {

		super(props);

		this.url = 'waf/query_condition' ;
		this.method = 'GET';

	}

}
/*
	新增防火墙规则列表
	
*/
export class AddFwRuleModel extends BaseModel {

	constructor(props) {

		super(props);

		this.url = 'waf/create_condition';

	}

}
/*
	编辑防火墙规则列表
	
*/
export class EditFwRuleModel extends BaseModel {

	constructor(props) {

		super(props);

		this.url = 'waf/updated_condition';

	}

}
/*
	删除防火墙规则列表  跟据条件ID
	
*/
export class DelFwRuleModel extends BaseModel {

	constructor(props) {

		super(props);

		this.url = 'waf/delete_condition_by_id' ;

	}

}
/*
	删除防火墙规则列表 跟据防火墙ID
	
*/
export class DelFwRuleByFwIdModel extends BaseModel {

	constructor(props) {

		super(props);

		this.url = 'waf/delete_condition_by_waf_id' ;

	}

}

/*
	查看某一天防火墙拒绝记录
	
*/
export class IsolatedByFwModel extends BaseModel {

	constructor(props) {

		super(props);

		this.url = 'waf/query_judge_record' ;
		this.method = 'GET';

	}

}

