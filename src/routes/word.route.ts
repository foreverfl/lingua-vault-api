import { addWord, addWords, getWord } from '@/controllers/word.controller';
import { FastifyInstance } from 'fastify';

export default async function wordRoutes(fastify: FastifyInstance) {
  fastify.put('/:word', addWord);
  fastify.put('/bulk', addWords);
  fastify.put('/scrape', addWords);
  fastify.get('/', getWord);
}