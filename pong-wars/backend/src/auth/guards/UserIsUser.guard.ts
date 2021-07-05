import { Injectable, CanActivate, Inject, forwardRef, ExecutionContext } from "@nestjs/common";
import { Observable } from "rxjs";
import { User, UserService } from "src/user/service/user.service";
import { map } from "rxjs/operators";

@Injectable()
export class UserIsUserGuard implements CanActivate{

    constructor(
        @Inject(forwardRef(() => UserService))
        private userService: UserService
    ) {

    }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();

        const params = request.params;
        const user: User = request.user;

        return this.userService.findOne(user.id).pipe(
            map((user: User) => {
                let hasPermission = false;
                
                if(user.id === Number(params.id)) {
                    hasPermission = true;
                }

                return user && hasPermission;                
            })
        )
    }


}

@Injectable()
export class UserIsNotUserGuard implements CanActivate{

    constructor(
        @Inject(forwardRef(() => UserService))
        private userService: UserService
    ) {

    }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();

        const params = request.params;
        const user: User = request.user;

        return this.userService.findOne(user.id).pipe(
            map((user: User) => {
                let hasPermission = false;
				hasPermission = true;
                
                if(user.id === Number(params.id)) {
                    hasPermission = false;
                }

                return user && hasPermission;                
            })
        )
    }


}