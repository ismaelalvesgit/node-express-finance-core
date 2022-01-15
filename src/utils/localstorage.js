import NodeCache from "node-cache";

class LocalStorage{
    
    /** @type {import('node-cache')} */
    localStorage;

    constructor(){
        this.localStorage = new NodeCache();
    }

    /**
     * 
     * @param {string} key 
     * @param {object} obj 
     * @param {number | string} ttl 
     * @returns {boolean}
     */
    set(key, obj, ttl){
        return this.localStorage.set(key, obj, ttl);
    }

    /**
     * 
     * @param {Array<{key:string, val:object, ttl: number | string}>} array 
     * @returns {void}
     */
    mset(array){
        this.localStorage.mset(array);
    }

    /**
     * 
     * @param {Array<string> | string} key 
     * @returns {{[key: string]: any}}
     */
    get(key){
        if(Array.isArray(key)){
            return this.localStorage.mget(key);
        }

        return {
            [key]: this.localStorage.get(key)
        };
    }

    /**
     * @param {Array<string> | string} key
     * @returns {number} 
     */
    del(key){
        return this.localStorage.del(key);
    }

    /**
     * @param {string} key
     * @returns {boolean} 
     */
    exist(key){
        return this.localStorage.has(key);
    }

    /**
     * @param {string} key
     * @returns {number} 
     */
    getTtl(key){
        return this.localStorage.getTtl(key);
    }

    /**
     * 
     * @param {string} key 
     * @param {number} time 
     * @returns {boolean}
     */
    changeTtl(key, time){
        return this.localStorage.ttl(key, time);
    }

    /**
     * 
     * @returns {{keys: number, hits:number, misses:number, ksize:number, vsize:number}}
     */
    getStatus(){
        return this.localStorage.getStatus();
    }

    /**
     * @returns {void}
     */
    clear(){
        this.localStorage.close();
    }

    /**
     * 
     * @param {'set' | 'del' | 'expired' | 'flush' | 'flush_stats'} key 
     * @param {function(key, value)} callback 
     */
    observable(key, callback){
        this.localStorage.on(key, callback);
    }
}

export default new LocalStorage();