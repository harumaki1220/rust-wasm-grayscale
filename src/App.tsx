import { useEffect, useRef, useState } from 'react';
import init, { apply_sepia, convert_to_grayscale, invert_colors } from '../wasm-lib/pkg';
import { Button } from './components/Button/Button';

// JavaScript版白黒変換
const convertToGrayscaleJS = (data: Uint8Array) => {
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    const gray = 0.299 * r + 0.587 * g + 0.114 * b;

    data[i] = gray;
    data[i + 1] = gray;
    data[i + 2] = gray;
  }
};

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [filterType, setFilterType] = useState<'grayscale' | 'invert' | 'sepia'>('grayscale');
  const [benchmark, setBenchmark] = useState<{ wasm: number; js: number } | null>(null);
  const [files, setFiles] = useState([]);

  // WASMの読み込み
  useEffect(() => {
    init();
    console.log('WASM Initialized');
  }, []);

  const loadFileToCanvas = (file: File) => {
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      loadFileToCanvas(files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      loadFileToCanvas(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleConvert = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const imageData = ctx.getImageData(0, 0, width, height);

    const inputDataWasm = new Uint8Array(imageData.data);
    const startWasm = performance.now();

    switch (filterType) {
      case 'grayscale':
        convert_to_grayscale(inputDataWasm, width, height);
        break;
      case 'invert':
        invert_colors(inputDataWasm, width, height);
        break;
      case 'sepia':
        apply_sepia(inputDataWasm, width, height);
        break;
    }
    const endWasm = performance.now();
    const timeWasm = endWasm - startWasm;

    const inputDataJS = new Uint8Array(imageData.data);
    let timeJS = 0;

    if (filterType === 'grayscale') {
      const startJS = performance.now();
      convertToGrayscaleJS(inputDataJS);
      const endJS = performance.now();
      timeJS = endJS - startJS;
    }

    setBenchmark({ wasm: timeWasm, js: timeJS });

    const newImageData = new ImageData(new Uint8ClampedArray(inputDataWasm.buffer), width, height);
    ctx.putImageData(newImageData, 0, 0);
  };

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
        <h1 className="text-4xl font-bold">Rust Wasm Grayscale Converter</h1>

        <div
          className="p-8 border border-gray-600 rounded-xl bg-gray-800 shadow-lg transition-colors hover:border-indigo-500"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
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

          {benchmark && (
            <div className="mt-6 p-4 bg-gray-900 rounded-lg border border-gray-700 text-left w-full max-w-md mx-auto">
              <h3 className="text-lg font-bold mb-3 text-indigo-400 border-b border-gray-700 pb-2">
                ⚡ Speed Test Result
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-800 p-3 rounded border border-indigo-500/50">
                  <p className="text-xs text-gray-400 mb-1">Rust (Wasm)</p>
                  <p className="text-2xl font-mono text-indigo-300 font-bold">
                    {benchmark.wasm.toFixed(2)} <span className="text-sm font-normal">ms</span>
                  </p>
                </div>
                {filterType === 'grayscale' && (
                  <div className="bg-gray-800 p-3 rounded border border-gray-600">
                    <p className="text-xs text-gray-400 mb-1">JavaScript</p>
                    <p className="text-2xl font-mono text-gray-300 font-bold">
                      {benchmark.js.toFixed(2)} <span className="text-sm font-normal">ms</span>
                    </p>
                  </div>
                )}
              </div>
              {filterType === 'grayscale' && benchmark.js > 0 && (
                <p className="mt-3 text-sm text-center text-gray-400">
                  Wasm is{' '}
                  <span className="text-emerald-400 font-bold text-lg">
                    {(benchmark.js / benchmark.wasm).toFixed(1)}x
                  </span>{' '}
                  faster!
                </p>
              )}
            </div>
          )}

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
              色反転
            </label>
            <label className="flex items-center gap-2 cursor-pointer hover:text-indigo-400 transition-colors">
              <input
                type="radio"
                name="filter"
                checked={filterType === 'sepia'}
                onChange={() => setFilterType('sepia')}
                className="cursor-pointer accent-indigo-500"
              />
              セピア
            </label>
          </div>

          <div className="mt-6 flex justify-center gap-4">
            <Button onClick={handleConvert}>フィルターを適用</Button>
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
