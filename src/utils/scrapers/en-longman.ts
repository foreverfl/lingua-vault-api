import { chromium } from 'playwright';

export async function scrapeEnLongman(word: string, pos?: string): Promise<string | null> {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    const url = `https://www.ldoceonline.com/dictionary/${encodeURIComponent(word)}`;
    await page.goto(url, { waitUntil: 'domcontentloaded' });

    await page.waitForSelector('.ldoceEntry'); // 전체 사전 entry

    const result = await page.$$eval('.ldoceEntry', (entries, pos) => {
      for (const entry of entries) {
        const source = entry.closest('.dictionary')?.querySelector('.dictionary_intro')?.textContent?.trim();
        const partOfSpeech = entry.querySelector('.POS')?.textContent?.trim().toLowerCase();
        const def = entry.querySelector('.DEF')?.textContent?.trim();

        // 조건: Longman 정의 + 품사 일치 + 정의 존재
        if (
          source === 'From Longman Dictionary of Contemporary English' &&
          (!pos || partOfSpeech === pos.toLowerCase()) &&
          def
        ) {
          return def;
        }
      }
      return null;
    }, pos);

    return result;
  } catch (err) {
    console.error(`❌ [longman] scrape error for "${word}":`, err);
    return null;
  } finally {
    await browser.close();
  }
}