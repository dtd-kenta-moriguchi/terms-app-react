import { Logger } from "../utils/logger";
import { MessageHandler } from "./services/MessageHandler";
import { StorageService } from "./services/StorageService";

const storageService = new StorageService();

// MessageHandlerを初期化
new MessageHandler();

// 初期化時に用語データを読み込む
chrome.runtime.onInstalled.addListener(
  (details: chrome.runtime.InstalledDetails) => {
    Logger.info("拡張機能がインストールされました:", details.reason);
    storageService.initializeStorage();
  }
);

// セッション開始時にもデータをロード
chrome.runtime.onStartup.addListener(() => {
  Logger.info("ブラウザ起動: データをリロードします");
  storageService.initializeStorage();
});
