import { useEffect, useRef } from 'react';
import init from '../wasm-lib/pkg';
import styles from './App.module.css';
import { Button } from './components/Button/Button';

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // WASMの読み込み
  useEffect(() => {
    init();
    console.log('WASM Initialized');
  }, []);

  // 画像が選択されたときの処理
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const reader = new FileReader();

    reader.onload = (evt) => {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
        }
      };
      if (evt.target?.result) {
        img.src = evt.target.result as string;
      }
    };
    reader.readAsDataURL(file);
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
          <div style={{ marginBottom: '1rem' }}>
            <input type="file" accept="image/*" onChange={handleFileChange}></input>
          </div>

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
