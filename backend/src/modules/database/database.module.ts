import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';

@Global()
@Module({
  providers: [
    {
      provide: 'DATABASE_POOL',
      useFactory: (configService: ConfigService) => {
        const dbUrl = configService.get<string>('DATABASE_URL');
        
        if (dbUrl) {
          return new Pool({
            connectionString: dbUrl,
            ssl: {
              rejectUnauthorized: false,
            },
          });
        }

        return new Pool({
          host: configService.get<string>('DB_HOST', 'localhost'),
          port: parseInt(configService.get<string>('DB_PORT', '5432')),
          user: configService.get<string>('DB_USER', 'postgres'),
          password: configService.get<string>('DB_PASSWORD', '123456'),
          database: configService.get<string>('DB_NAME', 'sistema_egresados'),
          ssl: configService.get<string>('NODE_ENV') === 'production' ? { rejectUnauthorized: false } : false,
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: ['DATABASE_POOL'],
})
export class DatabaseModule {}
