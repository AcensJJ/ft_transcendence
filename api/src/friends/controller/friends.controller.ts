import { Body, Controller, Get, Param, Post, Put, Request, UseGuards } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtAuthGuard } from 'src/auth/login/guards/jwt.guard';
import { FriendRequest, FriendRequestStatus } from '../model/friends.interface';
import { FriendsService } from '../service/friends.service';


@Controller('friend')
export class FriendsController {

  constructor(
    private friendService: FriendsService,
  ) { }

  @UseGuards(JwtAuthGuard)
  @Post('friend-request/send/:receiverId')
  sendFriendRequest(
    @Param('receiverId') receiverStringId: string,
    @Request() req,
  ): Observable<FriendRequest | { error: string }> {
    const receiverId = parseInt(receiverStringId);	
    return this.friendService.sendFriendRequest(receiverId, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('friend-request/status/:receiverId')
  getFriendRequestStatus(
    @Param('receiverId') receiverStringId: string,
    @Request() req,
  ): Observable<FriendRequestStatus> {
    const receiverId = parseInt(receiverStringId);
    return this.friendService.getFriendRequestStatus(receiverId, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Put('friend-request/response/:friendRequestId')
  respondToFriendRequest(
    @Param('friendRequestId') friendRequestStringId: string,
    @Body() statusResponse: FriendRequestStatus,
  ): Observable<FriendRequestStatus> {
    const friendRequestId = parseInt(friendRequestStringId);
    return this.friendService.respondToFriendRequest(
      statusResponse.status,
      friendRequestId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('friend-request/block/:friendRequestId')
  blockUnblockFriendRequest(
    @Param('friendRequestId') friendRequestStringId: string,
    @Request() req
  ): Observable<FriendRequest | { error: string } | { success: string }> {
    const friendRequestId = parseInt(friendRequestStringId);
    return this.friendService.blockUnblockFriendRequest(friendRequestId, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('friend-request/me/received-requests')
  getFriendRequestsFromRecipients(
    @Request() req,
  ): Observable<FriendRequestStatus[]> {
    return this.friendService.getFriendRequestsFromRecipients(req.user);
  }
  
  @UseGuards(JwtAuthGuard)
  @Get('friend-request/me/my-friends')
  getMyFriendRequests(
    @Request() req,
  ): Promise<FriendRequestStatus[] | undefined> {
    return this.friendService.getMyFriendRequests(req.user);
  }
  
  @UseGuards(JwtAuthGuard)
  @Get('friend-request/me/my-blocked')
  getMyBlockedUsersRequests(
    @Request() req,
  ): Promise<FriendRequestStatus[] | undefined> {
    return this.friendService.getMyBlockedUsersRequests(req.user);
  }
}
