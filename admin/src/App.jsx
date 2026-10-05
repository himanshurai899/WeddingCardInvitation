import { lazy, Suspense, useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Navbar } from '@admin/components/layout/Navbar';
import { Login } from '@admin/components/layout/Login';
import { VivahFooter } from '@admin/components/ui/motion-footer';
import { ToastProvider } from '@admin/components/ui/Toast';
import { ArkToastRegion } from '@admin/components/ui/basic-toast';
import { NavigationProgress } from '@admin/components/ui/NavigationProgress';
import { GradientBackground } from '@admin/components/ui/gradient-background';
import { PageLoader } from '@admin/components/ui/Spinner';
import { ThemeProvider } from '@admin/components/ui/ThemeProvider';
import { AuthProvider, useAuth } from '@admin/lib/auth';

// Each file in pages/ is a screen at /admin/<file name>, loaded on demand (recharts, jspdf and xlsx are heavy)
const pages = Object.entries(import.meta.glob('./pages/*.jsx')).map(([file, load]) => ({
  path: file.replace('./pages/', '').replace('.jsx', ''),
  Page: lazy(load),
}));

function Shell() {
  return (
    <ToastProvider>
      <ArkToastRegion />
      <NavigationProgress />
      <GradientBackground className="min-h-screen">
        <a href="#main-content" className="skip-nav">
          Skip to main content
        </a>
        <Navbar />
        <main id="main-content" className="app-main">
          <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-6">
            <Suspense fallback={<PageLoader />}>
              <Routes>
                {pages.map(({ path, Page }) => (
                  <Route key={path} path={path} element={<Page />} />
                ))}
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </Suspense>
          </div>
        </main>
        <VivahFooter />
      </GradientBackground>
    </ToastProvider>
  );
}

function Gate() {
  const { status } = useAuth();
  useEffect(() => {
    document.title = 'Vivah Admin';
  }, []);
  if (status === 'loading') return <PageLoader />;
  return status === 'authed' ? <Shell /> : <Login />;
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Gate />
      </AuthProvider>
    </ThemeProvider>
  );
}
