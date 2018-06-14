import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, Event as NavigationEvent } from "@angular/router";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  mybool:boolean;
  title = 'MYAPP';
  constructor( private router: Router ) { }

  ngOnInit() {
    this.router.events.forEach((event: NavigationEvent) => {
      //After Navigation
      if (event instanceof NavigationEnd) {
        switch (event.url) {
        case "/":
        {
          this.mybool=true;
          break;
        }
        case "/login":
        {
          this.mybool=true;
          break;
        }
        case "/signup":
        {
          this.mybool=true;
          break;
        }
        case "/signin":
        {
          this.mybool=true;
          break;
        }
        default:
          this.mybool=false;
        }
      }
    })
  }

  logout() {
    localStorage.removeItem('jwtToken');
    this.router.navigate(['signin']);
  }

}
