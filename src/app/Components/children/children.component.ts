import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../Services/authentication.service';
import { User } from '../../Interfaces/interface';

@Component({
  selector: 'app-children',
  templateUrl: './children.component.html',
  styleUrl: './children.component.sass'
})
export class ChildrenComponent implements OnInit{

  constructor(
    private authService: AuthenticationService
  ){

  }
  user!: User 

  ngOnInit(): void {
    this.user = this.authService.userInformation

  }
  openChildComponent(id: number){
    this.authService.redirect(`children/${id}`)
  }
}
