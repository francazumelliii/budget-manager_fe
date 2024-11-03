import { Component, Input, OnInit } from '@angular/core';
import { Category, Project } from '../../Interfaces/interface';
import { DatabaseService } from '../../Services/database.service';

@Component({
  selector: 'app-quickaccess-modal',
  templateUrl: './quickaccess-modal.component.html',
  styleUrl: './quickaccess-modal.component.sass'
})
export class QuickaccessModalComponent implements OnInit{

  constructor(

    private dbService: DatabaseService
  ){}

  @Input() type: string = ""
  todayDate: any = new Date()
  categories: Category[] = []
  projects: Project[] = []
  frequencies:{id: any, name: string}[] = [
    {id: "S", name: "Single"},
    {id: "W", name: "Weekly"},
    {id: "M", name: "Monthly"},
    {id: "Y", name: "Annual"}
  ]
  
  
  ngOnInit(): void {
    this.type === 'expense' ? (
      this.getAllCategories() ,
      this.getAllProjects()
    ): null
  
  }

  getAllCategories(){
    this.dbService.get("/categories/all")
      .subscribe((response: Category[]) => {
        this.categories = response
      },(error: any) => {
        console.error(error)
      })
  }

  getAllProjects(){
    this.dbService.get("/account/me/projects")
      .subscribe((response:Project[]) => {
        this.projects = response
      },(error: any ) => {
        console.error(error)
      })
  }



}
