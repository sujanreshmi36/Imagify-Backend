import { BadRequestException, ConflictException, ForbiddenException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { hash } from 'src/helper/utils/hash';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/model/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDTO } from './dto/login';
import { Token } from 'src/helper/utils/token';
import { MailDto, passwordDto } from './dto/create-auth.dto';
import { sendMail } from 'src/config/mail.config';
import { JwtPayload } from 'src/helper/types/indexType';

Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private hash: hash,
    private token: Token
  ) { }
  //register
  async create(signupDTO: CreateUserDto) {
    try {

      const existingUser = await this.userRepo.findOne({ where: { email: signupDTO.email } });

      if (existingUser) {
        throw new ConflictException('Email address is already in use');
      }
      const hashedPassword = await this.hash.value(signupDTO.password);
      const user = new User();
      user.email = signupDTO.email;
      user.password = hashedPassword;
      user.name = signupDTO.name;
      const savedUser = await this.userRepo.save(user);
      return {
        message: "Registered Successfully.",
        success: true,
        data: savedUser
      }

    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }




  // login
  async login(loginDto: LoginDTO) {
    try {
      const user = await this.userRepo.findOne({
        where: { email: loginDto.email }
      });
      if (!user) {
        throw new NotFoundException("User doesn't exist");
      } else {
        const passwordMatched = await this.hash.verifyHashing(user.password, loginDto.password);
        if (!passwordMatched) {
          throw new ForbiddenException("Invalid email or password")
        }

        const access_token = await this.token.generateAcessToken({ id: user.id, email: user.email })
        return { message: "Logged in successfully.", token: access_token, user: user.name, status: true }
      }

    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  // forgotpassword
  // async forgot(email: string) {
  //   try {
  //     const user = await this.userRepo.findOne({ where: { email: email } });
  //     if (!user) {
  //       throw new NotFoundException("User not found.");
  //     } else {
  //       //generating token
  //       const passkey = this.config.get<string>('PASS_KEY');
  //       const frontURL = this.config.get<string>('frontURL');
  //       const token = jwt.sign({ email }, passkey, {
  //         expiresIn: '1d'
  //       });
  //       const url = `${frontURL}/auth/reset-password/${token}`;
  //       const sendMail = await this.mailerService.sendMail({
  //         to: email,
  //         subject: 'Reset your password',
  //         text: `To reset your password, click on the following link: ${url}`,
  //       });
  //       if (!sendMail) {
  //         throw new HttpException("couldnot send mail", HttpStatus.EXPECTATION_FAILED);
  //       } else {
  //         return "verification mail has been sent";
  //       }
  //     }
  //   } catch (e) {
  //     throw new BadRequestException(e.message);
  //   }

  // }

  async forgotPassword(body: MailDto): Promise<boolean> {
    const existingUser = await this.userRepo.findOne({
      where: { email: body.email },
    });
    if (!existingUser) {
      throw new NotFoundException("Email doesn't exist.");
    }
    const token = await this.token.generateUtilToken({
      id: existingUser.id,
      email: existingUser.email,
    });
    const frontURL = `${process.env.frontURL}?token=${token}`;
    try {
      sendMail(body.email, 'Password Reset', this.passwordTemplate(frontURL));
    } catch (error) {
      throw error;

    }
    return true;
  }

  async updatePassword(user: JwtPayload, passwordDto: passwordDto) {
    const { newPassword } = passwordDto;
    const authUser = await this.userRepo.findOne({ where: { id: user.id } });
    if (authUser) {
      const hash = await this.hash.value(newPassword);
      await this.userRepo.update({ id: authUser.id }, { password: hash });
      return true;
    } else {
      throw new BadRequestException("user not found");
    }
  }


  passwordTemplate(resetUrl: any) {
    return `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Password</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 20px;
        }
        .container {
            max-width: 500px;
            margin: 0 auto;
            background-color: #fff;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            text-align: center;
        }
        h1 {
            color: #333;
            margin-bottom: 20px;
        }
        p {
            font-size: 16px;
            color: #555;
            margin-bottom: 30px;
        }
        .button {
            display: inline-block;
            width: 80%;
            padding: 12px;
            background-color: #007BFF;
            color: white;
            text-align: center;
            border-radius: 5px;
            font-size: 16px;
            text-decoration: none;
            cursor: pointer;
            transition: background-color 0.3s;
        }
        .button:hover {
            background-color: #0056b3;
        }
        .footer {
            margin-top: 20px;
            font-size: 14px;
            color: #777;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Password Reset Request</h1>
        <p>Hello, User</p>
        <p>You've requested to reset your password for your Imagify account. Click the link below to set a new password:</p>
        <a href="${resetUrl}" class="button" style="color: white; text-decoration: none;">Reset My Password</a>
        <p>If you didn't request this, please ignore this email.</p>
        <p class="footer">© 2025 Imagify. All rights reserved.</p>
    </div>
</body>
</html>
  `;
  }

  // // reset-password
  // async reset(newPassword: string, token: string) {
  //   try {
  //     if (!token) {
  //       throw new NotFoundException("Token not found");
  //     } else {
  //       token = token.split(' ')[1];
  //       const passkey = this.config.get<string>('PASS_KEY');
  //       let decodedToken;
  //       decodedToken = jwt.verify(token, passkey)
  //       if (!decodedToken) {
  //         return ({ message: "Token verification failed" });
  //       } else {
  //         const { email } = decodedToken;
  //         const salt = 10;
  //         const hashedPassword = await newPassword.hash(newPassword, salt);
  //         const user = await this.userRepo.findOne({ where: { email: email } });
  //         user.password = hashedPassword;
  //         return {
  //           data: await this.userRepo.save(user),
  //           message: "Password changed successfully"
  //         }
  //       }
  //     }
  //   } catch (e) {
  //     throw new BadRequestException(e.message);
  //   }

  // }
}