"use client";

import React, { useEffect, useContext, useState, useCallback } from "react";
import axios from "axios";
import { HashLoader, GridLoader } from "react-spinners";
import NFTCard from "../components/NFTCard";
import styles from "../styles/index.module.css";
import { initialFetch } from "../utils/FetchNFT";
import { NFTContext } from "../utils/context";

const Home = () => {
  const {
    isLoading,
    setIsLoading,
    allNFT,
    setAllNFT,
  } = useContext(NFTContext);

  const [indices, setIndices] = useState({ fromIndex: 0, toIndex: 99 });
  const [subIsLoading, setSubIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const nfts = await initialFetch(indices.fromIndex, indices.toIndex);
      console.log('nfts === ', nfts)

      if (nfts.data.isEndOfArray) {
        setHasMore(true);
      } else {
        setHasMore(false);
        setIndices({ fromIndex: indices.fromIndex + 100, toIndex: indices.toIndex + 100 });
      }

      setAllNFT(nfts.data.data);
      setIsLoading(false);
    } catch (err) {
      console.error('Initial fetch error:', err);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const fetchMoreData = useCallback(() => {
    setSubIsLoading(true);
    const params = {
      fromIndex: indices.fromIndex,
      toIndex: indices.toIndex
    }
    const base = process.env.NEXT_PUBLIC_IPFS_URL + "api/token/test";
    
    axios.get(base, {
      params: params
    }).then(res => {
      console.log('res === ', res.data)

      if (res.data.isEndOfArray) {
        setHasMore(true);
      } else {
        setHasMore(false);
        setIndices({
          fromIndex: indices.fromIndex + 100,
          toIndex: indices.toIndex + 100
        });
      }

      setAllNFT((prevNFT) => [...prevNFT, ...res.data.data]);
    }).catch(err => {
      console.error('Fetch more data error:', err);
    })
    .finally(() => {
      setSubIsLoading(false);
    });
  }, [indices, setAllNFT]);

  useEffect(() => {
    const handleScroll = (event) => {
      const isPageBottom = event.target.scrollHeight - event.target.scrollTop === event.target.clientHeight;

      if (isPageBottom && !hasMore && !subIsLoading) {
        fetchMoreData();
      }
    };

    const container = document.getElementById('infinite-scroll');
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }

  }, [hasMore, subIsLoading, fetchMoreData]);

  return isLoading ? (
    <div className={`${styles.flexCol} justify-center h-full`}>
      <HashLoader color="#f4fffd" size={100} loading />
    </div>
  ) : allNFT && allNFT.length > 0 ? (
      <div id="infinite-scroll" className={`${styles.gridContainerNFT} ${styles.example} w-full overflow-y-auto`}>
        {allNFT.map((nft, index) => {
          return <NFTCard key={index} nft={nft} isProfile={false}></NFTCard>; // Assuming each NFT has a unique 'id' property
        })}
      {subIsLoading && (
          <div className="fixed inset-0 flex items-center justify-center backdrop-blur-[2px] bg-black bg-opacity-60">
            <GridLoader color="#36d7b7" />
          </div>
      )}
      </div>
  ) : (
    <div className="w-full text-white text-center">
      <h2 className="text-5xl font-[Inter]">
        There is no NFT to mint!
      </h2>
    </div>
  );
};

export default Home;