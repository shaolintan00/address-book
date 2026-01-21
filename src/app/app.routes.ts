import { Routes } from '@angular/router';
import { ContactCreatePage } from './components/create/contact-create.page';
import { ContactEditPage } from './components/update-del/contact-edit.page';
import { HomePage } from './components/home/home.page';

export const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: 'home' },
    { path: 'home', component: HomePage },
    { path: 'create', component: ContactCreatePage },
    { path: 'edit/:id', component: ContactEditPage },
    { path: '**', redirectTo: 'home' }
];
