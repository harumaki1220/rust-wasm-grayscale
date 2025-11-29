import { useState } from 'react';
import styles from './App.module.css';
import { Button } from './components/Button/Button';

function App() {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    setCount((currentCount) => currentCount + 1);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Vite + React + TS Starter</h1>
        <p>A clean and robust starter template.</p>
        <div className={styles.card}>
          <Button onClick={handleClick}>count is {count}</Button>
          <p>
            Edit <code>src/App.tsx</code> and save to test HMR
          </p>
        </div>
      </header>
    </div>
  );
}

export default App;
