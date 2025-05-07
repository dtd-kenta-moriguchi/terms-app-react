import { StorageService } from "./StorageService";
import { Logger } from "../../utils/logger";
import { ActionTypes } from "../../constants/ActionTypes";

export interface MessageResponse {
  result: boolean;
  description?: string;
  count?: number;
  error?: string;
  terms?: Record<string, string>;
}

export interface MessageRequest {
  action: string;
  searchTerm?: string;
  additionalTerms?: Record<string, string>;
}

export class MessageHandler {
  private storageService: StorageService;

  constructor() {
    this.storageService = new StorageService();
    chrome.runtime.onMessage.addListener(this.handleMessage.bind(this));
  }

  private handleMessage(
    request: MessageRequest,
    _sender: chrome.runtime.MessageSender,
    sendResponse: (response?: MessageResponse) => void
  ): boolean {
    (async () => {
      try {
        switch (request.action) {
          case ActionTypes.GET_TERM:
            await this.handleGetTerm(request, sendResponse);
            break;
          case ActionTypes.GET_ALL_TERMS:
            await this.handleGetAllTerms(request, sendResponse);
            break;
          case ActionTypes.ADD_TERMS:
            await this.handleAddTerms(request, sendResponse);
            break;
          default:
            Logger.error(`不明なアクション: ${request.action}`);
            sendResponse({ result: false, error: "不明なアクション" });
        }
      } catch (error) {
        Logger.error("メッセージ処理中にエラーが発生しました", error as Error);
        sendResponse({ result: false, error: "内部エラー" });
      }
    })();

    return true; // 非同期レスポンスを許可
  }

  private async handleGetTerm(
    request: MessageRequest,
    sendResponse: (response: MessageResponse) => void
  ): Promise<void> {
    if (!request.searchTerm) {
      sendResponse({ result: false, error: "検索用語が指定されていません" });
      return;
    }

    Logger.info(`用語検索リクエスト: ${request.searchTerm}`);
    const description = await this.storageService.getTermDescription(request.searchTerm);
    sendResponse({
      result: !!description,
      description: description || undefined,
    });
  }

  private async handleGetAllTerms(
    _request: MessageRequest,
    sendResponse: (response: MessageResponse) => void
  ): Promise<void> {
    Logger.info("用語データ全件取得リクエスト");
    const terms = await this.storageService.getTerms();

    if (terms) {
      sendResponse({
        result: true,
        count: Object.keys(terms).length,
        terms,
      });
    } else {
      sendResponse({ result: false });
    }
  }

  private async handleAddTerms(
    request: MessageRequest,
    sendResponse: (response: MessageResponse) => void
  ): Promise<void> {
    if (!request.additionalTerms) {
      sendResponse({ result: false, error: "追加用語が指定されていません" });
      return;
    }

    Logger.info("用語データ追加リクエスト");
    const success = await this.storageService.addTerms(request.additionalTerms);
    sendResponse({ result: success });
  }
}
