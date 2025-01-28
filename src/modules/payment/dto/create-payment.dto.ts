import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsString, IsNumber } from "class-validator";

export class CreatePaymentDto {

    @ApiProperty()
    @IsString()
    plan: string;



}
