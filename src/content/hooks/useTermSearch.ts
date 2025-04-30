import { useState, useCallback, useEffect, useRef } from "react";
import { ActionTypes } from "../../constants/ActionTypes";
import { Logger } from "../../utils/logger";

type TermSearchResult = {
  result: boolean;
  description?: string;
};

export const useTermSearch = () => {
  const [displayPosition, setDisplayPosition] = useState({ top: 0, left: 0 });
  const [showSearchButton, setShowSearchButton] = useState(false);
  const [showTermDialog, setShowTermDialog] = useState(false);
  const [selectedTerm, setSelectedTerm] = useState<string | null>(null);
  const [termDescription, setTermDescription] = useState<string | undefined>(
    undefined
  );

  const handleTextSelection = useCallback(() => {
    const selection = window.getSelection();
    const hasSelection = !!selection?.toString().trim();
    setShowSearchButton(hasSelection);

    if (hasSelection && selection?.rangeCount) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      if (!rect) return;

      setSelectedTerm(selection.toString().trim());
      setDisplayPosition({
        top: window.scrollY + rect.bottom + 5,
        left: window.scrollX + rect.left,
      });
    }
  }, []);

  const handleSearchButtonClick = useCallback(async () => {
    if (!selectedTerm) return;

    setShowTermDialog(true);

    try {
      const response = await new Promise<TermSearchResult>((resolve) => {
        chrome.runtime.sendMessage(
          { action: ActionTypes.GET_TERM, searchTerm: selectedTerm },
          (response) => resolve(response)
        );
      });
      setTermDescription(response?.result ? response.description : "");
    } catch (error) {
      Logger.error("検索エラー:", error as Error);
      setTermDescription(undefined);
    }
  }, [selectedTerm]);

  const handleCloseDialog = useCallback(() => {
    setShowTermDialog(false);
  }, []);

  const dialogRef = useRef<HTMLDivElement>(null);
  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (
        dialogRef.current &&
        !dialogRef.current.contains(event.target as Node)
      ) {
        handleCloseDialog();
      }
    },
    [handleCloseDialog]
  );

  useEffect(() => {
    if (showTermDialog) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [showTermDialog, handleClickOutside]);

  return {
    dialogRef,
    displayPosition,
    showSearchButton,
    showTermDialog,
    selectedTerm,
    termDescription,
    handleTextSelection,
    handleSearchButtonClick,
    handleCloseDialog,
  };
};
