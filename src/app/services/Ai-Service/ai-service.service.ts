import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AiServiceService {
  private apiUrl = 'http://127.0.0.1:8000/code-vision/';

  // === Helper Functions (Same as Your Snippet) ===
  removeValidSubstring(target: string, text: string): string {
    for (let i = 0; i < target.length; i++) {
      const substring = target.slice(i);
      if (text.includes(substring)) {
        text = text.replace(substring, '');
      }
    }
    return text;
  }

  keepValidSubstring(target: string, text: string): string {
    for (let i = 0; i < target.length; i++) {
      const substring = target.slice(i);
      if (text.includes(substring)) {
        return substring;
      }
    }
    return '';
  }

  // We won't use isSubstring in this example, but you can add it if needed
  // isSubstring(word: string, reference: string): boolean {
  //   const regex = new RegExp(word);
  //   return regex.test(reference);
  // }

  // === The Main Streaming Logic (like your snippet) ===
  async analyzeCodeStream(
    codeInput: string,
    updateCallback: (data: { explanation: string; language: string; code: string }) => void
  ): Promise<void> {
    const response = await fetch(this.apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: codeInput }),
    });

    const reader = response.body?.getReader();
    if (!reader) throw new Error('No reader available for the response.');
    const decoder = new TextDecoder('utf-8');

    let done = false;
    let buffer = '';

    // Explanation, Language, Code
    let explanation = '';
    let language = '';
    let code = '';

    // Flags from your snippet
    let explanationStreaming = false;
    let languageStreaming = false;
    let codeStreaming = false;
    let section = '';

    while (!done) {
      // Detector variables
      let detector = false;
      let edStartDetector = false;
      let edEndDetector = false;
      let lStartDetector = false;
      let lEndDetector = false;
      let cStartDetector = false;
      let cEndDetector = false;

      const { value, done: readerDone } = await reader.read();
      done = readerDone;
      const chunk = decoder.decode(value || new Uint8Array());
      let word = chunk;
      buffer += word;

      // Same detection logic
      if (buffer.includes('<EXPLANATION_START>')) {
        edStartDetector = true;
        explanationStreaming = true;
        languageStreaming = false;
        codeStreaming = false;
        section = 'explanation';
        buffer = buffer.replace('<EXPLANATION_START>', '');
      } else if (buffer.includes('<DETECT_LANGUAGE_START>')) {
        edEndDetector = true;
        lStartDetector = true;
        languageStreaming = true;
        explanationStreaming = false;
        codeStreaming = false;
        section = 'language';
        buffer = buffer.replace('<DETECT_LANGUAGE_START>', '');
      } else if (buffer.includes('<OPTIMIZED_CODE_START>')) {
        lEndDetector = true;
        cStartDetector = true;
        codeStreaming = true;
        explanationStreaming = false;
        languageStreaming = false;
        section = 'code';
        buffer = buffer.replace('<OPTIMIZED_CODE_START>', '');
      }

      // Explanation
      if (explanationStreaming) {
        if (edStartDetector) {
          word = this.removeValidSubstring('<EXPLANATION_START>', word);
        }
        explanation += word;
      }
      // Language
      else if (languageStreaming) {
        let passedWord = word;
        if (lStartDetector) {
          passedWord = this.removeValidSubstring('<DETECT_LANGUAGE_START>', word);
        }
        if (edEndDetector) {
          const removedWord = this.keepValidSubstring('<DETECT_LANGUAGE_START>', word);
          explanation += removedWord;
          explanation = explanation.replace('<DETECT_LANGUAGE_START>', '');
        }
        language += passedWord;
      }
      // Code
      else if (codeStreaming) {
        let passedWord = word;
        if (cStartDetector) {
          passedWord = this.removeValidSubstring('<OPTIMIZED_CODE_START>', word);
        }
        if (lEndDetector) {
          const removedWord = this.keepValidSubstring('<OPTIMIZED_CODE_START>', word);
          language += removedWord;
          language = language.replace('<OPTIMIZED_CODE_START>', '');
        }
        code += passedWord;
      }

      // Live updates => call the callback
      updateCallback({
        explanation: explanation.trim(),
        language: language.trim(),
        code: code.trim(),
      });
    }

    // Streaming ended, final data is in explanation, language, code
    console.log('✅ Stream finished. Final result:', { explanation, language, code });
  }
}
