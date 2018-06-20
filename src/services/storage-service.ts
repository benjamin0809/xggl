import { Injectable } from '@angular/core';
import {Storage} from "@ionic/storage";

@Injectable()
export class StorageService {
    constructor(public storage: Storage )
    {/*构造方法*/

    }

    setItem(key,value){
        this.storage.set(key,value);
    }

    getItem(key){
        return this.storage.get(key);
    }

    removeItem(key){
        this.storage.remove(key);
    }

}