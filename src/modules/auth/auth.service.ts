import bcrypt from 'bcryptjs';
import { Role } from '../../../generated/prisma/enums';
import { prisma } from '../../lib/prisma';
import { ILoginUser, IRegisterUser } from './auth.interface';
import config from '../../config';
import { jwtUtils } from '../../utils/jwt';
import { SignOptions } from 'jsonwebtoken';

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

const loginUserIntoDB = async (payload: ILoginUser) => {
    const { email, password } = payload;

    const user = await prisma.user.findUniqueOrThrow({
        where: { email },
    });

    if (user.status === 'BANNED') {
        throw new Error(
            'Your account has been BANNED. Please contact support.',
        );
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
        throw new Error('Password not matched!');
    }

    const jwtPayload = {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
    };

    const accessToken = jwtUtils.createToken(
        jwtPayload,
        config.JWT_ACCESS_SECRET,
        config.JWT_ACCESS_EXPIRES_IN as SignOptions,
    );

    const refreshToken = jwtUtils.createToken(
        jwtPayload,
        config.JWT_REFRESH_SECRET,
        config.JWT_REFRESH_EXPIRES_IN as SignOptions,
    );

    return { user, accessToken, refreshToken };
};

export const authService = { registerUserIntoDB, loginUserIntoDB };
