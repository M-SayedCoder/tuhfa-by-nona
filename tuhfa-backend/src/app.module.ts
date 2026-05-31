import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { OrdersModule } from './orders/orders.module';
import { OtpModule } from './otp/otp.module';
import { HealthController } from './health.controller';

@Module({
  imports: [
    // Load environment variables
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // MongoDB connection
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('MONGODB_URI', 'mongodb://localhost:27017/tuhfa'),
        connectionFactory: (connection) => {
          connection.on('connected', () => {
            console.log('✅ MongoDB متصل بنجاح');
          });
          connection.on('error', (err) => {
            console.error('❌ MongoDB خطأ في الاتصال:', err.message);
          });
          connection.on('disconnected', () => {
            console.warn('⚠️ MongoDB انقطع الاتصال');
          });
          return connection;
        },
      }),
      inject: [ConfigService],
    }),

    AuthModule,
    UsersModule,
    OrdersModule,
    OtpModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
