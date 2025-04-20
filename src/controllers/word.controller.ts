import { scrapeWord } from '@/services/word.service';
import { FastifyReply, FastifyRequest } from 'fastify';

type AddWordRequest = FastifyRequest<{
  Params: {
    word: string;
  };
}>;

export async function addWord(req: AddWordRequest, reply: FastifyReply) {
  const { word } = req.params;

  if (!word) return reply.status(400).send({ error: 'word is required' });

  const result = await scrapeWord(word);

  if (!result) {
    return reply.status(404).send({ error: 'No definition found' });
  }

  return reply.send({ word, definition: result });
}

type PostWordsRequest = FastifyRequest<{
  Body: {
    words: string[];
  };
}>;

export async function addWords(req: PostWordsRequest, reply: FastifyReply) {
  const { words } = req.body;
  if (!Array.isArray(words) || words.length === 0) {
    return reply.status(400).send({ error: 'words is required' });
  }

  const results = await Promise.all(
    words.map(async (word: string) => {
      const result = await scrapeWord(word);
      return { word, definition: result };
    })
  );

  return reply.send(results);
}

export async function getWord(req: FastifyRequest, reply: FastifyReply) {
  const { word } = req.query as { word: string };
  if (!word) return reply.status(400).send({ error: 'word is required' });

  const result = await scrapeWord(word);

  if (!result) {
    return reply.status(404).send({ error: 'No definition found' });
  }

  return reply.send({ word, definition: result });
}
