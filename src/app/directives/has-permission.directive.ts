import { Directive, Input, TemplateRef, ViewContainerRef, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[appHasPermission]',
  standalone: true
})
export class HasPermissionDirective implements OnInit, OnDestroy {
  private subscription: Subscription = new Subscription();
  private hasView = false;

  @Input() set appHasPermission(permission: string) {
    this.checkPermission(permission);
  }

  @Input() set appHasPermissionRole(role: string) {
    this.checkRole(role);
  }

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // Subscribe to authentication changes
    this.subscription.add(
      this.authService.isAuthenticated$.subscribe(() => {
        this.updateView();
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private checkPermission(permission: string) {
    const hasPermission = this.authService.hasPermission(permission);
    this.updateView(hasPermission);
  }

  private checkRole(role: string) {
    const hasRole = this.authService.hasRole(role);
    this.updateView(hasRole);
  }

  private updateView(condition: boolean = true) {
    if (condition && !this.hasView) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    } else if (!condition && this.hasView) {
      this.viewContainer.clear();
      this.hasView = false;
    }
  }
}
