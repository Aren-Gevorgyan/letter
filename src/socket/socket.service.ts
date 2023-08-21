import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Messages, MessagesDocument } from 'src/schemas/messages.schema';
import { MessagesDto } from './soket.dto';

@Injectable()
export class SocketService {
  constructor(
    @InjectModel(Messages.name) private messagesModel: Model<MessagesDocument>,
  ) {}

  async create(body: MessagesDto) {
    try {
      const data = new this.messagesModel(body);
      return data.save();
    } catch (error) {
      throw new BadRequestException();
    }
  }
}
