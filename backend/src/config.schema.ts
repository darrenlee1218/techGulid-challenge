import * as Joi from 'joi';

export const configValidationSchema = Joi.object({
  //port
  PORT: Joi.number().default(8080).required(),
  //databases
  MONGO_URI: Joi.string().required(),
  // file uploads
  UPLOADED_FILES_DESTINATION: Joi.string().required(),
});
