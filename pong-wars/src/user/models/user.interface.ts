import { FriendEntity } from "src/friend/models/friend.entity";
import { RolesEntity } from "src/roles/models/roles.entity";
import { StatsEntity } from "src/stats/models/stats.entity";
import { StatusEntity } from "src/status/models/status.entity";

export interface UserI {
    id: number;
    name: string;
    password: string;
    email: string;
    avatar: string;
    stats: StatsEntity;
    friend: FriendEntity;
    status: StatusEntity;
    roles: RolesEntity;
}