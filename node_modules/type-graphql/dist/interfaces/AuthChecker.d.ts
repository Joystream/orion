import { ClassType } from "./ClassType";
import { ResolverData } from "./ResolverData";
export declare type AuthCheckerFn<TContextType = {}, TRoleType = string> = (resolverData: ResolverData<TContextType>, roles: TRoleType[]) => boolean | Promise<boolean>;
export declare type AuthCheckerInterface<TContextType = {}, TRoleType = string> = {
    check(resolverData: ResolverData<TContextType>, roles: TRoleType[]): boolean | Promise<boolean>;
};
export declare type AuthChecker<TContextType = {}, TRoleType = string> = AuthCheckerFn<TContextType, TRoleType> | ClassType<AuthCheckerInterface<TContextType, TRoleType>>;
export declare type AuthMode = "error" | "null";
