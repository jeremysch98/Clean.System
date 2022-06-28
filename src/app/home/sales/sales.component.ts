import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.css']
})
export class SalesComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.ValidateRedirect();
  }

  ValidateRedirect() {
    if (localStorage.getItem('id') == null) {
      this.router.navigate(["auth/login"]);
    }
  }

}
