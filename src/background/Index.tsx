// Chrome拡張機能のバックグラウンドスクリプト
// 常に裏で動き続けて、イベント待ち受けを担当

import ActionTypes from "../constants/ActionTypes";

interface MessageResponse {
  result: boolean;
  description?: string | null;
  count?: number;
  error?: string;
  terms?: Record<string, string> | null;
}

interface MessageRequest {
  action: string;
  searchTerm?: string;
  additionalTerms?: Record<string, string>;
}

const LOCAL_STORAGE_KEY = "termsData"; // ストレージキー
const DEFAULT_TERMS_FILE_NAME = "terms.tsv"; // デフォルトのTSVファイル名

const initializeStorage = async () => {
  console.log("========== 初期データ登録開始 ==========");
  return fetch(chrome.runtime.getURL(DEFAULT_TERMS_FILE_NAME))
    .then((response) => {
      console.log("TSVファイル応答受信:", response.status);
      return response.text();
    })
    .then((tsvContent) => {
      console.log("TSVデータ取得成功、パース開始");
      const terms: Record<string, string> = {};

      // TSVをパースして用語データに変換
      const lines: string[] = tsvContent.split("\n");
      console.log("行数:", lines.length);

      // ヘッダー行をスキップして2行目から処理
      lines.forEach((line) => {
        if (line) {
          const [term, description] = line.split("\t");
          if (term && description) {
            terms[term.toLowerCase()] = description;
          }
        }
      });

      // ストレージに保存
      return new Promise<void>((resolve) => {
        chrome.storage.local.set({ [LOCAL_STORAGE_KEY]: terms }, () => {
          console.log("用語データをストレージに保存しました");
          resolve();
        });
      });
    })
    .catch((error) => {
      console.error("用語データの読み込みに失敗しました:", error);
      throw error;
    })
    .finally(() => {
      console.log("========== 初期データ登録終了 ==========");
    });
};

const getAllTerms = async (): Promise<Record<string, string> | null> => {
  return new Promise((resolve) => {
    chrome.storage.local.get(
      LOCAL_STORAGE_KEY,
      (data: { termsData?: Record<string, string> }) => {
        if (data.termsData && Object.keys(data.termsData).length > 0) {
          console.log("ストレージから用語データを読み込みました");
          resolve(data.termsData);
        } else {
          console.log("ストレージにデータがないためファイルから読み込みます");
          initializeStorage();
          resolve(null);
        }
      }
    );
  });
};

// 用語を検索する関数
const searchTerm = async (term: string): Promise<string | null> => {
  console.log("用語検索:", term);

  // 小文字に変換して検索
  const normalizedTerm: string = term.toLowerCase();

  return new Promise((resolve) => {
    chrome.storage.local.get(
      LOCAL_STORAGE_KEY,
      (data: { termsData?: Record<string, string> }) => {
        if (data.termsData && Object.keys(data.termsData).length > 0) {
          const result: string | null = data.termsData[normalizedTerm] || null;
          console.log(
            "検索結果:",
            result ? "見つかりました" : "見つかりませんでした"
          );
          resolve(result);
        } else {
          console.log("用語データが見つかりませんでした");
          resolve(null);
        }
      }
    );
  });
};

const addTerms = async (
  additionalTerms: Record<string, string>
): Promise<void> => {
  return new Promise<void>((resolve) => {
    chrome.storage.local.get(
      LOCAL_STORAGE_KEY,
      (data: { termsData?: Record<string, string> }) => {
        const mergedTerms: Record<string, string> = {
          ...(data.termsData || {}),
          ...additionalTerms,
        };
        chrome.storage.local.set({ [LOCAL_STORAGE_KEY]: mergedTerms }, () => {
          console.log("追加データをストレージに保存しました");
          resolve();
        });
      }
    );
  });
};

// メッセージリスナーを設定
chrome.runtime.onMessage.addListener(
  (
    request: MessageRequest,
    _sender: chrome.runtime.MessageSender,
    sendResponse: (response: MessageResponse) => void
  ) => {
    console.log("メッセージ受信:", request);

    if (request.action === ActionTypes.SEARCH_TERM && request.searchTerm) {
      console.log("用語検索リクエスト");
      searchTerm(request.searchTerm).then((response) => {
        console.log("用語検索結果を返します:", response);
        sendResponse({ result: !!response, description: response });
      });
      return true; // 非同期レスポンスのためtrueを返す
    } else if (request.action === ActionTypes.GET_ALL_TERMS) {
      console.log("用語データロードリクエスト");
      getAllTerms().then((response) => {
        if (response) {
          sendResponse({
            result: true,
            count: Object.keys(response).length,
            terms: response,
          });
        }
      });
      return true; // 非同期レスポンスのため true を返す
    } else if (
      request.action === ActionTypes.ADD_TERMS &&
      request.additionalTerms
    ) {
      console.log("用語データ追加リクエスト");
      addTerms(request.additionalTerms).then(() => {
        sendResponse({ result: true });
      });
      return true; // 非同期レスポンスのため true を返す
    } else {
      console.log("不明なアクション:", request.action);
      sendResponse({ result: false, error: "不明なアクション" });
    }
  }
);

// 初期化時に用語データを読み込む
chrome.runtime.onInstalled.addListener(
  (details: chrome.runtime.InstalledDetails) => {
    console.log("拡張機能がインストールされました:", details.reason);
    initializeStorage();
  }
);

// セッション開始時にもデータをロード
chrome.runtime.onStartup.addListener(() => {
  console.log("ブラウザ起動: データをリロードします");
  initializeStorage();
});
