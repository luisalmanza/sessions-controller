import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  if (authService.isAuthenticated()) {
    return true;
  }

  return router.navigate(['/login']);
};

export const adminRoleGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  if (localStorage.getItem("role") === "admin") {
    return true;
  }

  return router.navigate(["/"]);
};

export const signedGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  if (!authService.isAuthenticated()) {
    return true;
  }

  return router.navigate(['/admin']);
};