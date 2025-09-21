import React from 'react';
import ResponsiveView from './components/ResponsiveView';
import { ThemeProvider } from './contexts/ThemeContext';

const App: React.FC = () => {

  return (
    <ThemeProvider>
      <ResponsiveView />
    </ThemeProvider>
  )
};

export default App;