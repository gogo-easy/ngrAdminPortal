import BaseModel from '../core/model.base'

/*
	gateway list
*/
export class GateWayListModel extends BaseModel {

  constructor(props) {

    super(props);

    this.url = 'gateway/query';
    this.method = 'GET';

  }

}

/*
	设置网关QPS限流信息
*/
export class SetLimitModel extends BaseModel {

  constructor(props) {

    super(props);

    this.url = 'gateway/set_limit_count';
    this.method = 'POST';

  }

}

/*
	新增网关
*/
export class AddGatewayModel extends BaseModel {

  constructor(props) {

    super(props);

    this.url = 'gateway/add';
    this.method = 'POST';

  }

}
