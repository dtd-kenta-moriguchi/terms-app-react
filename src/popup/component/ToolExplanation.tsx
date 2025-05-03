
import config from "../../config/config.json";
export const ToolExplanation = () => {
  return (
    <>
      <h2>ツール説明</h2>
      <div className="info-content">
        <p>
          このツールは社内で使用されている専門用語や独自用語を簡単に検索・確認するための拡張機能です。<br />
          用語は以下リンクから取得されておりますので、間違った意味が表示された場合や、新しく追加する際はリンクにアクセスの上、用語を修正してください。<br />
          <a href={config.term.web.page_url} target="_blank" rel="noopener noreferrer">
            {config.term.web.page_url}
          </a>
        </p>

        <h3>使用方法</h3>
        <ul>
          <li>
            ブラウザ上の用語を選択し、検索ボタンをクリックすると意味が表示されます。
          </li>
          <li>「用語検索」タブで用語を検索できます。</li>
          <li>「設定」タブで用語集を追加・更新できます。</li>
        </ul>
      </div>
    </>
  );
};
