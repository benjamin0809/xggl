import {Injectable} from '@angular/core';
import {Session} from "./session";
import * as fundebug from "fundebug-javascript";

/**
 * fundebug-javascript 監控Javascript異常
 * @description
 */
@Injectable()
export class Logger {
  constructor(private session: Session) {
  }

  log(err: any, action: string, other = null): void {
    console.log('Logger.log：action-' + action);
    other && console.log(other);
    console.log(err);
    fundebug.notifyError(err,
      {
        metaData: {
          action: action,//操作名称
          other: other,//其他数据信息
          user: {id: this.session.userId, name: this.session.username}
        }
      });
  }

  httpLog(err: any, msg: string, other = {}): void {
    console.log('Logger.httpLog：msg-' + msg);
    fundebug.notifyHttpError(err,
      {
        metaData: {
          action: msg,//操作名称
          other: other,//其他数据信息
          user: {id: this.session.userId, name: this.session.username}
        }
      });
  }

}