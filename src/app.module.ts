import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { MovieModule } from './movie/movie.module';
import { DatabaseModule } from './database/database.module';
import { S3Module } from './s3/s3.module';

@Module({
  imports: [AuthModule, MovieModule, DatabaseModule, S3Module],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
