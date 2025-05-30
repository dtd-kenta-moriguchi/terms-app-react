import { useState, useEffect, useCallback } from "react";
import { ActionTypes } from "../../constants/ActionTypes";
import { Term } from "../model/Term";
import { TabTypes } from "../model/TabTypes";
import { TsvParser } from "../service/TsvParser";

export const useTermManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Term[]>([]);
  const [termCount, setTermCount] = useState(0);
  const [statusMessage, setStatusMessage] = useState("");
  const [terms, setTerms] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<TabTypes>(TabTypes.INFO);

  // 用語を更新
  const loadTerms = useCallback(() => {
    chrome.runtime.sendMessage(
      { action: ActionTypes.GET_ALL_TERMS },
      (response) => {
        setTermCount(response.count || 0);
        setTerms(response.terms);
      }
    );
  }, []);

  useEffect(() => {
    loadTerms();
  }, [loadTerms]);

  // 用語を検索
  const handleSearch = useCallback(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return;

    const results: Term[] = [];
    for (const [key, value] of Object.entries(terms)) {
      if (key.includes(term)) {
        results.push({ term: key, description: value });
      }
    }
    setSearchResults(results);
  }, [searchTerm, terms]);

  // TSVファイル処理
  const handleFileUpload = useCallback(
    (file: File) => {
      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        if (!event.target?.result || typeof event.target.result !== "string")
          return;
        const additionalTermsData: Record<string, string> = TsvParser.parse(event.target.result);
        chrome.runtime.sendMessage(
          {
            action: ActionTypes.ADD_TERMS,
            additionalTerms: additionalTermsData,
          },
          () => {
            setStatusMessage("用語データを追加・更新しました");
            loadTerms();
            setTimeout(() => setStatusMessage(""), 2000);
          }
        );
      };
      reader.readAsText(file);
    },
    [loadTerms]
  );

  return {
    searchTerm,
    setSearchTerm,
    searchResults,
    termCount,
    statusMessage,
    handleSearch,
    handleFileUpload,
    activeTab,
    setActiveTab
  };
};
