import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function main() {
  const logger = new Logger('MAIN');
  const app = await NestFactory.create(AppModule);
  const PORT = 4000;
  const HOST = 'localhost';
  await app.listen(PORT, () => {
    logger.log(`(http://${HOST}:${PORT})The server is on.`);
  });
}
main();
