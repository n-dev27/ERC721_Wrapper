"use client";

import React, { useEffect, useContext } from "react";
import { useAccount } from "wagmi";
import { HashLoader } from "react-spinners";
import NFTCard from "../components/NFTCard";
import styles from "../styles/index.module.css";
import { getOwnerNFTFetch } from "../utils/FetchNFT";
import { NFTContext } from "../utils/context";

const Profile = () => {
  const { isLoading, setIsLoading, profileNFT, setProfileNFT } =
    useContext(NFTContext);
  const { address } = useAccount();

  useEffect(() => {
    const fetchData = async () => {
      if (address) {
        try {
          setIsLoading(true);
          let nfts;
          nfts = await getOwnerNFTFetch(address);
          const resultingArray = nfts.filter(
            (value) =>
              value.contract.address.toLowerCase() ===
              process.env.NEXT_PUBLIC_BOHEDZ_WRAPPER_ADDRESS.toLowerCase()
          );

          setProfileNFT(resultingArray);
          setIsLoading(false);
        } catch (err) {
          console.error(err);
          setIsLoading(false);
        }
      }
    };
    fetchData();
  }, [address]);

  return isLoading ? (
    <div className="w-full h-screen flex justify-center items-center">
      <HashLoader color="#f4fffd" size={100} loading />
    </div>
  ) : (
    <div className={`${styles.flexCol} ${styles.main_container}`}>
      <div className={styles.gridContainerNFT}>
        {profileNFT && profileNFT.length > 0 ? (
          profileNFT.map((nft, idx) => {
            return <NFTCard key={idx} nft={nft} isProfile={true}></NFTCard>;
          })
        ) : (
          <div className="w-full">
            <h2 className="text-white w-full flex justify-center">
              You did not mint any NFT yet!
            </h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
