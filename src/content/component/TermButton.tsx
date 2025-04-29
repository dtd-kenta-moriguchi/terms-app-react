import styled from "styled-components";

interface TermButtonProps {
  top: number;
  left: number;
  visible: boolean;
  onClick: () => void;
}

const StyledButton = styled.div<{
  visible: boolean;
  top: number;
  left: number;
}>`
  position: absolute;
  padding: 8px 16px;
  background-color: #3c4043;
  color: white;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  z-index: 9999;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  display: ${({ visible }) => (visible ? "block" : "none")};
  top: ${({ top }) => top}px;
  left: ${({ left }) => left}px;
`;

export const TermButton = ({
  top,
  left,
  visible,
  onClick,
}: TermButtonProps) => {
  return (
    <StyledButton top={top} left={left} visible={visible} onClick={onClick}>
      用語検索
    </StyledButton>
  );
};
