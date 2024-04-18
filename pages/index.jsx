import { useState, useEffect } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import NFTCard from "../components/NFTCard";
import styles from "../styles/index.module.css";
import { initialFetch } from "../utils/FetchNFT";

const Home = () => {
  const [NFTs, setNFTs] = useState([]);

  useEffect(() => {
    (async () => {
      let nfts;
      nfts = await initialFetch();
      setNFTs(nfts);
    })();
  }, []);

  return (
    <div className={`${styles.flexCol} ${styles.main_container}`}>
      <div className="flex p-3">
        <ConnectButton />
      </div>
      <div className={styles.gridContainerNFT}>
        {NFTs.length &&
          NFTs.map((nft, idx) => {
            return <NFTCard key={idx} nft={nft}></NFTCard>;
          })}
      </div>
    </div>
  );
};

export default Home;
