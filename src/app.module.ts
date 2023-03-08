import { configuration } from 'config/configuration';

import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { UserActivityMiddleware } from './modules/user/middleware/user-activity.middleware';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        schema: configService.get('db.dbSchema'),
        url:
          'postgres://' +
          configService.get('db.dbUser') +
          ':' +
          configService.get('db.dbPass') +
          '@' +
          configService.get('db.dbHost') +
          ':' +
          configService.get('db.dbPort') +
          '/' +
          configService.get('db.dbName'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        logging:
          configService.get('nodeEnv') === 'development'
            ? ['query', 'error']
            : [],
      }),
    }),
    AuthModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [JwtService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserActivityMiddleware).forRoutes('*');
  }
}
