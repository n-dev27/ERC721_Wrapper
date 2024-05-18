"use client";

import React, { useEffect, useContext } from "react";
import { HashLoader } from "react-spinners";
import NFTCard from "../components/NFTCard";
import styles from "../styles/index.module.css";
import { initialFetch } from "../utils/FetchNFT";
import { config } from "../components/config/config";
import { readContract } from "@wagmi/core";
import nftABI from "../contract/ABI/HYBRIDSWRAPPER.json";
import { NFTContext } from "../utils/context";

const contractAddr = process.env.NEXT_PUBLIC_BOHEDZ_WRAPPER_ADDRESS;

const Home = () => {
  const {
    isLoading,
    setIsLoading,
    selectList,
    setSelecetList,
    allNFT,
    setAllNFT,
  } = useContext(NFTContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        let nfts;
        nfts = await initialFetch();
        console.log("nfts === ", nfts);
        const getWrappedTokens = await readContract(config, {
          address: contractAddr,
          abi: nftABI,
          functionName: "getWrappedTokenIds",
          chainId: 84532,
        });

        const transformedIDS = getWrappedTokens.map((id) => Number(id));
        const resultingArray = nfts.filter(
          (value) => !transformedIDS.includes(value.edition)
        );
        setAllNFT(resultingArray);
        setIsLoading(false);
      } catch (err) {
        console.error(err);
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return isLoading ? (
    <div className={`${styles.flexCol} h-screen`}>
      <HashLoader color="#f4fffd" size={100} loading />
    </div>
  ) : allNFT && allNFT.length > 0 ? (
    <div
      className={`${styles.flexCol} ${styles.main_container} h-[calc(100%-100px)] mt-24`}
    >
      <div className={`${styles.gridContainerNFT}`}>
        {allNFT.map((nft, idx) => {
          return <NFTCard key={idx} nft={nft} isProfile={false}></NFTCard>;
        })}
      </div>
    </div>
  ) : (
    <div className="w-full">
      <h2 className="text-white text-5xl w-full flex justify-center">
        There is no NFT to mint!
      </h2>
    </div>
  );
};

export default Home;
