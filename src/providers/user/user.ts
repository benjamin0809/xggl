import 'rxjs/add/operator/toPromise';

import { Injectable } from '@angular/core';

import { Api } from '../api/api';

import { Http,Headers, RequestOptions } from '@angular/http';
import { HttpParams } from '@angular/common/http';
/**
 * Most apps have the concept of a User. This is a simple provider
 * with stubs for login/signup/etc.
 *
 * This User provider makes calls to our API at the `login` and `signup` endpoints.
 *
 * By default, it expects `login` and `signup` to return a JSON object of the shape:
 *
 * ```json
 * {
 *   status: 'success',
 *   user: {
 *     // User fields your app needs, like "id", "name", "email", etc.
 *   }
 * }Ø
 * ```
 *
 * If the `status` field is not `success`, then an error is detected and returned.
 */
@Injectable()
export class User {
  _user: any;

  constructor(public api: Api) { }

  /**
   * Send a POST request to our login endpoint with the data
   * the user entered on the form.
   */
  login(accountInfo: any) {
    accountInfo.methodType = 'isLogin';

   
    let headers = new Headers();

    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/json' );
  
    let reqOpts :any
    if (!reqOpts) {
      reqOpts = {
  
        headers: headers,
      
      };
    }

    // if (accountInfo) {
    //   reqOpts.params = new HttpParams();
    //   for (let k in accountInfo) {
    //     reqOpts.params = reqOpts.params.set(k, accountInfo[k]);
    //   }
    // }
    // let pramas = JSON.stringify(accountInfo);
    let seq = this.api.post('MobileAppServlet',accountInfo, reqOpts).share();

    seq.subscribe((res: any) => {
      // If the API returned a successful response, mark the user as logged in
      if (res.status == 'success') {
        this._loggedIn(res);
      } else {
      }
    }, err => {
      console.error('ERROR', err);
    });

    return seq;
  }

  private toQueryString(obj) {  
    let result = [];  
    for (let key in obj) {  
        key = encodeURIComponent(key);  
        let values = obj[key];  
        if (values && values.constructor == Array) {  
            let queryValues = [];  
            for (let i = 0, len = values.length, value; i < len; i++) {  
                value = values[i];  
                queryValues.push(this.toQueryPair(key, value));  
            }  
            result = result.concat(queryValues);  
        } else {  
            result.push(this.toQueryPair(key, values));  
        }  
    }  
    return result.join('&');  
} 

private toQueryPair(key, value) {  
  if (typeof value == 'undefined') {  
      return key;  
  }  
  return key + '=' + encodeURIComponent(value === null ? '' : String(value));  
}  
  /**
   * Send a POST request to our signup endpoint with the data
   * the user entered on the form.
   */
  signup(accountInfo: any) {
    let seq = this.api.post('signup', accountInfo).share();

    seq.subscribe((res: any) => {
      // If the API returned a successful response, mark the user as logged in
      if (res.status == 'success') {
        this._loggedIn(res);
      }
    }, err => {
      console.error('ERROR', err);
    });

    return seq;
  }

  /**
   * Log the user out, which forgets the session
   */
  logout() {
    this._user = null;
  }

  /**
   * Process a login/signup response to store user data
   */
  _loggedIn(resp) {
    this._user = resp.user;
  }
}
