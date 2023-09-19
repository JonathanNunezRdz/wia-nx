import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Post,
} from '@nestjs/common';
import { SignInDto, SignInResponse, SignUpDto } from '@wia-nx/types';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	@Get('/')
	hello() {
		return this.authService.helloWord();
	}

	@Post('signup')
	signup(@Body() dto: SignUpDto) {
		return this.authService.signUp(dto);
	}

	@HttpCode(HttpStatus.OK)
	@Post('signin')
	signin(@Body() dto: SignInDto): Promise<SignInResponse> {
		return this.authService.signIn(dto);
	}
}
