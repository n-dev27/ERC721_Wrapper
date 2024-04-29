"use client";

import React, { useState, useEffect, useContext } from "react";
import NFTCard from "../components/NFTCard";
import styles from "../styles/index.module.css";
import { initialFetch } from "../utils/FetchNFT";
import { config } from "../components/config/config";
import { readContract } from "@wagmi/core";
import nftABI from "../contract/ABI/HYBRIDSWRAPPER.json";
import { NFTContext } from "../utils/context";

const contractAddr = process.env.NEXT_PUBLIC_HYBRIDS_WRAPPER_ADDRESS;

const Home = () => {
  const { selectList, setSelecetList, allNFT, setAllNFT } =
    useContext(NFTContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let nfts;
        nfts = await initialFetch();
        console.log("nfts === ", nfts);
        const getWrappedTokens = await readContract(config, {
          address: "0xc6c66E9641ECFcF8C4E2a9116c6f23A0f449BF47",
          abi: nftABI,
          functionName: "getWrappedTokenIds",
          chainId: 84532,
        });
        console.log("getWrappedTokens === ", getWrappedTokens);

        const transformedIDS = getWrappedTokens.map((id) => Number(id));

        const resultingArray = nfts.filter(
          (value) => !transformedIDS.includes(value.edition)
        );
        setAllNFT(resultingArray);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [selectList]);

  return (
    <div className={`${styles.flexCol} ${styles.main_container}`}>
      <div className={styles.gridContainerNFT}>
        {allNFT &&
          allNFT.length > 0 &&
          allNFT.map((nft, idx) => {
            return <NFTCard key={idx} nft={nft} isProfile={false}></NFTCard>;
          })}
      </div>
    </div>
  );
};

export default Home;
