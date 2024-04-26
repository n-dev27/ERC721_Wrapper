import React, { useState, useEffect, useContext } from "react";
import { useAccount } from "wagmi";
import NFTCard from "../components/NFTCard";
import styles from "../styles/index.module.css";
import { getOwnerNFTFetch } from "../utils/FetchNFT";
import { NFTContext } from "../utils/context";

const Profile = () => {
  const { profileNFT, setProfileNFT } = useContext(NFTContext);
  const { address } = useAccount();

  useEffect(() => {
    const fetchData = async () => {
      if (address) {
        try {
          let nfts;
          nfts = await getOwnerNFTFetch(address);
          const resultingArray = nfts.filter(
            (value) =>
              value.contract.address.toLowerCase() ===
              process.env.NEXT_PUBLIC_HYBRIDS_WRAPPER_ADDRESS.toLowerCase()
          );

          setProfileNFT(resultingArray);
        } catch (err) {
          console.error(err);
        }
      }
    };
    fetchData();
  }, [address]);

  return (
    <div className={`${styles.flexCol} ${styles.main_container}`}>
      <div className={styles.gridContainerNFT}>
        {profileNFT &&
          profileNFT.length > 0 &&
          profileNFT.map((nft, idx) => {
            return <NFTCard key={idx} nft={nft} isProfile={true}></NFTCard>;
          })}
      </div>
    </div>
  );
};

export default Profile;
