import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type OrderDocument = Order & Document;

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'delivered'
  | 'canceled';

@Schema({ timestamps: true, collection: 'orders' })
export class Order {
  @Prop({ required: true })
  customerName: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  occasionType: string;

  @Prop({ required: true })
  mainColor: string;

  @Prop({ required: true })
  customText: string;

  @Prop({ default: '' })
  details: string;

  @Prop({
    type: String,
    enum: ['pending', 'confirmed', 'preparing', 'delivered', 'canceled'],
    default: 'pending',
  })
  status: OrderStatus;

  @Prop({ default: '' })
  metroStation: string;

  @Prop({ type: Types.ObjectId, ref: 'User', default: null })
  userId: Types.ObjectId | null;

  @Prop({ default: null })
  priceEGP: number | null;

  @Prop({ default: false })
  isVerifiedClient: boolean;

  // Human-readable creation date in Arabic
  @Prop({ default: '' })
  createdAt: string;

  // ISO date string for sorting
  @Prop({ default: () => new Date().toISOString() })
  createdAtRaw: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);

// Virtual id
OrderSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

OrderSchema.set('toJSON', {
  virtuals: true,
  transform: (_doc, ret) => {
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});
