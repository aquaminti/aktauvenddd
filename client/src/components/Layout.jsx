import Navbar from './Navbar';
import Footer from './Footer';
import PageTransition from './PageTransition';

export default function Layout() {
  return (
    <>
      <Navbar />
      <main>
        <PageTransition />
      </main>
      <Footer />
    </>
  );
}
