import { useState } from "react";

export enum TabTypes {
  INFO = "info",
  SEARCH = "search",
  SETTINGS = "settings",
}

export const usePopupTabs = (initialTab: TabTypes = TabTypes.INFO) => {
  const [activeTab, setActiveTab] = useState<TabTypes>(initialTab);

  const changeTab = (tab: TabTypes) => {
    setActiveTab(tab);
  };

  return {
    activeTab,
    changeTab,
    TabTypes
  };
};
