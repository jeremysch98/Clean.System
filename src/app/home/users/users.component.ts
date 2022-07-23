import { Component, OnInit } from '@angular/core';

//services
import { UsersService } from 'src/app/core/services/home/users.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  userInfo: any = [];
  constructor(private usersService: UsersService) { }

  ngOnInit(): void {
    this.GetUserInfo();
  }

  GetUserInfo() {
    const idUsuario = localStorage.getItem('id');
    this.usersService.GetById(idUsuario).subscribe(r => {
      this.userInfo = r.response;
    });
  }

}
