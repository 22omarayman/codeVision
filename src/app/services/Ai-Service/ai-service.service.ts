import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AiServiceService {
  private apiUrl = 'http://127.0.0.1:8000/code-vision/'; // Backend API URL

  constructor(private http: HttpClient) {}

  analyzeCode(code: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    const requestBody = { message: code };

    return this.http.post(this.apiUrl, requestBody, { headers });
  }

  async streamResponse(userInput: string, callback: (chunk: string) => void): Promise<void> {
    if (!userInput.trim()) {
      alert('Please enter a message!');
      return;
    }

    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userInput }),
      });

      if (!response.body) {
        throw new Error('No response body available.');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullText = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        
        const text = decoder.decode(value);
        fullText += text;

        // Use callback to update UI live
        callback(fullText);
      }
    } catch (error) {
      console.error('Streaming Error:', error);
      alert('Error fetching stream response. Please try again.');
    }
  }
}
