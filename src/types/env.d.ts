declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test';
    JWT_SECRET: string;
    DATABASE_URL: string;
  }
}
