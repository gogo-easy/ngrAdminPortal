import BaseModel  from '../core/model.base'

/*
	sql防控列表
*/
export class AntiSqlInjectionListModel extends BaseModel {

	constructor(props) {

		super(props);

		this.url = 'anti_sql_injection/query';
		this.method = 'GET';

	}

}

/*
	sql防控创建
*/
export class AntiSqlInjectionCreateModel extends BaseModel {

	constructor(props) {

		super(props);

		this.url = 'anti_sql_injection/create';
		this.method = 'POST';

	}

}

/*
	sql 防控更新
*/
export class AntiSqlInjectionUpdateModel extends BaseModel {

	constructor(props) {

		super(props);

		this.url = 'anti_sql_injection/update';
		this.method = 'POST';

	}

}



/*
	sql 防控删除
*/
export class AntiSqlInjectionDeleteModel extends BaseModel {

	constructor(props) {

		super(props);

		this.url = 'anti_sql_injection/delete';

	}

}

/*
	sql 防控启禁用
*/
export class AntiSqlInjectionUpdateEnableModel extends BaseModel {

    constructor(props) {

        super(props);

        this.url = 'anti_sql_injection/update_enable';

    }

}

/*
	防控参数添加
*/
export class ASICOParameterCreateModel extends BaseModel {

	constructor(props) {

		super(props);

		this.url = 'anti_sql_injection/co_parameter/create';

	}

}

/*
	防控参数修改
	
*/
export class ASICOParameterUpdateModel extends BaseModel {

	constructor(props) {

		super(props);

		this.url = 'anti_sql_injection/co_parameter/update';

	}

}

/*
	防控参数删除
*/
export class ASICOParameterDeleteModel extends BaseModel {

    constructor(props) {

        super(props);

        this.url = 'anti_sql_injection/co_parameter/delete';

    }

}

// 删除特征信息接口
export class ASICOParameterQueryModel extends BaseModel {

	constructor(props) {

		super(props);

		this.url = 'anti_sql_injection/co_parameter/query';

	}

}
