import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsOptional, IsString, Min } from "class-validator";

export class CreateAuthDto {
    @IsEmail()
    @ApiProperty()
    email: string

    @IsString()
    // @Min(6)
    @ApiProperty()
    password: string
}

export class MailDto {
    @IsEmail()
    @ApiProperty()
    email: string
}

export class passwordDto {

    @IsString()
    // @Min(6)
    @ApiProperty()
    newPassword: string
}
