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

          console.log('resulting on profile === ', resultingArray)

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
    <div className={`${styles.flexCol} justify-center h-screen`}>
      <HashLoader color="#f4fffd" size={100} loading />
    </div>
  ) : profileNFT && profileNFT.length > 0 ? (
    <div
      className={`${styles.flexCol} ${styles.main_container} h-[calc(100%-100px)] mt-24`}
    >
      <div className={`${styles.gridContainerNFT} ${styles.example}`}>
        {profileNFT.map((nft, idx) => {
          return <NFTCard key={idx} nft={nft} isProfile={true}></NFTCard>;
        })}
      </div>
    </div>
  ) : (
    <div className="">
      <h2 className="text-white text-5xl w-full flex justify-center">
        You did not mint any NFT yet!
      </h2>
    </div>
  );
};

export default Profile;
