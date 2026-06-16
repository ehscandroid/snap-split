import { createRoot } from 'react-dom/client';
import './style/app.css';
import App from './App';
import { ThemeProvider } from './context/ThemeContext';
import { AccentProvider } from './context/AccentContext';

const container = document.getElementById('root')!;
const root = createRoot(container);

const Main = () => {

  return (
    <ThemeProvider>
      <AccentProvider>
        <App />
      </AccentProvider>
    </ThemeProvider>
  );
};

root.render(<Main />);