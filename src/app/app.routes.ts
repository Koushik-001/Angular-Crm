import { Routes } from '@angular/router';
import { LoginPageComponent } from '../login-page/login-page.component';
import { FeedbackPageComponent } from '../feedback-page/feedback-page.component';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    {path:'login',component:LoginPageComponent},
    {path:'feedback',component:FeedbackPageComponent},
];
