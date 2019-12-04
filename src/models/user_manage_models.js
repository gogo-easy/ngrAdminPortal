import BaseModel from '../core/model.base'

/*
	用户查询列表
*/
export class UserListModel extends BaseModel {

  constructor(props) {

    super(props);

    this.url = 'query_user_list';
    this.method = 'GET';

  }

}

export class UserAddModel extends BaseModel {

  constructor(props) {

    super(props);

    this.url = 'create_user';
    this.method = 'POST';

  }

}


export class UserModifyModel extends BaseModel {

  constructor(props) {

    super(props);

    this.url = 'modify_user';
    this.method = 'POST';

  }

}

export class PassWordModifyModel extends BaseModel {

  constructor(props) {

    super(props);

    this.url = 'modify_passowrd';
    this.method = 'POST';

  }

}


export class UserEnableModel extends BaseModel {

  constructor(props) {

    super(props);

    this.url = 'user_enable';
    this.method = 'POST';

  }

}