import BaseModel from '../core/model.base'


export class GrayDivideQueryModel extends BaseModel {
    constructor(props){
        super(props);
        this.url = 'gray_divide/query';
        this.method = 'GET';
    }
}


export class GrayDivideAdddModel extends BaseModel {
    constructor(props){
        super(props);
        this.url = 'gray_divide/add';
        //this.contentType ="application/json";

        this.method = 'POST';
    }
}


export class GrayDivideUpdateModel extends BaseModel {
    constructor(props){
        super(props);
        this.url = 'gray_divide/update';
        this.method = 'POST';
    }
}

export class GrayDivideDeleteModel extends BaseModel {
    constructor(props){
        super(props);
        this.url = 'gray_divide/delete';
        this.method = 'POST';
    }
}


export class GrayDivideEnableModel extends BaseModel {
    constructor(props){
        super(props);
        this.url = 'gray_divide/enable';
        this.method = 'POST';
    }
}


export class TargetsQueryModel extends BaseModel {
    constructor(props){
        super(props);
        this.url = 'api_router/query_target';
        this.method = 'GET';
    }
}

export class ConditionAddModel extends BaseModel{
    constructor(props){
        super(props);
        this.url = 'selector_condition/add';
        this.method = 'POST';
    }
}

export class ConditionUpdateModel extends BaseModel{
    constructor(props){
        super(props);
        this.url = 'selector_condition/update';
        this.method = 'POST';
    }
}

export class ConditionDeleteModel extends BaseModel{
    constructor(props){
        super(props);
        this.url = 'selector_condition/delete_by_id';
        this.method = 'POST';
    }
}
