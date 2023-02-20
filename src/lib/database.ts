import { PrismaClient } from '@prisma/client';

const database =
  global.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error'] : [],
  });

if (process.env.NODE_ENV !== 'production') global.prisma = database;

export default database;
