import { TermDictionary } from "../types";

export class TsvParser {
  static async parseFromUrl(url: string): Promise<TermDictionary> {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`TSVファイルの読み込みに失敗: ${response.status}`);
    }

    const tsvContent = await response.text();
    return this.parse(tsvContent);
  }

  private static parse(tsvContent: string): TermDictionary {
    const terms: TermDictionary = {};
    const lines = tsvContent.split("\n");

    for (const line of lines) {
      if (!line.trim()) continue;

      const [term, description] = line.split("\t");
      if (term && description) {
        terms[term.toLowerCase()] = description;
      }
    }

    return terms;
  }
}
