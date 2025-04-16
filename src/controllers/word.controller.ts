import { FastifyRequest, FastifyReply } from 'fastify';
import { scrapeWord } from '@/services/word.service';

type PostWordRequest = FastifyRequest<{
  Body: {
    word: string;
    pos?: string; 
  };
}>;

export async function postWord(req: PostWordRequest, reply: FastifyReply) {
  const { word, pos } = req.body;
  if (!word) return reply.status(400).send({ error: 'word is required' });

  const result = await scrapeWord(word, pos);

  if (!result) {
    return reply.status(404).send({ error: 'No definition found' });
  }

  return reply.send({ word, pos, definition: result });
}