import { Injectable } from '@angular/core';


@Injectable()
export class ShareProvider {

  //splitpaneviewnav:any = {}
  //connection:any = {};
  //session:any = {};
  //user:any = {};

  curentpage:string = '';

  server: string = '';

  sessionid: string = '';
  role: string = '';

  username: string = '';
  firstname: string = '';
  lastname: string = '';

  constructor() {
  	this.curentpage = 'StarterPage';

    this.server = "https://lama.tierrasky.com/backend/";
    //this.connection.headers = new Headers({ 'Content-Type': 'application/json' });

    this.sessionid = "";
    this.role = "member";

    this.username = "";
    this.firstname = "";
    this.lastname = "";
  }

}
