import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserI, UserStatus } from 'src/app/model/user/user.interface';
import { UserService } from 'src/app/public/services/user-service/user.service';
import { AuthService } from '../../../public/services/auth-service/auth.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {

	constructor(
		private authService: AuthService,
		private router: Router,
		private userService: UserService,
	) { }

  ngOnInit(): void {

  /*
	This pen cleverly utilizes SVG filters to create a "Morphing Text" effect. Essentially, it layers 2 text elements on top of each other, and blurs them depending on which text element should be more visible. Once the blurring is applied, both texts are fed through a threshold filter together, which produces the "gooey" effect. Check the CSS - Comment the #container rule's filter out to see how the blurring works!
*/

const elts = {
	text1: document.getElementById("text1"),
	text2: document.getElementById("text2") };
  
  
  // The strings to morph between. You can change these to anything you want!
  const texts = [
  "Goodbye",
  "Au Revoir",
  "Adios",
  "tAuf Wiedersehenhis",
  "Arrivederci",
  "Sayōnara"];
  
  
  // Controls the speed of morphing.
  const morphTime = 1.5;
  const cooldownTime = 0.4;
  
  let textIndex = texts.length - 1;
  let time: Date = new Date();  
  let morph = 0;
  let cooldown = cooldownTime;
  
  elts.text1!.textContent = texts[textIndex % texts.length];
  elts.text2!.textContent = texts[(textIndex + 1) % texts.length];
  
  
  function doMorph() {
	morph -= cooldown;
	cooldown = 0;
  
	var fraction: number = morph / morphTime;
  
	if (fraction > 1) {
	  cooldown = cooldownTime;
	  fraction = 1;
	}
  
	setMorph(fraction);
  }
  
  // A lot of the magic happens here, this is what applies the blur filter to the text.
  function setMorph(fraction:number) {
	// fraction = Math.cos(fraction * Math.PI) / -2 + .5;
  
	elts.text2!.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
	elts.text2!.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;
  
	fraction = 1 - fraction;
	elts.text1!.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
	elts.text1!.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;
  
	elts.text1!.textContent = texts[textIndex % texts.length];
	elts.text2!.textContent = texts[(textIndex + 1) % texts.length];
  }
  
  function doCooldown() {
	morph = 0;
  
	elts.text2!.style.filter = "";
	elts.text2!.style.opacity = "100%";
  
	elts.text1!.style.filter = "";
	elts.text1!.style.opacity = "0%";
  }
  
  // Animation loop, which is called every frame.
  function animate() {
	  
	  requestAnimationFrame(animate);
	  
	  let newTime: Date = new Date();
	  let shouldIncrementIndex = cooldown > 0;
	  let dt = (newTime.getTime() - time.getTime()) /400;
	  time = newTime;
	  
	  cooldown -= dt;
	  
	if (cooldown <= 0) {
	  if (shouldIncrementIndex) {
		textIndex++;
	  }
	  doMorph();
	} else {
	  doCooldown();
	}
  }
  
  // Start the animation.
  animate();
  this.userService.findOne(this.authService.getLoggedInUser().id).subscribe(
	(user: UserI) => {
	  user.status = UserStatus.OFF;
	  this.authService.logout(user).subscribe();
	});
  setTimeout(() => {
		this.router.navigate(['login']);
	}, 5000);  //5s
  }
}