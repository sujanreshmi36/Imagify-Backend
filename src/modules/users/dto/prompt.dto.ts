import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class PromptDto {
    @ApiProperty()
    @IsString()
    prompt: string;
}