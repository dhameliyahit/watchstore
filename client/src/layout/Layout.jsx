import Footer from "./Footer";
import Header from "./Header";

const Layout = ({ children }) => {
  return (
    <>
      <Header />
      <main className="min-h-screen max-w-full">{children}</main>
      <Footer />
    </>
  );
};

export default Layout;
