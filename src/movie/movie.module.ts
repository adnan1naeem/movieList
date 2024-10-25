import { Module } from '@nestjs/common';
import { MovieService } from './movie.service';
import { MovieController } from './movie.controller';
import { DatabaseService } from '../database/database.service';
import { S3Service } from 'src/s3/s3.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [],
  controllers: [MovieController],
  providers: [MovieService, DatabaseService, S3Service, JwtService],
})
export class MovieModule {}
