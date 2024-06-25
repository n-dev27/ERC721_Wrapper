import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import React, { useState } from "react";
import Head from "next/head";
import { Providers } from "../components/config/providers";
import Header from "../components/Header";
import ScrollToTop from "../components/ScrollToTop";
import { NFTContext } from "../utils/context";
import styles from "../styles/index.module.css";

function MyApp({ Component, pageProps }) {
  const [selectList, setSelectList] = useState([]);
  const [unSelectList, setUnSelectList] = useState([]);
  const [allNFT, setAllNFT] = useState([]);
  const [profileNFT, setProfileNFT] = useState([]);
  const [tokenBal, setTokenBal] = useState("");
  const [nftBal, setNFTBal] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [avaTime, setAvaTime] = useState(false);
  const [isMultiFlag, setIsMultiFlag] = useState(false);

  return (
    <Providers>
      <NFTContext.Provider
        value={{
          avaTime,
          setAvaTime,
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
          unSelectList,
          setUnSelectList,
          isMultiFlag,
          setIsMultiFlag
        }}
      >
        <div className="flex items-center justify-center h-screen">
          <Head>
            <title>Bohedz</title>
            <link href="https://fonts.googleapis.com/css2?family=Abel&display=swap" rel="stylesheet"></link>
          </Head>
          <div className={`fixed w-full top-0 ${styles.homeCSS} -z-10`} />
            <Header />
            <Component {...pageProps}/>
            <ScrollToTop />
          </div>
      </NFTContext.Provider>
    </Providers>
  );
}

export default MyApp;
