import { scrapeEnLongman } from '@/utils/scrapers/en-longman';

export async function scrapeWord(word: string, pos?: string): Promise<string | null> {
  return await scrapeEnLongman(word, pos);
}