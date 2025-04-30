import styled from "styled-components";
import { forwardRef } from "react";

const DialogContainer = styled.div`
  position: absolute;
  width: 400px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  z-index: 10000;
  overflow: hidden;
`;

const DialogHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background-color: #3c4043;
  border-bottom: 1px solid #e0e0e0;
`;

const DialogTitle = styled.span`
  font-weight: normal;
  font-size: 16px;
  letter-spacing: 1.2px;
  color: #fff;
`;

const CloseButton = styled.span`
  cursor: pointer;
  color: #fff;
  font-size: 16px;
`;

const DialogContent = styled.div`
  background-color: #3c4043;
  padding: 16px;
  color: #fff;
  font-size: 14px;
  line-height: 1.5;
`;

interface TermDialogProps {
  visible: boolean;
  top: number;
  left: number;
  term: string | null;
  description?: string;
  onClose: () => void;
}

export const TermDialog = forwardRef<HTMLDivElement, TermDialogProps>(({
  visible,
  top,
  left,
  term,
  description,
  onClose,
}, ref) => {
  if (!visible) return null;

  return (
    <DialogContainer ref={ref} style={{ top, left }}>
      <DialogHeader>
        <DialogTitle>{term}</DialogTitle>
        <CloseButton onClick={onClose}>×</CloseButton>
      </DialogHeader>
      <DialogContent>
        {description ? description : "この用語は用語集に登録されていません。"}
      </DialogContent>
    </DialogContainer>
  );
});
