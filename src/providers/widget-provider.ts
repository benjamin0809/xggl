import 'rxjs/add/operator/toPromise';

import { Injectable } from '@angular/core';

import { HttpService } from '../services/http-service';
import { Session } from '../services/session';


@Injectable()
export class WidgetProvider {
  _user: any;

  constructor(private httpService: HttpService, 
    private session: Session) { 

  }

  getAllWidget(input:any){
    let seq = this.httpService.post('Widget/GetAll', true, input).share();
    seq.subscribe((data: any) => {

    });
    return seq;
  }

  
  getAllForEdit(input:any){
    let seq = this.httpService.post('Widget/GetAllForEdit', true, input).share();
    seq.subscribe((data: any) => {

    });
    return seq;
  }

  getFavorites(){
    let seq = this.httpService.post('Widget/Favorites', true, {"Lang": this.session.language}).share();
    seq.subscribe((data: any) => {

    });
    return seq;
  }

  setFavorites(input:any){
    let seq = this.httpService.post('Widget/SetFavorites', true, input).share();
    seq.subscribe((data: any) => {

    });
    return seq;
  }
  //轮播图
  getSlideList(){
    let seq = this.httpService.post('Content/SlideList', true, {"Lang": this.session.language}).share();
    seq.subscribe((data: any) => {

    });
    return seq;
  }
  //友情链接
  getFriendlyLinkList(){
    let seq = this.httpService.post('Content/FriendlyLinkList', true, {"Lang": this.session.language}).share();
    seq.subscribe((data: any) => {

    });
    return seq;
  }


}
