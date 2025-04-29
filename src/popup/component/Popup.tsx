import { useState, useEffect, ChangeEvent } from "react";
import { ToolExplanation } from "./ToolExplanation";
import { TermSearch } from "./TermSearch";
import { Settings } from "./Settings";
import styled from "styled-components";
import ActionTypes from "../../constants/ActionTypes";
import { Term } from "../../model/Term";

const PopupContainer = styled.div`
  width: 350px;
  padding: 0;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
`;

const TabContainer = styled.div`
  display: flex;
  border-bottom: 1px solid #ddd;
`;

const TabButton = styled.button`
  flex: 1;
  padding: 12px 0;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  color: #555;
  border-bottom: 3px solid transparent;

  &.active {
    color: #4285f4;
    border-bottom-color: #4285f4;
  }
`;

const TabContent = styled.div`
  padding: 15px;
  display: block;
`;

enum TabTypes {
  INFO = "info",
  SEARCH = "search",
  SETTINGS = "settings",
}

export const Popup = () => {
  const [activeTab, setActiveTab] = useState<TabTypes>(TabTypes.INFO);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Term[]>([]);
  const [termCount, setTermCount] = useState(0);
  const [statusMessage, setStatusMessage] = useState("");
  const [terms, setTerms] = useState<Record<string, string>>({});

  // 用語数を更新
  const loadTerms = () => {
    chrome.runtime.sendMessage(
      { action: ActionTypes.GET_ALL_TERMS },
      function (response) {
        console.log("検索結果受信:", response);
        setTermCount(response.count || 0);
        setTerms(response.terms);
      }
    );
  };

  useEffect(() => {
    loadTerms();
  }, []);

  // 用語を検索
  const handleSearch = () => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return;
    const results: Term[] = [];

    for (const [key, value] of Object.entries(terms)) {
      if (key.includes(term)) {
        results.push({ term: key, description: value as string });
      }
    }
    setSearchResults(results);
  };

  // TSVファイル処理
  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event: ProgressEvent<FileReader>) => {
      if (!event.target?.result || typeof event.target.result !== "string")
        return;

      const additionalTermsData: Record<string, string> = {};
      const lines = event.target.result.split("\n");

      lines.forEach((line) => {
        if (line) {
          const [term, description] = line.split("\t");
          if (term && description) {
            additionalTermsData[term.toLowerCase()] = description;
          }
        }
      });

      chrome.runtime.sendMessage(
        { action: ActionTypes.ADD_TERMS, additionalTerms: additionalTermsData },
        function (response) {
          console.log("検索結果受信:", response);
          setStatusMessage("用語データを追加・更新しました");
          loadTerms();
          setTimeout(() => setStatusMessage(""), 2000);
        }
      );
    };
    reader.readAsText(file);
  };

  return (
    <PopupContainer>
      <TabContainer>
        <TabButton
          className={activeTab === TabTypes.INFO ? "active" : ""}
          onClick={() => setActiveTab(TabTypes.INFO)}
          data-tab="info"
        >
          ツール説明
        </TabButton>
        <TabButton
          className={activeTab === TabTypes.SEARCH ? "active" : ""}
          onClick={() => setActiveTab(TabTypes.SEARCH)}
          data-tab="search"
        >
          用語検索
        </TabButton>
        <TabButton
          className={activeTab === TabTypes.SETTINGS ? "active" : ""}
          onClick={() => setActiveTab(TabTypes.SETTINGS)}
          data-tab="settings"
        >
          設定
        </TabButton>
      </TabContainer>

      {activeTab === TabTypes.INFO && (
        <TabContent>
          <ToolExplanation />
        </TabContent>
      )}

      {activeTab === TabTypes.SEARCH && (
        <TabContent>
          <TermSearch
            searchTerm={searchTerm}
            searchResults={searchResults}
            onSearchTermChange={setSearchTerm}
            onSearch={handleSearch}
          />
        </TabContent>
      )}

      {activeTab === TabTypes.SETTINGS && (
        <TabContent>
          <Settings
            termCount={termCount}
            statusMessage={statusMessage}
            onFileUpload={handleFileUpload}
          />
        </TabContent>
      )}
    </PopupContainer>
  );
};
