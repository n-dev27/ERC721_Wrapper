import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import { useState } from "react";
import { Providers } from "./providers";
import Header from "../components/Header";
import ScrollToTop from "../components/ScrollToTop";
import { NFTContext } from "../utils/context";

function MyApp({ Component, pageProps }) {
  const [selectList, setSelectList] = useState([]);
  const [allNFT, setAllNFT] = useState([]);
  const [profileNFT, setProfileNFT] = useState([]);

  return (
    <Providers>
      <NFTContext.Provider
        value={{
          allNFT,
          setAllNFT,
          profileNFT,
          setProfileNFT,
          selectList,
          setSelectList,
        }}
      >
        <Header />
        <Component {...pageProps} />
        <ScrollToTop />
      </NFTContext.Provider>
    </Providers>
  );
}

export default MyApp;
