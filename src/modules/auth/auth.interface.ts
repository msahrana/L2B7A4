import { Role } from '../../../generated/prisma/enums';

export interface IRegisterUser {
    name: string;
    email: string;
    password: string;
    phone?: string;
    role: Role;
    profilePhoto?: string;
}
