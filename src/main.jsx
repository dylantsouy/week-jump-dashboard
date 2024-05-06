import ReactDOM from 'react-dom/client';
import App from '@/App.jsx';
import '@/index.scss';
import { BrowserRouter as Router } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')).render(
    <Router basename={'/week-jump-dashboard'}>
        <App />
    </Router>
);
