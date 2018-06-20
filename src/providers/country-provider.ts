import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class CountryProvider {
    _selectCountry: any;
    allCountries:any[];
    countryHots: any;

    constructor(private translateService: TranslateService ) { 
        // this.translateService.instant.get(['COUNTRY_REAGION']).subscribe((values)=>{
        //     this.allCountries = values.COUNTRY_REAGION;
        // }); 
        this.allCountries = this.translateService.instant('COUNTRY_REAGION');
        this.countryHots = this.translateService.instant('COUNTRY_REAGION_HOT');
    }

    all() {
        return this.allCountries;
    }
    getHots() {
        return this.countryHots
    }
    query(keyword) {
        return this.allCountries.filter((item)=>{
            return item.name.toUpperCase().indexOf(keyword.toUpperCase())>=0 || item.code.toUpperCase().indexOf(keyword.toUpperCase())>=0 || item.number.indexOf(keyword)>=0;
        });
    }
    // getByPhoneCode(phonecode: String) {
    //     return this.allCountries.find(item=> item.phoneCode == phonecode);
    getCurrentCountry(){
        return this._selectCountry;
    }
    setCurrentCountry(value){
        this._selectCountry = value;
    }
}


