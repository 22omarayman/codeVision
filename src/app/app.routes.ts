import { Routes } from '@angular/router';
import { CodeAnalyzerComponent } from './modules/code-analyzer/code-analyzer/code-analyzer.component';
import { AnalyzerComponent } from './modules/analyzer/analyzer.component';

export const routes: Routes = [
    {
        path: '',
        component: AnalyzerComponent
    }
];
