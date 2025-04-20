import { scrapeEnLongman } from '@/utils/scrapers/en-longman';

type ParsedWord = Awaited<ReturnType<typeof scrapeEnLongman>>;

export async function scrapeWord(word: string): Promise<ParsedWord> {
  return await scrapeEnLongman(word);
}