import { useEffect, useRef } from 'react';
import init, { convert_to_grayscale } from '../wasm-lib/pkg';
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

  // 白黒変換ボタンが押されたときの処理
  const handleConvert = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    const imageData = ctx.getImageData(0, 0, width, height);

    const inputData = new Uint8Array(imageData.data.buffer);

    convert_to_grayscale(inputData, width, height);

    const newImageData = new ImageData(new Uint8ClampedArray(inputData.buffer), width, height);

    ctx.putImageData(newImageData, 0, 0);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center text-center bg-gray-900 text-white">
      <header className="flex flex-col gap-6">
        <h1 className="text-4xl font-bold">Rust WASM Grayscale Converter</h1>

        <div className="p-8 border border-gray-600 rounded-xl bg-gray-800 shadow-lg">
          <div className="mb-6">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-400
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-violet-50 file:text-violet-700
                hover:file:bg-violet-100"
            />
          </div>

          <canvas
            ref={canvasRef}
            className="border border-gray-500 max-w-full h-auto rounded-md mx-auto"
          />

          <div className="mt-6">
            <Button onClick={handleConvert}>白黒にする！</Button>
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;
