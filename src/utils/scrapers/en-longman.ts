import { chromium } from "playwright";
import dotenv from "dotenv";
dotenv.config();

const SCRAPER_API_KEY = process.env.SCRAPER_API_KEY;

type Sense = {
  definition: string;
  usage?: string;
  examples: string[];
};

type ParsedWord = {
  word: string;
  pronunciation: string;
  partOfSpeech: string;
  senses: Sense[];
};

export async function scrapeEnLongman(
  word: string
): Promise<ParsedWord | null> {
  const targetUrl = `https://www.ldoceonline.com/dictionary/${encodeURIComponent(
    word
  )}`;
  const proxyUrl = `http://api.scraperapi.com?api_key=${SCRAPER_API_KEY}&url=${encodeURIComponent(
    targetUrl
  )}`;

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    page.on("console", (msg) => {
      console.log(`[browser] ${msg.type()}: ${msg.text()}`);
    });

    await page.goto(proxyUrl, { waitUntil: "domcontentloaded" });
    await page.waitForSelector(".ldoceEntry", { timeout: 5000 });

    const result = await page.$$eval(".ldoceEntry", (entries) => {
      const data = [];

      for (const entry of entries) {
        // Only Longman Dictionary of Contemporary English
        const source = entry
          .closest(".dictionary")
          ?.querySelector(".dictionary_intro")?.textContent;
        if (!source?.includes("Longman Dictionary of Contemporary English"))
          continue;

        const word = entry.querySelector(".HWD")?.textContent?.trim() || "";
        const pron = entry.querySelector(".PRON")?.textContent?.trim() || "";
        const pos = entry.querySelector(".POS")?.textContent?.trim() || "";

        const senseNodes = entry.querySelectorAll(".Sense");
        const senses = [];

        for (const sense of senseNodes) {
          const definition = sense.querySelector(".DEF")?.textContent?.trim();
          if (!definition) continue;

          const usage = sense
            .querySelector(".COLLO, .PROPFORM, .ACTIV, .GRAM")
            ?.textContent?.trim();
          const examples = Array.from(sense.querySelectorAll(".EXAMPLE"))
            .map((ex) => ex.textContent?.trim())
            .filter(Boolean);

          const senseData: any = { definition, examples };
          if (usage) senseData.usage = usage;

          senses.push(senseData);
        }

        if (word && senses.length > 0) {
          data.push({
            word,
            pronunciation: pron,
            partOfSpeech: pos,
            senses,
          });
        }
      }

      return data.length > 0 ? data[0] : null; // 첫 항목만 리턴
    });

    console.log("[scrapeEnLongman] parsed result:", result);
    return result;
  } catch (err) {
    console.error(`❌ [longman] scrape error for "${word}":`, err);
    return null;
  } finally {
    await browser.close();
  }
}
