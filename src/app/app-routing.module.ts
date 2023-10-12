import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserComponent } from './user/user.component';
import { AdminComponent } from './admin/admin.component';
import { adminRoleGuard, authGuard, signedGuard } from './auth/auth.guard';

const routes: Routes = [
  { path: "user", component: UserComponent, canActivate: [authGuard] },
  { path: "admin", component: AdminComponent, canActivate: [authGuard, adminRoleGuard] },
  { path: "", component: UserComponent, canActivate: [authGuard] },
  {
    path: "",
    canActivate: [signedGuard],
    loadChildren: () => import('./auth/auth.module').then(module => module.AuthModule),
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
