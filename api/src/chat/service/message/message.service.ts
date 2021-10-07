import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { MessageEntity } from 'src/chat/model/message/message.entity';
import { MessageI } from 'src/chat/model/message/message.interface';
import { RoomI } from 'src/chat/model/room/room.interface';
import { FriendRequestEntity } from 'src/friends/model/friends.entity';
import { UserEntity } from 'src/user/model/user.entity';
import { UserI } from 'src/user/model/user.interface';
import { Repository } from 'typeorm';

@Injectable()
export class MessageService {


  constructor(
    @InjectRepository(MessageEntity)
    private readonly messageRepository: Repository<MessageEntity>,
    @InjectRepository(FriendRequestEntity)
	private readonly friendRequestRepository: Repository<FriendRequestEntity>,
    @InjectRepository(UserEntity)
	private readonly userRepository: Repository<UserEntity>,
  ) { }

  async create(message: MessageI): Promise<MessageI> {
    return this.messageRepository.save(this.messageRepository.create(message));
  }

  async findMessagesForRoom(room: RoomI, user: UserI, options: IPaginationOptions): Promise<Pagination<MessageI>> {
	const blocked = await this.userRepository
		.createQueryBuilder("u")
		.leftJoin('u.sentFriendRequests', 'c')
		.leftJoin('u.receivedFriendRequests', 'r')
		.where("r.creator = :id")
		.andWhere("r.status = 'blocked'")
		.setParameters({ id : user.id })
		.getMany();

	const query = this.messageRepository
		.createQueryBuilder('message')
		.leftJoin('message.room', 'room')
		.where('room.id = :roomId', { roomId: room.id })
		.leftJoinAndSelect('message.user', 'user')
		.orderBy('message.created_at', 'DESC');

		// const query = this.messageRepository
		// .createQueryBuilder('message')
		// .leftJoin('message.room', 'room')
		// .leftJoinAndSelect('message.user', 'user')
		// .leftJoin('user.receivedFriendRequests', 'r')
		// .where('room.id = :roomId', { roomId: room.id })
		// .andWhere("r.creator = :id")
		// .andWhere("r.status = 'blocked'")
		// .setParameters({ id : user.id })
		// .orderBy('message.created_at', 'DESC');

    return paginate(query, options);

  }

}
