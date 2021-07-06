import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication-service/authentication.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

	loginForm!: FormGroup;
	
	constructor(
		private authService: AuthenticationService,
    	private router: Router,
	) 
	{ }

  
	ngOnInit(): void {
		this.loginForm = new FormGroup({
		  email: new FormControl(null, [Validators.required, Validators.email, Validators.minLength(5)]),
		  password: new FormControl(null, [Validators.required])
		})
	  }
	
	  onSubmit() {
		console.log("polo");

		  if(this.loginForm.invalid) {
			  return;
			}
		
		this.authService.login(this.loginForm.value).pipe(
		  map(token => this.router.navigate(['match']))
		).subscribe()
		
		}
	hide = true;
	getErrorMessageEmail() {
		if (this.loginForm.controls.email.hasError('required')) {
		  return 'You must enter a value';
		}
	
		return this.loginForm.controls.email.hasError('email') ? 'Not a valid email' : '';
	  }

}