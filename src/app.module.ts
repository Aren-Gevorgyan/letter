import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SocketModule } from './socket/socket.module';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';

@Module({
  imports: [
    SocketModule,
    ConfigModule.forRoot({
      load: [configuration], // Load your custom configuration
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
