import { TermDictionary } from "../types";

export class WebPageParser {
  static async parseFromUrl(url: string): Promise<TermDictionary> {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Webページの読み込みに失敗: ${response.status}`);
    }

    const html = await response.text();
    return this.parse(html);
  }

  private static parse(html: string): TermDictionary {
    const terms: TermDictionary = {};
    
    try {
      const data = JSON.parse(html);
      if (!data?.body?.storage?.value) {
        throw new Error("Invalid data format");
      }

      const tableHtml = data.body.storage.value;
      // 正規表現でテーブル行とセルを抽出
      const rowMatches = tableHtml.match(/<tr>.*?<\/tr>/gs) || [];
      
      // ヘッダー行をスキップして処理
      for (let i = 1; i < rowMatches.length; i++) {
        const cellMatches = rowMatches[i].match(/<td>.*?<\/td>/gs) || [];
        if (cellMatches.length >= 2) {
          const term = cellMatches[0].replace(/<[^>]*>/g, '').trim();
          const description = cellMatches[1].replace(/<[^>]*>/g, '').trim();
          if (term && description) {
            terms[term.toLowerCase()] = description;
          }
        }
      }
    } catch (error) {
      console.error("Failed to parse web page content:", error);
      throw new Error("Webページの解析に失敗しました");
    }

    return terms;
  }
}
