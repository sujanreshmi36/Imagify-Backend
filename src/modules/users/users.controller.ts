import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Res, BadRequestException } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from '../auth/dto/update-user.dto';
import { AtGuard } from 'src/middleware/guard/At.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Response } from 'express';
import { PromptDto } from './dto/prompt.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post('generate-image')
  @UseGuards(AtGuard)
  @ApiBearerAuth('access-token')
  create(@Body() promptDto: PromptDto, @Req() req: any) {
    const id = req.user.id;

    try {
      const imageBuffer = this.usersService.create(id, promptDto);
      return imageBuffer;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get('get-info')
  @UseGuards(AtGuard)
  @ApiBearerAuth('access-token')
  findOne(@Req() req: any) {
    const id = req.user.id;
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
