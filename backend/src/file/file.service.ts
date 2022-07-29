import { CreateImageDto } from './dto/create-image.dto';
import { LocalFile, LocalFileDocument } from './../database/schemas';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Image, ImageDocument } from './../database/schemas';
import { LocalFileInterface } from 'src/globals/interfaces';

@Injectable()
export class FileService {
  constructor(
    @InjectModel(LocalFile.name)
    private localFileModel: Model<LocalFileDocument>,
    @InjectModel(Image.name)
    private imageModel: Model<ImageDocument>,
  ) {}

  async createImage(body: CreateImageDto, localFile?: LocalFileInterface) {
    if (localFile) {
      const file = await this.localFileModel.create(localFile);
      return await this.imageModel.create({ ...body, image: file._id });
    } else {
      throw new BadRequestException();
    }
  }

  async getFileById(id) {
    const file = await this.localFileModel.findById(id).lean();
    if (!file) {
      throw new NotFoundException();
    }
    return file;
  }

  async getAllImages() {
    return await this.imageModel.find();
  }
}
