import React from 'react';
import ResponsiveView from './components/ResponsiveView';
import { ThemeProvider } from './contexts/ThemeContext';
import { ProcessProvider } from './contexts/ProcessContext';

const App: React.FC = () => {

  return (
    <ThemeProvider>
      <ProcessProvider>
        <ResponsiveView />
      </ProcessProvider>
    </ThemeProvider>
  )
};

export default App;