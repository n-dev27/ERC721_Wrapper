import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import React, { useState } from "react";
import { Providers } from "../components/config/providers";
import Header from "../components/Header";
import ScrollToTop from "../components/ScrollToTop";
import { NFTContext } from "../utils/context";

function MyApp({ Component, pageProps }) {
  const [selectList, setSelectList] = useState([]);
  const [allNFT, setAllNFT] = useState([]);
  const [profileNFT, setProfileNFT] = useState([]);
  const [tokenBal, setTokenBal] = useState("");
  const [nftBal, setNFTBal] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Providers>
      <NFTContext.Provider
        value={{
          isLoading,
          setIsLoading,
          tokenBal,
          setTokenBal,
          nftBal,
          setNFTBal,
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
