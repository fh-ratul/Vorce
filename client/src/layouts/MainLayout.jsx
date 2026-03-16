import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const MainLayout = () => (
  <div className="min-h-screen bg-transparent text-ivory">
    <Navbar />
    <main>
      <Outlet />
    </main>
    <Footer />
  </div>
);

export default MainLayout;
