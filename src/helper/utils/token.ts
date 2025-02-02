import { JwtService } from "@nestjs/jwt";
import { Injectable } from "@nestjs/common";
import { JwtPayload } from "../types/indexType";
require('dotenv').config();

@Injectable()
export class Token {
    constructor(
        private jwtService: JwtService,
    ) { }
    async generateAcessToken(jwtPayload: JwtPayload) {
        const expirationTimeInSeconds = '1d';
        const token = await this.jwtService.signAsync(jwtPayload, {
            secret: process.env.SECRET_KEY,
            expiresIn: expirationTimeInSeconds,
        });
        return token;
    }

    async generateUtilToken(jwtPayload: JwtPayload) {
        const expirationTimeInSeconds = '10m';
        const token = await this.jwtService.signAsync(jwtPayload, {
            secret: process.env.UTIL_SECRET,
            expiresIn: expirationTimeInSeconds,
        });
        return token;

    }
}