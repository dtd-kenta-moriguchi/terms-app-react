import styled from "styled-components";

export const PopupContainer = styled.div`
  width: 420px;
  padding: 0;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
`;

export const TabContainer = styled.div`
  display: flex;
  border-bottom: 1px solid #ddd;
`;

export const TabButton = styled.button`
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

export const TabContent = styled.div`
  padding: 15px;
  display: block;
`;
