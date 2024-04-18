import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import { Providers } from "./providers";
import Header from "../components/Header";
import ScrollToTop from "../components/ScrollToTop";

function MyApp({ Component, pageProps }) {
  return (
    <Providers>
      <Header />
      <Component {...pageProps} />
      <ScrollToTop />
    </Providers>
  );
}

export default MyApp;
