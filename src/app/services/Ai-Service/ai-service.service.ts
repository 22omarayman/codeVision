import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AiServiceService {
  private apiUrl = 'http://127.0.0.1:8000/code-vision/';

  constructor(private http: HttpClient) {}

  analyzeCode(code: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    // ✅ Escape JSON properly to handle newlines and special characters
    const escapedCode = JSON.stringify(code).slice(1, -1); // Removes extra quotes from JSON.stringify
    const requestBody = {
      message: escapedCode
    };

    console.log("📤 Sending Properly Escaped Request:", requestBody);

    return this.http.post(this.apiUrl, requestBody, { headers });
  }
}
