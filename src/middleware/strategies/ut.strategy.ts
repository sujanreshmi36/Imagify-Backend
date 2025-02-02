import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';


@Injectable()
export class UtStrategy extends PassportStrategy(Strategy, 'jwt-reset') {
    constructor(
        config: ConfigService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.get<string>('UTIL_SECRET'),
            ignoreExpiration: false,
            passReqToCallback: true,
        });
    }
    async validate(req: Request, payload) {
        return payload;
    }
}