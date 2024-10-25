import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateMovieDto, UpdateMovieDto } from './dtos/movie.dto';
import { S3Service } from 'src/s3/s3.service';

@Injectable()
export class MovieService {
  constructor(
    private prisma: DatabaseService,
    private readonly s3Service: S3Service,
  ) {}

  async createMovie(
    userId: number,
    createMovieDto: CreateMovieDto,
    file: Express.Multer.File,
  ) {
    let imageUrl = '';

    // Upload image if file exists
    if (file) {
      imageUrl = await this.s3Service.uploadFile(file);
    }

    return this.prisma.movie.create({
      data: {
        title: createMovieDto.title,
        publishingYear: createMovieDto.publishingYear,
        imageUrl: imageUrl,
        userId: userId,
      },
    });
  }

  async updateMovie(
    movieId: number,
    userId: number,
    updateMovieDto: UpdateMovieDto,
    file: Express.Multer.File,
  ) {
    const movie = await this.prisma.movie.findUnique({
      where: { id: movieId },
    });

    if (!movie || movie.userId !== userId) {
      throw new NotFoundException(
        'Movie not found or you are not authorized to update this movie',
      );
    }

    let imageUrl = movie.imageUrl; // Keep existing image URL if no new file is uploaded

    // Upload new image if a new file is provided
    if (file) {
      imageUrl = await this.s3Service.uploadFile(file);
    }

    return this.prisma.movie.update({
      where: { id: movieId },
      data: {
        ...updateMovieDto,
        imageUrl: imageUrl,
      },
    });
  }

  async getMovieById(movieId: number, userId: number) {
    const movie = await this.prisma.movie.findUnique({
      where: { id: movieId },
    });

    if (!movie || movie.userId !== userId) {
      throw new NotFoundException('Movie not found');
    }

    return movie;
  }

  async getAllMovies(userId: number, skip: number = 0, take: number = 10) {
    const movies = await this.prisma.movie.findMany({
      where: { userId },
      skip,
      take,
      orderBy: {
        createdAt: 'desc',
      },
    });

    const totalMovies = await this.prisma.movie.count({
      where: { userId },
    });

    return {
      data: movies,
      total: totalMovies,
      page: Math.floor(skip / take) + 1,
      pageSize: take,
    };
  }
}
