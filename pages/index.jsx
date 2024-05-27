"use client";

import React, { useEffect, useContext, useState } from "react";
import axios from "axios";
import InfiniteScroll from 'react-infinite-scroll-component';
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
    allNFT,
    setAllNFT,
  } = useContext(NFTContext);

  const [hasMore, setHasMore] = useState(true);
  const [fromIndex, setFromIndex] = useState(1);
  const [toIndex, setToIndex] = useState(100);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        let nfts;
        nfts = await initialFetch(fromIndex, toIndex);
        console.log("nfts === ", nfts);
        const getWrappedTokens = await readContract(config, {
          address: contractAddr,
          abi: nftABI,
          functionName: "getWrappedTokenIds",
          chainId: 42161,
        });

        const transformedIDS = getWrappedTokens.map((id) => Number(id));
        const resultingArray = nfts.filter(
          (value) => !transformedIDS.includes(value.edition)
        );
        setAllNFT(resultingArray);
        setIsLoading(false);
        setFromIndex(101);
        setToIndex(200);
      } catch (err) {
        console.error(err);
        setIsLoading(false);
      }
    };
    fetchData();
    // fetchMoreData()
  }, []);

  const fetchMoreData = () => {
    console.log('fetchData === ', fromIndex)
    const params = {
      fromIndex: fromIndex,
      toIndex: toIndex
    }
    const base = process.env.NEXT_PUBLIC_IPFS_URL_LOCAL + "api/token/test";
    axios.get(base, {
      params: params
    }).then(res => {
      console.log('res === ', res)
      setAllNFT((prevNFT) => [...prevNFT, ...res.data.data]);
      res.data.data.length > 0 ? setHasMore(true) : setHasMore(false)
    }).catch(err => console.log('fetch Error'))

    setFromIndex(fromIndex + 100);
    setToIndex(toIndex + 100);
  }

  return isLoading ? (
    <div className={`${styles.flexCol} justify-center h-full`}>
      <HashLoader color="#f4fffd" size={100} loading />
    </div>
  ) : allNFT && allNFT.length > 0 ? (
      <InfiniteScroll
        dataLength={allNFT.length}
        next={fetchMoreData}
        hasMore={true}
        loader={
          <div className={`abosulte flex items-center justify-center`}>
            <HashLoader color="black" size={40} loading />
          </div>
        }
      >
        <div className={`${styles.gridContainerNFT}`}>
          {allNFT.map((nft, idx) => {
            return <NFTCard key={idx} nft={nft} isProfile={false}></NFTCard>;
          })}
        </div>
      </InfiniteScroll>
  ) : (
    <div className="w-full">
      <h2 className="text-white text-5xl w-full flex justify-center">
        There is no NFT to mint!
      </h2>
    </div>
  );
};

export default Home;
