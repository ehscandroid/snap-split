import { createRoot } from 'react-dom/client';
import './style/app.css';
import App from './App';
import { ThemeProvider } from './context/ThemeContext';

const container = document.getElementById('root')!;
const root = createRoot(container);

const Main = () => {

  return (
    <ThemeProvider>
      <App />
    </ThemeProvider>
  );
};

root.render(<Main />);