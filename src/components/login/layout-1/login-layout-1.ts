import { Component, Input } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';


@IonicPage()
@Component({
    selector: 'login-layout-1',
    templateUrl: 'login.html'
})
export class LoginLayout1 {
  @Input() data: any;
  @Input() events: any;

  public username: string;
  public password: string;

  constructor(public navCtrl: NavController) {}

  onEvent = (event: string): void => {
    if (this.events[event]) {
        this.events[event]({
            'username' : this.username,
            'password' : this.password
        });
    }
  }

  goToRegisterPage() {
    this.navCtrl.push('RegisterPage')
  }
}
