import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-category-icon',
  templateUrl: './category-icon.component.html',
  styleUrl: './category-icon.component.sass'
})
export class CategoryIconComponent {
  @Input() category: string = ""
  categoryClass: string = "credit-card"


  ngOnInit(): void {
    switch(this.category){
      case "Housing": this.categoryClass = "fa-house"
        break;
      case "Utilities": this.categoryClass = "fa-lightbulb"
        break;
      case "Groceries": this.categoryClass = "fa-utensils"
        break;
      case "Transportation": this.categoryClass = "fa-car-side"
        break;
      case "Health & Wellness": this.categoryClass = "fa-dumbbell"
        break;
      case "Entertainment": this.categoryClass = "fa-video"
        break;
      case "Personal Care": this.categoryClass = "fa-syringe"
        break;
      case "Education": this.categoryClass = "fa-book"
        break;
      case "Savings": this.categoryClass = "fa-piggy-bank"
        break;
      case "Extra": this.categoryClass = "fa-coins"
        break;
      default: this.categoryClass = "fa-coins"

    }
    
  }
}
