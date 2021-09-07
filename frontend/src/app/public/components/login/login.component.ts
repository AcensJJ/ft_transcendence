import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth-service/auth.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import {MatSnackBar} from '@angular/material/snack-bar';
import { LoginResponseI } from 'src/app/model/auth/login-response.interface';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{
	
	constructor(
		private authService: AuthService,
		private router: Router,
		private _snackBar: MatSnackBar,
	) { }

	ngOnInit() {    
		if (this.authService.isAuthenticated()) {
			this.router.navigate(['../../private/profile']);
			this._snackBar.open('You are logged', 'Close', {
				duration: 3000,
			});
		}
	}

loginForm: FormGroup = new FormGroup({
	email: new FormControl(null, [Validators.required, Validators.email]),
	password: new FormControl(null, [Validators.required])
  });
	
	onSubmit() {
		if (this.loginForm.valid) {
			this.authService.login({
			  email: this.loginForm.get('email').value,
			  password: this.loginForm.get('password').value
			}).pipe(
				tap((res: LoginResponseI)=> {
					if (res.two_factor) this.router.navigate(['../../public/two-factor']);
					else this.router.navigate(['../../private/profile'])
				})
			).subscribe()
		  }
		}
	hide = true;
	getErrorMessageEmail() {
		if (this.loginForm.controls.email.hasError('required')) {
		  return 'You must enter a value';
		}
	
		return this.loginForm.controls.email.hasError('email') ? 'Not a valid email' : '';
	  }
	
}
