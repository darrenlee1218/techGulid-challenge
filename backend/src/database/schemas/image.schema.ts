import { LocalFile } from './local-file.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';
import { Transform, Type } from 'class-transformer';
import * as mongoose from 'mongoose';

export type ImageDocument = Image & Document;

@Schema()
export class Image {
  @Transform(({ value }) => value.toString())
  _id: ObjectId;

  @Prop()
  name: string;

  @Prop()
  author: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: LocalFile.name })
  @Type(() => LocalFile)
  image?: LocalFile;
}

export const ImageSchema = SchemaFactory.createForClass(Image);
