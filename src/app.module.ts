import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SocketModule } from './socket/socket.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import connectMongoDb from './config/connectMongoDb';
import { FirebaseAuthMiddleware } from './firebase/firebase-auth.middleware';
import { FirebaseService } from './firebase/firebase-auth';

@Module({
  imports: [
    SocketModule,
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: connectMongoDb,
    }),
  ],
  controllers: [AppController],
  providers: [AppService, FirebaseService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(FirebaseAuthMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
