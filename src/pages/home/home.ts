import { Component } from '@angular/core';
//import { NavController } from 'ionic-angular';
//import {Http} from '@angular/http';
//import 'rxjs/add/operator/map';
//import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { ApiSetting } from '../../services/api_setting/api_setting';
import { RestApi } from '../../services/rest_api/rest_api';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
    
    top_headlines: any;
    everything: any;
    page = 1;
    page_size = 10;
    country_id = 'in';
    api_key = '';
    api_url = "";
    url = '';
    
    //apiObj.setNewsType("top-headlines");
    
    news_type = window.localStorage.news_type;
    //news_type = "everything";//apiObj.getNewsType();
    
    constructor(private iab: InAppBrowser, private apiObj: ApiSetting, private restObj: RestApi, private spinnerService: Ng4LoadingSpinnerService) {
        this.spinnerService.show();

        this.api_key = this.apiObj.getApiKey();
        this.api_url = this.apiObj.getApiUrl();
        

        this.url = this.api_url+'/everything?sources=the-times-of-india&apiKey='+this.api_key+'&pageSize='+this.page_size+'&page='+this.page;
console.log(this.url);
        this.restObj.callApi(this.url).then((data) => {
            if(data.status == "ok") { 
                if(data.articles.length > 0) {
                    this.everything = data.articles;  
                    this.spinnerService.hide();   
                }
            }
        })
        
        /*//get the top 5 headlines
        this.url = this.api_url+'/'+this.news_type+'?language=en&country=in&&apiKey='+this.api_key+'&pageSize='+this.page_size+'&page='+this.page;
console.log(this.url);
        this.restObj.callApi(this.url).then((data) => {
            if(data.status == "ok") { 
                if(data.articles.length > 0) {
                    this.top_headlines = data.articles;  

this.url = this.api_url+'/everything?sources=the-times-of-india&apiKey='+this.api_key+'&pageSize='+this.page_size+'&page='+this.page;
console.log(this.url);
                    this.restObj.callApi(this.url).then((data) => {
                        if(data.status == "ok") { 
                            if(data.articles.length > 0) {
                                this.everything = data.articles;  
                                this.spinnerService.hide();   
                            }
                        }
                    })               
                }
            }
        })*/


        /*//this.getUsers('top_headlines');

        //get the top 5 headlines
        this.url = this.api_url+'/everything?sources=the-times-of-india&apiKey='+this.api_key+'&pageSize='+this.page_size+'&page='+this.page;
        this.getUsers('everything');*/
    } 

    getUsers(news_type) {
        this.restObj.callApi(this.url).then((data) => {
            if(data.status == "ok") {
                if(data.articles.length > 0) {
                    if(news_type == "top_headlines") {
                        this.top_headlines = data.articles;
                    } else {
                        this.everything = data.articles;
                    }                    
                }
            }
        })
    }

    doInfinite(infiniteScroll) {
        this.page = this.page+1;
        setTimeout(() => {
            this.url = this.api_url+'/everything?sources=the-times-of-india'+'&apiKey='+this.api_key+'&pageSize='+this.page_size+'&page='+this.page;
            console.log(this.url);
            //this.url = this.api_url+'/everything?sources=the-times-of-india&apiKey='+this.api_key+'&pageSize='+this.page_size+'&page='+this.page;
            this.restObj.callApi(this.url).then((data) => {
                if(data.status == "ok") {
                    if(data.articles.length > 0) {
                        for(let i=0; i<data.articles.length; i++) {
                            this.everything.push(data.articles[i]);
                        }
                    }  
                }                
            })
          infiniteScroll.complete();
        }, 1000);
    }

    goTo(url: string) {
        /*const options: InAppBrowserOptions = {
            location: 'no',
            hidden: 'yes',
            clearcache: 'no',
            clearsessioncache: 'no',
            hardwareback: 'yes',
            zoom: 'no'
        }
        //const browser = 
        this.iab.create(url, "_self", options);*/
        this.iab.create(url);
    }
}