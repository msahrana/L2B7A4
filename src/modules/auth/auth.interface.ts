import { Role } from '../../../generated/prisma/enums';

export interface IRegisterUser {
    name: string;
    email: string;
    password: string;
    phone?: string;
    role: Role;
    profilePhoto?: string;
}

export interface ILoginUser {
    email: string;
    password: string;
}

export interface IChangePassword {
    oldPassword: string;
    newPassword: string;
}
