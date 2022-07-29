import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';
import { Transform } from 'class-transformer';

export type LocalFileDocument = LocalFile & Document;

@Schema()
export class LocalFile {
  @Transform(({ value }) => value.toString())
  _id: ObjectId;

  @Prop()
  filename: string;

  @Prop()
  path: string;

  @Prop()
  mimetype: string;
}

export const LocalFileSchema = SchemaFactory.createForClass(LocalFile);
