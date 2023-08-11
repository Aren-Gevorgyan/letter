import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  nestFrontUrl: process.env.FRONT_URL || 'http://localhost:3000',
}));
