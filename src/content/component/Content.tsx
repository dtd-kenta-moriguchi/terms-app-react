import { useState, useEffect } from "react";
import { TermButton } from "./TermButton";
import { TermDialog } from "./TermDialog";
import ActionTypes from "../../constants/ActionTypes";

export const Content = () => {
  const [displayPosition, setDisplayPosition] = useState({ top: 0, left: 0 });
  const [showSearchButton, setShowSearchButton] = useState(false);
  const [showTermDialog, setShowTermDialog] = useState(false);
  const [selectedTerm, setSelectedTerm] = useState<string | null>(null);
  const [termDescription, setTermDescription] = useState<string | undefined>(
    undefined
  );

  const handleTextSelection = () => {
    const selection: Selection | null = window.getSelection();
    const hasSelection: boolean =
      !!selection && selection?.toString().trim().length > 0;
    setShowSearchButton(!!hasSelection);

    if (hasSelection && selection?.rangeCount && selection.rangeCount > 0) {
      const range: Range = selection.getRangeAt(0);
      const rect: DOMRect = range.getBoundingClientRect();
      if (!rect) return;
      setSelectedTerm(selection?.toString().trim());
      setDisplayPosition({
        top: window.scrollY + rect.bottom + 5,
        left: window.scrollX + rect.left,
      });
    }
  };

  const handleSearchButtonClick = async () => {
    if (!selectedTerm) return;

    console.log("用語検索開始:", selectedTerm);
    setShowTermDialog(true);

    try {
      const response = await new Promise<{
        result: boolean;
        description?: string;
      }>((resolve) => {
        chrome.runtime.sendMessage(
          { action: ActionTypes.SEARCH_TERM, searchTerm: selectedTerm },
          (response) => {
            if (chrome.runtime.lastError) {
              console.error("メッセージングエラー:", chrome.runtime.lastError);
              resolve({ result: false });
            } else {
              resolve(response);
            }
          }
        );
      });

      console.log("検索結果受信:", response);

      const termDescription = response?.result ? response.description : "";

      setTermDescription(termDescription);
    } catch (error) {
      console.error("検索中にエラーが発生しました:", error);
    }
  };

  const handleCloseDialog = () => {
    setShowTermDialog(false);
  };

  useEffect(() => {
    document.addEventListener("mouseup", handleTextSelection);
    return () => document.removeEventListener("mouseup", handleTextSelection);
  }, []);

  return (
    <>
      <TermButton
        visible={showSearchButton}
        top={displayPosition.top}
        left={displayPosition.left}
        onClick={handleSearchButtonClick}
      />
      <TermDialog
        visible={showTermDialog}
        top={displayPosition.top}
        left={displayPosition.left}
        term={selectedTerm}
        description={termDescription}
        onClose={handleCloseDialog}
      />
    </>
  );
};
