import { MiddlewareFn } from "../interfaces/Middleware";
import { AuthChecker, AuthMode } from "../interfaces";
import { IOCContainer } from "../utils/container";
export declare function AuthMiddleware(authChecker: AuthChecker<any, any>, container: IOCContainer, authMode: AuthMode, roles: any[]): MiddlewareFn;
