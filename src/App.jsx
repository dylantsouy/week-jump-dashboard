import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import Login from '@/pages/Login';
import NotFound from '@/pages/NotFound';
import { useRoutes } from 'react-router-dom';
import Compose from '@/providers/Compose';
import Theme from '@/providers/Theme';
import DateAdapterProvider from '@/providers/DateAdapterProvider';
import Snackbar from '@/providers/Snackbar';
import Sidebar from '@/components/Sidebar';
import ConfirmModal from './components/ConfirmModal';
import Jump from './pages/Jump';
import Observe from './pages/Observe';
import Contract from './pages/Contract';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-material.min.css';
import Target from './pages/Target';
import Loan from './pages/Loan';

function App() {
    let element = useRoutes([
        {
            path: '/dashboard',
            element: (
                <ProtectedRoute>
                    <Target />
                </ProtectedRoute>
            ),
        },
        {
            path: '/jump',
            element: (
                <ProtectedRoute>
                    <Jump />
                </ProtectedRoute>
            ),
        },
        // {
        //     path: '/observe',
        //     element: (
        //         <ProtectedRoute>
        //             <Observe />
        //         </ProtectedRoute>
        //     ),
        // },
        {
            path: '/loan',
            element: (
                <ProtectedRoute>
                    <Loan />
                </ProtectedRoute>
            ),
        },
        {
            path: '/contract',
            element: (
                <ProtectedRoute>
                    <Contract />
                </ProtectedRoute>
            ),
        },
        {
            path: '/login',
            element: (
                <PublicRoute>
                    <Login />
                </PublicRoute>
            ),
        },
        {
            path: '/',
            element: <Navigate to='/dashboard' replace />,
        },
        {
            path: '*',
            element: <NotFound />,
        },
    ]);
    return <Compose components={[Theme, Snackbar, DateAdapterProvider]}>{element}</Compose>;
}

export const PublicRoute = ({ children }) => {
    const token = useAuthStore((state) => state.token);
    const isAuthenticated = !!token;

    if (isAuthenticated) {
        // user is already logged in, redirecting to the logged-in (登入後) page.
        return <Navigate to='/dashboard' />;
    }
    return <>{children}</>;
};

export const ProtectedRoute = ({ children }) => {
    const token = useAuthStore((state) => state.token);
    const isAuthenticated = !!token;

    if (!isAuthenticated) {
        // user is not authenticated, redirecting to the login page.
        return <Navigate to='/login' />;
    }
    return (
        <div className='main'>
            <Sidebar />
            {children}
            <ConfirmModal />
        </div>
    );
};

export default App;
