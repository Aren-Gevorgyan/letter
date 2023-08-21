import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type MessagesDocument = HydratedDocument<Messages>;

@Schema({ timestamps: true })
export class Messages {
  @Prop()
  text: string;

  @Prop()
  writerID: string;
}

export const MessagesSchema = SchemaFactory.createForClass(Messages);
