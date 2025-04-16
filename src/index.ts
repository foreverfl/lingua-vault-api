import Fastify from 'fastify';
import wordRoutes from '@/routes/word.route';

const fastify = Fastify({
  logger: true
});

fastify.get('/', async (request, reply) => {
  return { hello: 'world' };
});

const start = async () => {
  try {
    await fastify.register(wordRoutes); 
    await fastify.listen({ port: 4000 });
    console.log('Server running at http://localhost:4000');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();