import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { Prisma, User } from '@prisma/client';
import { hash, verify } from 'argon2';

import { SignInDto, SignUpDto } from '@wia-nx/types';
import { createUserImage } from '../../utils';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
	constructor(
		private prisma: PrismaService,
		private jwt: JwtService,
		private config: ConfigService
	) {}

	helloWord() {
		return { message: 'Hello World' };
	}

	async signUp(dto: SignUpDto) {
		const { lastName, firstName, alias, email, password, secret, uid } =
			dto;

		const ENV_SECRET = this.config.get<string>('SIGN_UP_KEY');
		if (typeof ENV_SECRET === 'undefined')
			throw new ForbiddenException('not authorized');

		const valid = await verify(ENV_SECRET, secret);
		if (!valid) {
			throw new ForbiddenException('incorrect credentials');
		}
		const hashedPassword = await hash(password);
		const createImage = createUserImage(dto);

		try {
			const user = await this.prisma.user.create({
				data: {
					alias,
					firstName,
					lastName,
					email,
					uid,
					hash: hashedPassword,
					image: createImage,
				},
				include: {
					image: {
						include: {
							image: {
								select: {
									id: true,
									format: true,
								},
							},
						},
					},
				},
			});

			return this.signToken(user.id, user.email);
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				if (error.code === 'P2002')
					throw new ForbiddenException('credentials already in use');
			}
			throw error;
		}
	}

	async signIn(dto: SignInDto) {
		const user = await this.prisma.user.findUnique({
			where: {
				email: dto.email,
			},
		});
		if (!user) throw new ForbiddenException('incorrect credentials');

		const valid = await verify(user.hash, dto.password);
		if (!valid) throw new ForbiddenException('incorrect credentials');

		return this.signToken(user.id, user.email);
	}

	async signToken(
		userId: User['id'],
		email: string
	): Promise<{ accessToken: string }> {
		const payload = {
			sub: userId,
			email,
		};

		const secret = this.config.get<string>('JWT_SECRET');
		const token = await this.jwt.signAsync(payload, {
			expiresIn: '30d',
			secret,
		});

		return {
			accessToken: token,
		};
	}
}
