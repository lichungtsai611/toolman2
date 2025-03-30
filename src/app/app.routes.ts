import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { ContactComponent } from './pages/contact/contact.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'about', component: AboutComponent },
      { path: 'contact', component: ContactComponent },
      // Lazy-loaded feature modules will be added here
      {
        path: 'tools/text',
        loadChildren: () => import('./features/text-tools/text-tools.module').then(m => m.TextToolsModule)
      },
      {
        path: 'tools/image',
        loadChildren: () => import('./features/image-tools/image-tools.module').then(m => m.ImageToolsModule)
      },
      {
        path: 'tools/convert',
        loadChildren: () => import('./features/convert-tools/convert-tools.module').then(m => m.ConvertToolsModule)
      }
    ]
  },
  // Fallback route
  { path: '**', redirectTo: '' }
];
