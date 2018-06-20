import {Injectable} from '@angular/core';
import { Events } from 'ionic-angular';
import {
  Http, Response, Headers, RequestOptions, URLSearchParams, RequestOptionsArgs, RequestMethod
} from '@angular/http';
import {Observable, TimeoutError} from "rxjs";

import {Utility} from "./utility"; 
import {NativeService} from "./native-service";
import {APP_SERVE_URL, REQUEST_TIMEOUT, IS_DEBUG} from "./constants";
import {Logger} from "./logger";

@Injectable()
export class HttpService {

  constructor(public http: Http, 
              public logger: Logger,
              public events: Events, 
              public nativeService: NativeService) {
  }

  count: number = 0;//记录未完成的请求数量,当请求数为0关闭loading,当不为0显示loading
  public request(url: string, needAuth:boolean=false, options: RequestOptionsArgs): Observable<Response> {
    url = this.formatUrlDefaultApi(url);
    if (needAuth) {
      options = this.addAuthorizationHeader(options);
    }
    IS_DEBUG && console.log('%c 请求前 %c', 'color:blue', '', 'url', url, 'options', options);
    this.showLoading();
    return Observable.create(observer => {
      this.http.request(url, options).timeout(REQUEST_TIMEOUT).subscribe(res => {
        let data = this.requestSuccessHandle(url, options, res);
        data.errcode==0 ? observer.next(data) : observer.error(data);
      }, err => {
        observer.error(this.requestFailedHandle(url, options, err));
      });
    });
  }


  public get(url: string,needAuth:boolean=false, paramMap: any = null): Observable<any> {
    return this.request(url,needAuth, new RequestOptions({
      method: RequestMethod.Get,
      search: HttpService.buildURLSearchParams(paramMap)
    }));
  }

  public post(url: string,needAuth:boolean=false, body: any = {}): Observable<any> {
    return this.request(url, needAuth, new RequestOptions({
      method: RequestMethod.Post,
      body: body,
      headers: new Headers({
        'Content-Type': 'application/json; charset=UTF-8'
      })
    }));
  }

  public postFormData(url: string,needAuth:boolean=false, paramMap: any = null): Observable<any> {
    return this.request(url, needAuth, new RequestOptions({
      method: RequestMethod.Post,
      body: HttpService.buildURLSearchParams(paramMap).toString(),
      headers: new Headers({
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      })
    }));
  }

  public put(url: string,needAuth:boolean=false, body: any = {}): Observable<any> {
    return this.request(url, needAuth, new RequestOptions({
      method: RequestMethod.Put,
      body: body
    }));
  }

  public delete(url: string,needAuth:boolean=false, paramMap: any = null): Observable<any> {
    return this.request(url, needAuth, new RequestOptions({
      method: RequestMethod.Delete,
      search: HttpService.buildURLSearchParams(paramMap).toString()
    }));
  }

  public patch(url: string,needAuth:boolean=false, body: any = {}): Observable<any> {
    return this.request(url, needAuth, new RequestOptions({
      method: RequestMethod.Patch,
      body: body
    }));
  }


  /**
   * 处理请求成功事件
   */
  requestSuccessHandle(url: string, options: RequestOptionsArgs, res: Response) {
    this.hideLoading();
    let json = res.json();
    if (url.indexOf(APP_SERVE_URL) != -1) {
      if (json.errcode != 0) {
        IS_DEBUG && console.log('%c 请求失败 %c', 'color:red', '', 'url', url, 'options', options, 'err', res);
        if (json.errcode == 401 || (json.errcode >=6000 && json.errcode<=6010)) {//401 token无效或过期需要重新登录
          //this.nativeService.showToast('用户会话已过期,请重新登录');
          //this.navCtrl.push(LoginPage);
          this.events.publish('user:reLogin', Date.now());
        } else {
          //this.nativeService.alert(json.errmsg || '请求失败,请稍后再试!');
        }
        return json;
      } else {
        IS_DEBUG && console.log('%c 请求成功 %c', 'color:green', '', 'url', url, 'options', options, 'res', res);
        return json;//{success: true, data: json};
      }
    } else {
      return {errcode: 0, result: json};
    }
  }


  /**
   * 处理请求失败事件
   */
  private requestFailedHandle(url: string, options: RequestOptionsArgs, err: Response) {
    IS_DEBUG && console.log('%c 请求失败 %c', 'color:red', '', 'url', url, 'options', options, 'err', err);
    this.hideLoading();
    if (!this.nativeService.isConnecting()) {
      this.nativeService.alert('请连接网络');
    } else if (err instanceof TimeoutError) {
      this.nativeService.alert('请求超时,请稍后再试!');
    } else {
      let status = err.status;
      let msg = '请求发生异常';
      if (status === 0) {
        msg = '请求失败，请求响应出错';
      } else if (status === 404) {
        msg = '请求失败，未找到请求地址';
      } else if (status === 500) {
        msg = '请求失败，服务器出错，请稍后再试';
      }
      this.nativeService.alert(msg);
      this.logger.httpLog(err, msg, {
        url: url,
        status: status
      });
    }
    return err;
  }

  /**
   * 将对象转为查询参数
   */
  private static buildURLSearchParams(paramMap): URLSearchParams {
    let params = new URLSearchParams();
    if (!paramMap) {
      return params;
    }
    for (let key in paramMap) {
      let val = paramMap[key];
      if (val instanceof Date) {
        val = Utility.dateFormat(val, 'yyyy-MM-dd hh:mm:ss')
      }
      params.set(key, val);
    }
    return params;
  }

  /**
   * 格式化url使用默认API地址:APP_SERVE_URL
   */
  private formatUrlDefaultApi(url: string = ''): string {
    return Utility.formatUrl(url.startsWith('http') ? url : APP_SERVE_URL + url)
  }

  /**
   * 给请求头添加权限认证token
   */
  private addAuthorizationHeader(options: RequestOptionsArgs): RequestOptionsArgs { 
    // if(token!=null && token!=undefined){
    //   if (options.headers) {
    //     options.headers.append('Authorization', 'Bearer ' + token);
    //   } else {
    //     options.headers = new Headers({
    //       'Authorization': 'Bearer ' + token
    //     });
    //   }
    // }
    return options;
  }

  private showLoading() {
    if (++this.count > 0) {//一旦有请求就弹出loading 
    }
  }

  private hideLoading() { 
      //延迟处理可以避免嵌套请求关闭了第一个loading,突然后弹出第二个loading情况(结合nativeService.showLoading())
      setTimeout(() => {
        if (--this.count === 0) {//当正在请求数为0,关闭loading
          this.nativeService.hideLoading();
        }
      }, 200);
  
  }
}