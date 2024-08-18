import { registerAs } from "@nestjs/config"
import { config as dotenvConfig } from 'dotenv';
import { DataSource, DataSourceOptions } from "typeorm";
import { SeederOptions } from "typeorm-extension";

dotenvConfig({ path: '.env' });

const config = {
    type: 'postgres',
    host: `${process.env.DATABASE_HOST}`,
    port: `${process.env.DATABASE_PORT}`,
    username: `${process.env.DATABASE_USERNAME}`,
    password: `${process.env.DATABASE_PASSWORD}`,
    database: `${process.env.DATABASE_NAME}`,
    entities: ['dist/**/*.entity{.ts,.js}'],
    migrations: ['dist/database/migrations/*{.ts,.js}'],
    autoLoadEntities: true,
    migrationsRun: true,
    synchronize: false,
    seeds: ['dist/database/seeds/**/*{.ts,.js}'],
}

export default registerAs('typeorm', () => config)
export const connectionSource = new DataSource(config as DataSourceOptions & SeederOptions);
