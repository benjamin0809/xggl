import { Injectable } from '@angular/core';
import { HttpService } from '../services/http-service';
import { Session } from '../services/session';
import { Img } from 'ionic-angular';


@Injectable()
export class FaceService {
  constructor(private httpService: HttpService,
    private session: Session) 
    {

    }

    //检测人脸
    Detect(image_base64:string){
      image_base64 = "";
      var map :Map<string,string>;
      map.set("app_key","IVQNF-evjN2A7QlksgR9o6CZZZiW5OsX");
      map.set("api_secret","D325_MKkIab2REdHMexwdF0glUbcHz1b");
      let seq = this.httpService.postFormData("https://api-cn.faceplusplus.com/facepp/v3/detect",false,map).share();
      // seq.subscribe((data: any) => {
      // });
      return seq;
    }

    //比照人脸
    Compare(face_token:string,image_base64:string){
      face_token = "f21304042ccd3b6ea91a2c637ade179a";
      image_base64 = "";
      
      var map : Map<string,string>;
      map.set("app_key","IVQNF-evjN2A7QlksgR9o6CZZZiW5OsX");
      map.set("api_secret","D325_MKkIab2REdHMexwdF0glUbcHz1b");
      map.set("face_token",face_token);
      map.set("image_base64",image_base64);
      let seq = this.httpService.postFormData('https://api-cn.faceplusplus.com/facepp/v3/compare', false, map ).share();
      seq.subscribe((data: any) => {
      });
      return seq;

    }

    //搜索人脸

    //获取图片的Base64编码
    getImgBase64(){
      let base64 = "";
      let img = new Image();
      img.src = "";
      img.onload = function(){
        alert(base64);
      }
    }

    //将图片转换成Base64
    image2Base64(img:Img){
      return null;
    }





}