import { useEffect } from "react";
import { TermButton } from "./TermButton";
import { TermDialog } from "./TermDialog";
import { useTermSearch } from "../hooks/useTermSearch";

export const Content = () => {
  const {
    dialogRef,
    displayPosition,
    showSearchButton,
    showTermDialog,
    selectedTerm,
    termDescription,
    handleTextSelection,
    handleSearchButtonClick,
    handleCloseDialog,
  } = useTermSearch();

  useEffect(() => {
    document.addEventListener("mouseup", handleTextSelection);
    return () => document.removeEventListener("mouseup", handleTextSelection);
  }, [handleTextSelection]);

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
        ref={dialogRef}
      />
    </>
  );
};
