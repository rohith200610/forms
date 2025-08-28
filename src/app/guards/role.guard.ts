import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    
    // Get required role and permission from route data
    const requiredRole = route.data?.['role'];
    const requiredPermission = route.data?.['permission'];
    
    return this.authService.isAuthenticated$.pipe(
      take(1),
      map(isAuthenticated => {
        if (!isAuthenticated) {
          this.router.navigate(['/login']);
          return false;
        }

        // Check role and permission
        const hasAccess = this.authService.canAccess(requiredRole, requiredPermission);
        
        if (!hasAccess) {
          // Redirect to dashboard with error message
          this.router.navigate(['/dashboard'], {
            queryParams: { error: 'insufficient_permissions' }
          });
          return false;
        }

        return true;
      })
    );
  }
}
