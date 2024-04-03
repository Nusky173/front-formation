import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'front-formation';

  constructor(private router: Router) {}


  _goToUser() {
    this.router.navigateByUrl("/user")
  }

  _goToMessage() {
    this.router.navigateByUrl("/message")
  }

  _goToTag() {
    this.router.navigateByUrl("/tag")
  }
}


