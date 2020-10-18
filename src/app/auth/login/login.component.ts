import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  isLoading: boolean = false;
  userStatusSubscription: Subscription;

  constructor(public authService: AuthService) { }

  ngOnInit() {
    this.userStatusSubscription = this.authService.getUserStatusListener().subscribe(response => {
      this.isLoading = false;
    });
  }

  onLogin(form: NgForm) {
    if (form.invalid) {
      return;
    }
    
    this.isLoading = true;
    this.authService.login(form.value.email, form.value.password);
  }

  ngOnDestroy() {
    this.userStatusSubscription.unsubscribe();
  }
}
