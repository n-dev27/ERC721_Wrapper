"use client";

import React, { useEffect, useContext } from "react";
import { useAccount } from "wagmi";
import { GridLoader } from "react-spinners";
import MultiWrapModal from "../components/ModalComponent/MultiModalComponent";
import NFTCard from "../components/NFTCard";
import styles from "../styles/index.module.css";
import { getOwnerNFTFetch } from "../utils/FetchNFT";
import { NFTContext } from "../utils/context";

const Profile = () => {
  const { setSelectList, isLoading, setIsLoading, profileNFT, setProfileNFT, isMultiFlag, setIsMultiFlag } = useContext(NFTContext);
  const { address } = useAccount();

  useEffect(() => {
    setSelectList([]);
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
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-[2px] bg-black bg-opacity-60">
      <GridLoader color="#36d7b7" />
    </div>
  ) : profileNFT && profileNFT.length > 0 ? (
    <>
      <div
        className={`${styles.flexCol} ${styles.main_container} h-[calc(100%-40px)]`}
      >
        <div className={`${styles.gridContainerNFT} ${styles.example} w-full`}>
          {profileNFT.map((nft, idx) => {
            return <NFTCard key={idx} nft={nft} isProfile={true}></NFTCard>;
          })}
        </div>
      </div>
      <MultiWrapModal
        isModal={isMultiFlag}
        setIsModal={setIsMultiFlag}
        isProfile={true}
      />
    </>
  ) : (
    <div className="">
      <h2 className="text-white text-5xl font-[Inter] w-full flex justify-center">
        You did not mint any NFT yet!
      </h2>
    </div>
  );
};

export default Profile;
