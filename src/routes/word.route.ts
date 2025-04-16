import { FastifyInstance } from 'fastify';
import { postWord } from '@/controllers/word.controller';

export default async function wordRoutes(fastify: FastifyInstance) {
  fastify.post('/words', postWord);
}