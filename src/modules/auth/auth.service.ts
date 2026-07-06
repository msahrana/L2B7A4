import bcrypt from 'bcryptjs';
import { Role } from '../../../generated/prisma/enums';
import { prisma } from '../../lib/prisma';
import { IRegisterUser } from './auth.interface';
import config from '../../config';

const registerUserIntoDB = async (payload: IRegisterUser) => {
    const { name, email, password, phone, profilePhoto, role } = payload;

    // Check existing user
    const isUserExist = await prisma.user.findUnique({
        where: {
            email,
        },
    });

    if (isUserExist) {
        throw new Error('User already exists.');
    }

    // Prevent admin registration
    if (role === Role.ADMIN) {
        throw new Error('You cannot register as ADMIN.');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(
        password,
        Number(config.BCRYPT_SALT_ROUNDS),
    );

    const createUser = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            phone,
            role,
            profile: {
                create: {
                    profilePhoto,
                },
            },
        },
    });

    const newUser = await prisma.user.findUnique({
        where: {
            id: createUser.id,
            email: createUser.email || email,
        },
        omit: {
            password: true,
        },
        include: {
            profile: true,
        },
    });

    return newUser;
};

export const authService = { registerUserIntoDB };
