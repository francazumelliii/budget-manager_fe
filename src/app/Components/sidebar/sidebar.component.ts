import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../../Services/database.service';
import { AuthenticationService } from '../../Services/authentication.service';
import { Menu } from '../../Interfaces/interface';
import { Router, Routes } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.sass'
})
export class SidebarComponent {

  constructor(
    private dbService: DatabaseService,
    private authService: AuthenticationService,
    private router: Router
  ){
    this.getUserInfo()
  }

  menuList: Menu[] = []
  userName: string = ""
  userSurname: string = ""

  
  getUserInfo(){
    this.userName = this.authService.userInformation.name
    this.userSurname = this.authService.userInformation.surname
    this.menuList = JSON.parse(this.authService.userInformation.menuList)
    console.log(this.menuList)
  }
  isActive(link: string): boolean {
    return this.router.isActive(link, true); 
  }

  logOut(){
    this.authService.logOut()
  }
}
