import { TypeOrmModuleOptions } from '@nestjs/typeorm';
require('dotenv').config();

const databaseConfig: TypeOrmModuleOptions = {
    type: "postgres",
    host: process.env.DB_Host,
    port: 5432,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: true,
    logging: false,
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
};

export default databaseConfig;  