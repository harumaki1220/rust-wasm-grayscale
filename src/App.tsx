import { useEffect, useRef, useState } from 'react';
import init, { convert_to_grayscale, invert_colors } from '../wasm-lib/pkg';
import { Button } from './components/Button/Button';

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [filterType, setFilterType] = useState<'grayscale' | 'invert'>('grayscale');

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

  const handleConvert = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const imageData = ctx.getImageData(0, 0, width, height);
    const inputData = new Uint8Array(imageData.data.buffer);

    switch (filterType) {
      case 'grayscale':
        convert_to_grayscale(inputData, width, height);
        break;
      case 'invert':
        invert_colors(inputData, width, height);
        break;
    }
    const newImageData = new ImageData(new Uint8ClampedArray(inputData.buffer), width, height);
    ctx.putImageData(newImageData, 0, 0);
  };

  // 画像をダウンロードする処理
  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const imageURL = canvas.toDataURL('image/png');

    const link = document.createElement('a');
    link.href = imageURL;
    link.download = 'filtered_image.png';
    link.click();
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

          <div className="mt-4 flex justify-center gap-6 p-4 bg-gray-800 rounded-lg border border-gray-700">
            <label className="flex items-center gap-2 cursor-pointer hover:text-indigo-400 transition-colors">
              <input
                type="radio"
                name="filter"
                checked={filterType === 'grayscale'}
                onChange={() => setFilterType('grayscale')}
                className="cursor-pointer accent-indigo-500"
              />
              白黒
            </label>
            <label className="flex items-center gap-2 cursor-pointer hover:text-indigo-400 transition-colors">
              <input
                type="radio"
                name="filter"
                checked={filterType === 'invert'}
                onChange={() => setFilterType('invert')}
                className="cursor-pointer accent-indigo-500"
              />
              反転
            </label>
          </div>

          <div className="mt-6">
            <Button onClick={handleConvert}>白黒にする！</Button>
            <button
              onClick={handleDownload}
              className="
                rounded-lg border border-transparent 
                px-5 py-2.5 
                text-base font-medium 
                bg-emerald-600 text-white 
                cursor-pointer 
                transition-colors duration-250
                hover:bg-emerald-700
                focus:outline-none focus:ring-2 focus:ring-emerald-500
              "
            >
              画像を保存
            </button>
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;
