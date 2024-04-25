import { useState, useEffect, useContext } from "react";
import NFTCard from "../components/NFTCard";
import styles from "../styles/index.module.css";
import { initialFetch } from "../utils/FetchNFT";
import { config } from "../components/config/config";
import { readContract } from "@wagmi/core";
import nftABI from "../contract/ABI/HYBRIDSWRAPPER.json";
import { NFTContext } from "../utils/context";

const Home = () => {
  const { allNFT, setAllNFT } = useContext(NFTContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let nfts;
        nfts = await initialFetch();
        const getWrappedTokens = await readContract(config, {
          address: process.env.NEXT_PUBLIC_HYBRIDS_WRAPPER_ADDRESS,
          abi: nftABI,
          functionName: "getWrappedTokenIds",
        });
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
  }, []);

  return (
    <div className={`${styles.flexCol} ${styles.main_container}`}>
      <div className={styles.gridContainerNFT}>
        {allNFT &&
          allNFT.length &&
          allNFT.map((nft, idx) => {
            return <NFTCard key={idx} nft={nft} isProfile={false}></NFTCard>;
          })}
      </div>
    </div>
  );
};

export default Home;
