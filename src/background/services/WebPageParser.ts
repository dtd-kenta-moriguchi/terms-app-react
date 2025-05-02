export class WebPageParser {

  static async parseFromUrl(
    url: string,
    termKeyNumber: number,
    termDescriptionNumber: number
  ): Promise<Record<string, string>> {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Webページの読み込みに失敗: ${response.status}`);
    }

    const html = await response.text();
    return this.parse(html, termKeyNumber, termDescriptionNumber);
  }

  private static parse(
    html: string,
    termKeyNumber: number,
    termDescriptionNumber: number
  ): Record<string, string> {
    const terms: Record<string, string> = {};

    try {
      const data = JSON.parse(html);
      if (!data?.body?.storage?.value) {
        throw new Error("Invalid data format");
      }

      const tableHtml = data.body.storage.value;
      // 正規表現でテーブル行とセルを抽出
      const rowMatches = tableHtml.match(/<tr>.*?<\/tr>/gs) || [];

      for (let i = 0; i < rowMatches.length; i++) {
        const cellMatches = rowMatches[i].match(/<td>.*?<\/td>/gs) || [];
        const term = cellMatches[termKeyNumber].replace(/<[^>]*>/g, '').trim();
        const description = cellMatches[termDescriptionNumber].replace(/<[^>]*>/g, '').trim();
        if (term && description) {
          terms[term.toLowerCase()] = description;
        }
      }
    } catch (error) {
      console.error("Failed to parse web page content:", error);
      throw new Error("Webページの解析に失敗しました");
    }

    return terms;
  }
}
