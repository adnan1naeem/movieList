import { Injectable, BadRequestException, NotFoundException, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { SignupDto, SigninDto } from './dtos/auth.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private prisma: DatabaseService, private jwtService: JwtService) {}

  async signup(signupDto: SignupDto) {
    try {
      const hashedPassword = await bcrypt.hash(signupDto.password, 10);
      const user = await this.prisma.user.create({
        data: {
          email: signupDto.email,
          password: hashedPassword,
        },
      });
      return { id: user.id, email: user.email };
    } catch (error) {
      if (error.code === 'P2002') {
        throw new BadRequestException('Email already in use');
      }
      throw new InternalServerErrorException('Failed to create user');
    }
  }

  async signin(signinDto: SigninDto) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email: signinDto.email },
      });

      if (!user) {
        throw new BadRequestException('Invalid email');
      }

      const isPasswordValid = await bcrypt.compare(signinDto.password, user.password);
      if (!isPasswordValid) {
        throw new BadRequestException('Invalid password');
      }

      const payload = { email: user.email, id: user.id };
      return {
        ...payload,
        access_token: this.jwtService.sign(payload, { secret: process.env.JWT_SECRET }),
      };
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to sign in');
    }
  }

  async getUserById(id: number) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
      });
      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      return user;
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch user');
    }
  }
}
