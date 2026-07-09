const dotenv = require('dotenv');
const path = require('path');
const Joi = require('joi');

const envPath = path.resolve(__dirname, '../.env');
const envSpecificPath = path.join(
    __dirname,
    '../',
    `.env${process.env.NODE_ENV ? `.${process.env.NODE_ENV}` : '.development'}`
);
dotenv.config({ path: envPath });
dotenv.config({ path: envSpecificPath });

const envSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test').required(),
  PORT: Joi.number().default(3000),
  MONGO_URL: Joi.string().required().description('MongoDB connection URL'),
  JWT_SECRET: Joi.string().required().description('JWT secret key'),
});

const { error, value: envVars } = envSchema.validate(process.env, { allowUnknown: true });
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
    env: envVars.NODE_ENV,
    port: envVars.PORT,
    mongoUrl: envVars.MONGO_URL,
    jwtSecret: envVars.JWT_SECRET,
};