import { ChangeEvent } from "react";
import { ToolExplanation } from "./ToolExplanation";
import { TermSearch } from "./TermSearch";
import { Settings } from "./Settings";
import { usePopupTabs } from "../hooks/usePopupTabs";
import { useTermManagement } from "../hooks/useTermManagement";
import {
  PopupContainer,
  TabContainer,
  TabButton,
  TabContent,
} from "./Popup.styles";

export const Popup = () => {
  const { activeTab, changeTab, TabTypes } = usePopupTabs();
  const {
    searchTerm,
    setSearchTerm,
    searchResults,
    termCount,
    statusMessage,
    handleSearch,
    handleFileUpload,
  } = useTermManagement();

  const onFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileUpload(file);
  };

  return (
    <PopupContainer>
      <TabContainer>
        <TabButton
          className={activeTab === TabTypes.INFO ? "active" : ""}
          onClick={() => changeTab(TabTypes.INFO)}
          data-tab="info"
        >
          ツール説明
        </TabButton>
        <TabButton
          className={activeTab === TabTypes.SEARCH ? "active" : ""}
          onClick={() => changeTab(TabTypes.SEARCH)}
          data-tab="search"
        >
          用語検索
        </TabButton>
        <TabButton
          className={activeTab === TabTypes.SETTINGS ? "active" : ""}
          onClick={() => changeTab(TabTypes.SETTINGS)}
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
            onFileUpload={onFileUpload}
          />
        </TabContent>
      )}
    </PopupContainer>
  );
};
