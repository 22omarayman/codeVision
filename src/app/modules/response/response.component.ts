import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-response',
  imports: [CommonModule],
  templateUrl: './response.component.html',
  styleUrl: './response.component.scss'
})
export class ResponseComponent {
@Input() response : { explanation: string , code: string }[] = [];

  constructor() {
    this.response.push({explanation: 'This is an example response.', code: "Hello, World!);" });
  }
}
