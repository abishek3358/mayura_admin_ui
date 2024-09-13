import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageLoginComponent } from './manage-login/manage-login.component';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { ManageForgotPasswordComponent } from './manage-forgot-password/manage-forgot-password.component';


const routes: Routes = [
  {
    path: 'auth/manage-login',
    component: ManageLoginComponent
  }, 
  {
    path: '/manage-forgot-password',
    component: ManageForgotPasswordComponent
  }
]

@NgModule({
  declarations: [
    // ManageLoginComponent,
    ManageForgotPasswordComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule
  ]
})
export class AuthModule { }
