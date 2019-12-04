import extend from '../util/extend'

class BaseStore {

    constructor() {

        // 缓存数据标志
        this.key = '';

        // 缓存时间,支持单位 天-"D", 时-"H", 分钟-"M"
        // 如 "30D", "0.5H" 
        this.lifetime = '30M';

        // 缓存容器，以浏览器localstorage为容器
        this.storage = window.localStorage;

    }

    //在不覆盖原有数据的是时候做更新
    set(data) {
        try {
            var data = extend(this.getData() || {}, data);

            this.setData(data);
        } catch(e) {

        }
    }

    setData(data) {

        var storageData;

        try {
            storageData = this._buildStorageData(data);
            this.storage.setItem(this.key, JSON.stringify(storageData));
            return true;

        } catch(e) {

            //localstorage 数据写满, 全清掉,可优化 
            if (e.name == 'QuotaExceededError' || e.name == 'QUOTA_EXCEEDED_ERR') {

                this.storage.clear(); 
                this.setData(data);
            }

            this._sendStorageExceptionLog({
                type: 'SET',
                api_params: JSON.stringify(storageData || {}),
                api_response: JSON.stringify({
                    type: 'SET', 
                    err: e || {},
                    stack: (e || {}).stack || {},
                    message: (e || {}).message || "",
                    userAgent: window.navigator.userAgent
                })
            })

        }

        return false;

    }

    getData() {

        var result = null, storageItem, storageData;

        try {

            storageItem = this.storage.getItem(this.key);

            storageData = storageItem ? JSON.parse(storageItem) : null;

            if (storageData && storageData.expiretime) {

                if (this._isExpiredTime(storageData.expiretime)) {

                    this.storage.removeItem(this.key);

                } else {

                    result = storageData.data;

                }

            }


        } catch (e) {

            this._sendStorageExceptionLog({
                type: 'GET',
                api_params: JSON.stringify(storageData || {}),
                api_response: JSON.stringify({
                    type: 'GET', 
                    err: e || {},
                    stack: (e || {}).stack || {},
                    message: (e || {}).message || "",
                    userAgent: window.navigator.userAgent
                })
            })

        }

        return result;

    }

    _isExpiredTime(expiretime) {

        return this._getNowTime() >= expiretime;

    }

    _buildStorageData(data) {

        return {
            data: data,
            savetime: this._getNowTime(),
            expiretime: this._getExpireTime()
        }

    }

    _getNowTime() {

        return (new Date()).getTime();

    }

    _getExpireTime() {

        var lifetime = this.lifetime,
            nowTime = this._getNowTime();

        var durationTime = 0;

        var baseSeconds,
            unit = lifetime.slice(-1),
            num = Number(lifetime.slice(0, lifetime.length - 1));

        switch (unit) {
            case 'M': 
                baseSeconds = 60 * 1000; break;
            case 'H':
                baseSeconds = 60 * 60 * 1000; break;
            case 'D':
                baseSeconds = 24 * 60 * 60 * 1000; break;
        }

        if (typeof num != 'number' || !baseSeconds) { 

            console.log('超时时间参数错误！请检查，并重新设置！');

        }

        durationTime = num * baseSeconds;

        return nowTime + durationTime;

    }

    remove() {

        this.storage.removeItem(this.key);

    }

    _sendStorageExceptionLog(logData) {

        var _data = [
            'api_address=' + encodeURIComponent(this.key),
            'api_params=' + encodeURIComponent(logData.api_params),
            'api_response=' + encodeURIComponent(logData.api_response),
            'page_url=' + encodeURIComponent(window.location.href)
        ];

        this._sendLog(_data.join('&'));

    }

    // 临时使用
    _sendLog(data) {
        if(typeof __mw_send_req__ == 'function') {
            __mw_send_req__(data);
        }
    }

}

BaseStore.getInstance = function() {
    if(!this.instance || !(this.instance instanceof this)) {
        this.instance = new this();
    }

    return this.instance;
}

export default BaseStore;
