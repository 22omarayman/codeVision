import { Component } from '@angular/core';
import { CodeAnalyzerComponent } from '../code-analyzer/code-analyzer/code-analyzer.component';
import { ResponseComponent } from '../response/response.component';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-analyzer',
  imports: [CodeAnalyzerComponent,ResponseComponent,CommonModule],
  templateUrl: './analyzer.component.html',
  styleUrl: './analyzer.component.scss'
})
export class AnalyzerComponent {
  response: { explanation: string, code: string }[] = [];

  constructor() {
    this.response.push({ explanation: 'This is an example response.', code: "Hello, World!);" });
  }
}
