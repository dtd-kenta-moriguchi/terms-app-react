import styled from "styled-components";
import { Term } from "../model/Term";

interface TermSearchProps {
  searchTerm: string;
  searchResults: Term[];
  onSearchTermChange: (term: string) => void;
  onSearch: () => void;
}

const SearchContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 8px;
  padding: 16px;
  background-color: #f5f5f5;
  border-radius: 8px;
`;

const SearchInput = styled.input`
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  flex-grow: 1;
`;

const SearchButton = styled.button`
  padding: 8px;
  background-color: #3c4043;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background-color: #52575c;
  }
`;

const ResultsContainer = styled.div`
  margin-top: 16px;
`;

const ResultItem = styled.div`
  padding: 12px;
  background-color: white;
  border-radius: 4px;
  margin-bottom: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

export const TermSearch = ({
  searchTerm,
  searchResults,
  onSearchTermChange,
  onSearch,
}: TermSearchProps) => {
  return (
    <>
      <h2>用語検索</h2>
      <SearchContainer>
        <SearchInput
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchTermChange(e.target.value)}
          placeholder="用語を検索..."
        />
        <SearchButton onClick={onSearch}>検索</SearchButton>
      </SearchContainer>

      <ResultsContainer>
        {searchResults.length > 0 ? (
          searchResults.map((result, index) => (
            <ResultItem key={index}>
              <h4>{result.term}</h4>
              <p>{result.description}</p>
            </ResultItem>
          ))
        ) : (
          <p>該当する用語が見つかりませんでした</p>
        )}
      </ResultsContainer>
    </>
  );
};
