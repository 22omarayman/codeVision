import { CommonModule } from "@angular/common";
import { Component } from '@angular/core';
import { AiServiceService } from "../../../services/Ai-Service/ai-service.service";
import { FormsModule } from "@angular/forms";

@Component({
  selector: 'app-code-analyzer',
  imports: [CommonModule, FormsModule],
  templateUrl: './code-analyzer.component.html',
  styleUrl: './code-analyzer.component.scss'
})
export class CodeAnalyzerComponent {
  response: { explanation: string, code: string}[] = [];
  codeInput: string = ''; // Holds user input

  constructor(private aiService: AiServiceService) {}

  // analyzeCode() {
  //   if (!this.codeInput.trim()) {
  //     alert("Please enter some code!");
  //     return;
  //   }
  
  //   this.aiService.analyzeCode(this.codeInput).subscribe(
  //     (res) => {
  //       if (res.success) {
  //         this.response = [{
  //           explanation: res.data.message,
  //           code: res.data.code.trim(), // ✅ Ensure clean formatting
  //           language: res.data.language.trim() // ✅ Directly use from API
  //         }];
  //       }
  //     },
  //     (error) => {
  //       console.error("❌ Error from API:", error);
  //       alert("⚠️ Error: Unable to process your request.");
  //     }
  //   );
  // }
  analyzeCodeStream() {
    if (!this.codeInput.trim()) {
      alert('Please enter some code!');
      return;
    }
  
    this.response = []; // Clear previous response
  
    this.aiService.streamResponse(this.codeInput, (chunk: string) => {
      this.response = [{ explanation: chunk, code: '' }]; // Update the response dynamically
    });
  }
  
  
}
