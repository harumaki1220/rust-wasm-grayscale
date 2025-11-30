import { useEffect, useRef } from 'react';
// import init, {convert_to_grayscale} from '../wasm-lib/pkg'
import styles from './App.module.css';
import { Button } from './components/Button/Button';

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // WASMの読み込み
  useEffect(() => {
    // TODO: ここで init() を実行してWASMを初期化してください
    // 非同期関数ですが、useEffect内なので .then() を使うか、
    // 即時実行関数(IIFE)で await してもOKです。
    // 面倒なら単に init(); と書くだけでも動きます（非同期で読み込まれます）
    console.log('WASM Initialized');
  }, []);

  // 画像が選択されたときの処理（次回実装します）
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('File selected');
  };

  // 白黒変換ボタンが押されたときの処理（次回実装します）
  const handleConvert = () => {
    console.log('Convert clicked');
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Rust WASM Grayscale Converter</h1>

        <div className={styles.card}>
          {/* 画像選択ボタン */}
          {/* TODO: ここに type="file" の input タグを書いてください */}
          {/* accept="image/*" をつけると画像だけ選べるようになります */}
          <div style={{ marginBottom: '1rem' }}>{/* ここにinputタグ */}</div>

          {/* 画像を表示するキャンバス */}
          <canvas
            ref={canvasRef}
            style={{ border: '1px solid #666', maxWidth: '100%', height: 'auto' }}
          />

          <div style={{ marginTop: '1rem' }}>
            <Button onClick={handleConvert}>白黒にする！</Button>
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;
