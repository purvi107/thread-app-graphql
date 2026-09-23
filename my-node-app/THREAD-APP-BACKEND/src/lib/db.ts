// import { PrismaClient } from '../../generated/prisma';


import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

console.log('DATABASE_URL:  ', process.env.DATABASE_URL);

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
export const prismaClient = new PrismaClient({ adapter });
