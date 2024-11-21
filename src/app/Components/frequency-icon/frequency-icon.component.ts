import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-frequency-icon',
  templateUrl: './frequency-icon.component.html',
  styleUrl: './frequency-icon.component.sass'
})
export class FrequencyIconComponent {
  @Input() frequency: string = "";
  @Input() onlyText: boolean = false;
  
  frequencyString: string = "";
  ngOnInit(): void {
    switch(this.frequency){
      case "S": this.frequencyString = "Single"
        break;
      case "W": this.frequencyString = "Weekly"
        break;
      case "M": this.frequencyString = "Monthly"
        break;
      case "Y": this.frequencyString = "Annual"
    }

  }
}
