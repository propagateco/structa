import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Legal from './pages/Legal';
import { ThemeProvider } from './components/theme-provider';

function App() {
    return (
        <ThemeProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Landing />} />
                    <Route path="/legal" element={<Legal />} />
                </Routes>
            </Router>
        </ThemeProvider>
    );
}

export default App;

