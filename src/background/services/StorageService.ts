import { TermDictionary } from "../types";
import { Logger } from "../../utils/logger";
import { TsvParser } from "./TsvParser";

export class StorageService {
  private readonly STORAGE_KEY = "termsData";
  private readonly DEFAULT_TERMS_FILE_NAME = "defaultTerms.tsv";

  async initializeStorage(): Promise<void> {
    Logger.startSection("初期データ登録開始");
    try {
      const terms = await TsvParser.parseFromUrl(
        chrome.runtime.getURL(this.DEFAULT_TERMS_FILE_NAME)
      );
      await this.saveTerms(terms);
      Logger.info("用語データをストレージに保存しました");
    } catch (error) {
      Logger.error("用語データの読み込みに失敗しました", error as Error);
      throw error;
    } finally {
      Logger.endSection("初期データ登録");
    }
  }

  async getTerms(): Promise<TermDictionary | undefined> {
    return new Promise((resolve) => {
      chrome.storage.local.get(this.STORAGE_KEY, (data) => {
        if (
          data[this.STORAGE_KEY] &&
          Object.keys(data[this.STORAGE_KEY]).length > 0
        ) {
          resolve(data[this.STORAGE_KEY]);
        } else {
          resolve(undefined);
        }
      });
    });
  }

  async saveTerms(terms: TermDictionary): Promise<boolean> {
    return new Promise((resolve) => {
      chrome.storage.local.set({ [this.STORAGE_KEY]: terms }, () => {
        if (chrome.runtime.lastError) {
          Logger.error(
            "ストレージ保存エラー:",
            new Error(chrome.runtime.lastError.message)
          );
          resolve(false);
        } else {
          resolve(true);
        }
      });
    });
  }

  async getTermDescription(term: string): Promise<string | undefined> {
    const terms = await this.getTerms();
    return terms?.[term.toLowerCase()];
  }

  async addTerms(newTerms: TermDictionary): Promise<boolean> {
    const currentTerms = (await this.getTerms()) || {};
    const mergedTerms = { ...currentTerms, ...newTerms };
    return this.saveTerms(mergedTerms);
  }
}
