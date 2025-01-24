import { ApiProperty } from "@nestjs/swagger";
import { IsEmpty, IsString } from "class-validator";
export class CreateUserDto {
    @IsEmpty()
    @IsString()
    @ApiProperty()
    name: string;

    @IsEmpty()
    @IsString()
    @ApiProperty()
    email: string;

    @IsEmpty()
    @IsString()
    @ApiProperty()
    password: string;


}
