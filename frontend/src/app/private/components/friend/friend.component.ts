import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatSelectionList } from '@angular/material/list';
import { MatSelectionListChange } from '@angular/material/list';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { FriendRequest } from 'src/app/model/friends/friends.interface';
import { UserI } from 'src/app/model/user/user.interface';
import { AuthService } from 'src/app/public/services/auth-service/auth.service';
import { UserService } from 'src/app/public/services/user-service/user.service';
import { FriendsService } from '../../services/friends-service/friends.service';

@Component({
  selector: 'app-friend',
  templateUrl: './friend.component.html',
  styleUrls: ['./friend.component.css']
})
export class FriendComponent implements OnInit {

	blocked$: Observable<FriendRequest[]> = this.friendsService.getMyBlockedUsers();
	friends$: Observable<FriendRequest[]> = this.friendsService.getMyFriends();
	requests$: Observable<FriendRequest[]> = this.friendsService.getFriendRequests();
		constructor(
		private activatedRoute: ActivatedRoute,
		private formBuilder: FormBuilder,
		private router: Router,
		private userService: UserService,
		private authService: AuthService,
		private friendsService: FriendsService,
		) { }

  

	user : Observable<UserI>;
	imageToShow: any[];
	imageFriends: any[];
	imageRequest: any[];
	FriendsUser: UserI[] = [];
	isImageLoading : boolean;
	selectedRoom = null;
	ngOnInit(): void {
		this.authService.getUserId().pipe(
		  switchMap((idt: number) => this.userService.findOne(idt).pipe(
			tap((user) => {
				this.user = this.userService.findOne(user.id);
				let id = user.id
				this.friends$.pipe(
					tap((x) => {
						for (let index = 0; index < x.length; index++) {
							if (x[index].creator.id == id)
								this.FriendsUser.push(x[index].receiver)
							else
								this.FriendsUser.push(x[index].creator)
					}
				})).subscribe()
				})
		  ))
		).subscribe();
	  }	
	
	onSelectBlocked(event: MatSelectionListChange) {
		this.user.pipe(
			tap((x) =>{
				if (x.id == event.source.selectedOptions.selected[0].value.receiver.id)
				this.router.navigate(['../profile/' + event.source.selectedOptions.selected[0].value.creator.id], { relativeTo: this.activatedRoute });
				else
				this.router.navigate(['../profile/' + event.source.selectedOptions.selected[0].value.receiver.id], { relativeTo: this.activatedRoute });
			}
			)
		).subscribe()
	}
	onSelectFriend(event: MatSelectionListChange) {		
		this.router.navigate(['../profile/' + event.source.selectedOptions.selected[0].value.id], { relativeTo: this.activatedRoute });
	}
}
