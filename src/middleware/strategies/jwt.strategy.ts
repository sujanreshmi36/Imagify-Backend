import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';


@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, 'jwt-access') {
    constructor(
        config: ConfigService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.get<string>('SECRET_KEY'),
            ignoreExpiration: false,
            passReqToCallback: true,
        });
    }
    async validate(req: Request, payload) {
        return payload;
    }
}