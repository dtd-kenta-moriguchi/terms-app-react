import { WebPageParser } from "./WebPageParser";
import config from "../../config/config.json";

export class TermProvider {
    async getTermsFromWeb(): Promise<Record<string, string>> {
        const response = await fetch(config.term.web.api_url);

        if (!response.ok) {
            throw new Error(`Webページの読み込みに失敗: ${response.status}`);
        }
        const html = await response.text();
        return WebPageParser.parse(html, config.term.web.keyColumnNumber, config.term.web.descriptionColumnNumber);
    }
}