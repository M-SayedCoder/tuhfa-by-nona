import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true, collection: 'users' })
export class User {
  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({ default: '' })
  phone: string;

  @Prop({ default: false })
  isAdmin: boolean;

  @Prop({ default: false })
  isVerifiedClient: boolean;

  @Prop({ default: false })
  isPhoneVerified: boolean;

  @Prop({ default: null })
  verificationDate: string;

  // Derived username from email prefix
  @Prop({ default: '' })
  username: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Virtual for id
UserSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

UserSchema.set('toJSON', {
  virtuals: true,
  transform: (_doc, ret) => {
    delete ret._id;
    delete ret.__v;
    delete ret.passwordHash; // Never expose password hash
    return ret;
  },
});
