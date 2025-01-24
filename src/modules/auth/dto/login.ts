import { ApiProperty } from "@nestjs/swagger";
import { IsEmpty, IsString } from "class-validator";

export class LoginDTO {
    @IsEmpty()
    @IsString()
    @ApiProperty()
    email: string;

    @IsEmpty()
    @IsString()
    @ApiProperty()
    password: string;
}