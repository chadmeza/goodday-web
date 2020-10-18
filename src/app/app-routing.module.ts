import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthenticationGuard } from './auth/authentication.guard';
import { LoginComponent } from './auth/login/login.component';
import { TasksComponent } from './tasks/tasks.component';


const routes: Routes = [
  { path: '', component: TasksComponent, canActivate: [AuthenticationGuard] },
  { path: 'login', component: LoginComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
