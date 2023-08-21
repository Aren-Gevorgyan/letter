import { ConfigService } from '@nestjs/config';

const connectMongoDb = async (config: ConfigService) => {
  const host = config.get<string>('MONGO_HOST');
  const dbName = config.get<string>('MONGO_DB_NAME');
  console.log(`mongodb://${host}/${dbName}`);
  return {
    uri: `mongodb://${host}/${dbName}`,
  };
};

export default connectMongoDb;
