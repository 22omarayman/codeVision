import { CommonModule } from "@angular/common";
import { Component } from '@angular/core';
import { AiServiceService } from "../../../services/Ai-Service/ai-service.service";

@Component({
  selector: 'app-code-analyzer',
  imports: [CommonModule],
  templateUrl: './code-analyzer.component.html',
  styleUrl: './code-analyzer.component.scss'
})
export class CodeAnalyzerComponent {
  constructor(private aiService : AiServiceService) {
    
  }

}
