import { UserEntity } from "src/user/models/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, } from "typeorm";

export enum Status {
	blocked = 'blocked',
	accepted = 'accepted',
	pending = 'pending',
  }
  
  @Entity({ name: 'user_followers' })
  export class FriendEntity {
	@PrimaryGeneratedColumn()
	id: number;
  
	@Column({ type: 'number' })
	// tslint:disable-next-line: variable-name
	following_id: number;
  
	@Column({ type: 'number' })
	// tslint:disable-next-line: variable-name
	follower_id: number;
  
	@ManyToOne(
	  () => UserEntity,
	  (u: UserEntity) => u.followers,
	)
	@JoinColumn({ name: 'follower_id' })
	followers: UserEntity;
  
	@ManyToOne(
	  type => UserEntity,
	  (u: UserEntity) => u.following,
	)
	@JoinColumn({ name: 'following_id' })
	following: UserEntity;
  
	@Column({ enum: Status, type: 'enum', default: Status.pending })
	status: Status;
  }