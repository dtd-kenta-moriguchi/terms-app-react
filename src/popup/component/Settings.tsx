import styled from "styled-components";

const InfoText = styled.div`
  margin-bottom: 16px;
  font-size: 14px;
  line-height: 1.5;
`;

const SampleContainer = styled.div`
  background-color: #f5f5f5;
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 16px;
  font-family: monospace;
  font-size: 13px;
  white-space: pre;
  overflow-x: auto;
`;

const UploadLabel = styled.label`
  display: inline-block;
  padding: 8px 16px;
  background-color: #3c4043;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 16px;
  font-size: 14px;

  &:hover {
    background-color: #52575c;
  }
`;

const StatusMessage = styled.div`
  padding: 8px;
  background-color: #e8f5e9;
  color: #2e7d32;
  border-radius: 4px;
  margin-bottom: 16px;
  font-size: 14px;
`;

const StatContainer = styled.div`
  background-color: #f5f5f5;
  padding: 16px;
  border-radius: 8px;
`;

const StatHeading = styled.div`
  font-weight: bold;
  margin-bottom: 8px;
`;

const TermCount = styled.div`
  font-size: 14px;

  span {
    font-weight: bold;
    color: #3c4043;
  }
`;

interface SettingsProps {
  termCount: number;
  statusMessage: string;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Settings = ({
  termCount,
  statusMessage,
  onFileUpload,
}: SettingsProps) => {
  return (
    <>
      <h2>設定</h2>

      <InfoText>
        デフォルトで登録されている用語に加え、自分で用語を追加することができます。
        以下のようなTSVファイルを用意してアップロードすることで、用語を追加できます。
      </InfoText>

      <SampleContainer>
        {`用語\t説明
API\tApplication Programming Interfaceの略
UI\tUser Interfaceの略
UX\tUser Experienceの略`}
      </SampleContainer>

      <UploadLabel htmlFor="uploadTsv">TSVファイルをアップロード</UploadLabel>
      <input
        type="file"
        id="uploadTsv"
        accept=".tsv"
        style={{ display: "none" }}
        onChange={onFileUpload}
      />

      {statusMessage && <StatusMessage>{statusMessage}</StatusMessage>}

      <StatContainer>
        <StatHeading>用語集の統計</StatHeading>
        <TermCount>
          現在 <span>{termCount}</span> 件の用語が登録されています
        </TermCount>
      </StatContainer>
    </>
  );
};
