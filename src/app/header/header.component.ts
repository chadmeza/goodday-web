import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isMenuActive: boolean = false;
  userIsAuthenticated: boolean = false;

  private userStatusSubscription: Subscription;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.userIsAuthenticated = this.authService.getIsAuthenticated();

    this.userStatusSubscription = this.authService.getUserStatusListener().subscribe((isAuthenticated) => {
      this.userIsAuthenticated = isAuthenticated;
    });
  }

  onLogout() {
    this.onToggleMenu();
    this.authService.logout();
  }

  ngOnDestroy() {
    this.userStatusSubscription.unsubscribe();
  }

  onToggleMenu() {
    this.isMenuActive = !this.isMenuActive;
  }
}
