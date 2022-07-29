import { CreateImageDto } from './dto/create-image.dto';
import { FileService } from './file.service';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Res,
  StreamableFile,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { createReadStream } from 'fs';
import { join } from 'path';
import { Response } from 'express';
import { LocalFilesInterceptor } from 'src/globals/interceptors';
import { File } from 'src/globals/types';

@ApiTags('file')
@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Get('all')
  async getAllImages() {
    return await this.fileService.getAllImages();
  }

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        author: {
          type: 'string',
        },
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @Post('/upload')
  @UseInterceptors(
    LocalFilesInterceptor({
      fieldName: 'file',
      path: '/images',
      fileFilter: (request, file, callback) => {
        if (!file.mimetype.includes('image')) {
          return callback(
            new BadRequestException('Provide a valid image'),
            false,
          );
        }
        callback(null, true);
      },
      limits: {
        fileSize: 1e7,
      },
    }),
  )
  async createImage(@Body() body: CreateImageDto, @UploadedFile() file: File) {
    if (file) {
      return this.fileService.createImage(body, {
        path: file.path,
        filename: file.originalname,
        mimetype: file.mimetype,
      });
    } else {
      return this.fileService.createImage(body);
    }
  }

  @Get(':id')
  async getDatabaseFileById(
    @Param('id') id: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    const file = await this.fileService.getFileById(id);
    const stream = createReadStream(join(process.cwd(), file.path));
    response.set({
      'Content-Disposition': `inline; filename="${file._id}"`,
      'Content-Type': file.mimetype,
    });
    return new StreamableFile(stream);
  }
}
