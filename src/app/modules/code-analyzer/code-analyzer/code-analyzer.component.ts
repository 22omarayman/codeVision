import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import { AiServiceService } from '../../../services/Ai-Service/ai-service.service';
import { AlertDialogComponent } from '../../alert-dialog/alert-dialog/alert-dialog.component';
@Component({
  selector: 'app-code-analyzer',
  imports: [CommonModule, FormsModule],
  templateUrl: './code-analyzer.component.html',
  styleUrl: './code-analyzer.component.scss'
})
export class CodeAnalyzerComponent {
  response: { explanation: string; code: string; language: string }[] = [];
  codeInput: string = ''; // Holds user input

  constructor(
    private aiService: AiServiceService,
    private dialog: MatDialog  // Inject MatDialog
  ) {}

  analyzeCode() {
    // 1) Check if code is empty => open dialog
    if (!this.codeInput.trim()) {
      this.openAlertDialog(
        'No Code Entered',
        'Please enter some code before analyzing.'
      );
      return;
    }

    // 2) Example: Check if code is invalid => open dialog
    if (this.isInvalidCode(this.codeInput)) {
      this.openAlertDialog(
        'Invalid Code',
        'The code you provided seems invalid. Please fix any syntax issues.'
      );
      return;
    }

    // 3) If valid, start streaming logic
    this.response = [{
      explanation: 'Loading explanation...',
      language: 'Detecting language...',
      code: 'Loading optimized code...',
    }];

    this.aiService.analyzeCodeStream(this.codeInput, (data) => {
      // Update the UI in real time
      this.response = [data];

      // **Auto-scroll** after UI update
      setTimeout(() => {
        const container = document.getElementById('scrollable');
        if (container) {
          container.scrollTop = container.scrollHeight;
        }
      }, 0);
    });
  }

  // Example validation (replace with your real logic)
  private isInvalidCode(code: string): boolean {
    // Example: if code doesn't have curly braces, treat as invalid
    return !code.includes('{') || !code.includes('}');
  }

  // 4) Helper to open the AlertDialog with custom title & message
  private openAlertDialog(title: string, message: string): void {
    this.dialog.open(AlertDialogComponent, {
      data: { title, message },
      width: '400px'
    });
  }
}
