import bcrypt from 'bcryptjs';
import { Role } from '../../../generated/prisma/enums';
import { prisma } from '../../lib/prisma';
import { ILoginUser, IRegisterUser } from './auth.interface';
import config from '../../config';
import { jwtUtils } from '../../utils/jwt';
import { JwtPayload, SignOptions } from 'jsonwebtoken';

const registerUserIntoDB = async (payload: IRegisterUser) => {
    const { name, email, password, profilePhoto, role } = payload;

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
            role,
            profile: {
                create: {
                    fullName: name,
                    phone: payload.phone,
                    profilePhoto,
                },
            },
        },
        include: {
            profile: true,
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

const refreshTokenIntoDB = async (refreshToken: string) => {
    const verifyRefreshToken = jwtUtils.verifyToken(
        refreshToken,
        config.JWT_REFRESH_SECRET,
    );

    if (!verifyRefreshToken) {
        throw new Error('verifyRefreshToken.errors');
    }

    const { id } = verifyRefreshToken.data as JwtPayload;

    const user = await prisma.user.findUniqueOrThrow({
        where: {
            id,
        },
    });

    if (user.status === 'BANNED') {
        throw new Error('User is BANNED !!!');
    }

    const jwtPayload = {
        id,
        name: user.name,
        email: user.email,
        role: user.role,
    };

    const accessToken = jwtUtils.createToken(
        jwtPayload,
        config.JWT_ACCESS_SECRET,
        config.JWT_ACCESS_EXPIRES_IN as SignOptions,
    );

    return { accessToken };
};

const getMyProfileIntoDB = async (userId: string) => {
    const userProfile = await prisma.user.findFirstOrThrow({
        where: { id: userId },
        omit: {
            password: true,
        },
        include: {
            profile: true,
        },
    });

    return userProfile;
};

const updateMyProfileIntoDB = async (userId: string, payload: any) => {
    const { name, email, profilePhoto, role, bio } = payload;

    const updateUser = await prisma.user.update({
        where: {
            id: userId,
        },
        data: {
            name,
            email,
            role,
            profile: {
                update: {
                    profilePhoto,
                    bio,
                },
            },
        },

        omit: {
            password: true,
        },

        include: {
            profile: true,
        },
    });

    return updateUser;
};

export const authService = {
    registerUserIntoDB,
    loginUserIntoDB,
    refreshTokenIntoDB,
    getMyProfileIntoDB,
    updateMyProfileIntoDB,
};
