import BaseModel from '../core/model.base'

/*
    hsot 列表
 */
export class HostListModel extends BaseModel {
    constructor(props) {
        super(props);
        this.url = 'host/query';
        this.method = 'GET';
    }
}

export class HostQPSModel extends BaseModel {
    constructor(props) {
        super(props);
        this.url = 'host/set_limit_count';
        this.method = 'POST';
    }
}

export class AddHostQPSModel extends BaseModel {
    constructor(props) {
        super(props);
        this.url = 'host/add';
        this.method = 'POST';
    }
}

/*
    gateway 列表
 */
export class GatewayListModel extends BaseModel {
    constructor(props) {
        super(props);
        this.url = 'gateway/query';
        this.method = 'GET';
    }
}

/*
    启禁用
 */
export class ToggleStatusModel extends BaseModel {
    constructor(props) {
        super(props);
        this.url = 'host/enable';
        this.method = 'POST';
    }
}
