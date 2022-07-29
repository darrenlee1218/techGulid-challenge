import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Image, ImageSchema, LocalFile, LocalFileSchema } from './schemas';

@Global()
@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        uri: config.get('MONGO_URI'),
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }),
    }),
    MongooseModule.forFeature([
      { name: Image.name, schema: ImageSchema },
      { name: LocalFile.name, schema: LocalFileSchema },
    ]),
  ],
  exports: [MongooseModule],
})
export class DatabaseModule {}
