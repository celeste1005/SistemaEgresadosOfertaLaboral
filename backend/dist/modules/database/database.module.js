"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const pg_1 = require("pg");
let DatabaseModule = class DatabaseModule {
};
exports.DatabaseModule = DatabaseModule;
exports.DatabaseModule = DatabaseModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        providers: [
            {
                provide: 'DATABASE_POOL',
                useFactory: (configService) => {
                    const dbUrl = configService.get('DATABASE_URL');
                    if (dbUrl) {
                        return new pg_1.Pool({
                            connectionString: dbUrl,
                            ssl: {
                                rejectUnauthorized: false,
                            },
                        });
                    }
                    return new pg_1.Pool({
                        host: configService.get('DB_HOST', 'localhost'),
                        port: parseInt(configService.get('DB_PORT', '5432')),
                        user: configService.get('DB_USER', 'postgres'),
                        password: configService.get('DB_PASSWORD', '123456'),
                        database: configService.get('DB_NAME', 'sistema_egresados'),
                        ssl: configService.get('NODE_ENV') === 'production' ? { rejectUnauthorized: false } : false,
                    });
                },
                inject: [config_1.ConfigService],
            },
        ],
        exports: ['DATABASE_POOL'],
    })
], DatabaseModule);
//# sourceMappingURL=database.module.js.map