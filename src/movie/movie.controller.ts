import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { MovieService } from './movie.service';
import { CreateMovieDto, UpdateMovieDto } from './dtos/movie.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';

@Controller('movies')
@UseGuards(JwtAuthGuard)
export class MovieController {
  constructor(private movieService: MovieService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  createMovie(
    @Body() createMovieDto: CreateMovieDto,
    @Request() req,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.movieService.createMovie(req.user.id, createMovieDto, file);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  updateMovie(
    @Param('id') movieId: number,
    @Body() updateMovieDto: UpdateMovieDto,
    @Request() req,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.movieService.updateMovie(
      +movieId,
      req.user.id,
      updateMovieDto,
      file,
    );
  }

  @Get()
  getAllMovies(
    @Request() req,
    @Query('skip') skip = '0',
    @Query('take') take = '10',
  ) {
    return this.movieService.getAllMovies(
      req.user.id,
      parseInt(skip),
      parseInt(take),
    );
  }
}
