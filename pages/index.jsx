"use client";

import React, { useEffect, useContext, useState } from "react";
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

  const [fromIndex, setFromIndex] = useState(0);
  const [toIndex, setToIndex] = useState(99);
  const [subIsLoading, setSubIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        let nfts;
        nfts = await initialFetch(fromIndex, toIndex);
        
        if (nfts.data.isEndOfArray === true) {
          setHasMore(true);
        } else {
          setHasMore(false);
        }

        setAllNFT(nfts.data.data);
        setIsLoading(false);
        const object = {fromIndex: 100, toIndex: 199}
        localStorage.setItem('indexObject', JSON.stringify(object))
        setFromIndex(fromIndex + 100);
        setToIndex(toIndex + 100);
      } catch (err) {
        console.error(err);
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const fetchMoreData = () => {
    const prevFromIndex = JSON.parse(localStorage.getItem('indexObject')).fromIndex;
    const prevToIndex = JSON.parse(localStorage.getItem('indexObject')).toIndex;
    setSubIsLoading(true);
    const params = {
      fromIndex: prevFromIndex,
      toIndex: prevToIndex
    }
    const base = process.env.NEXT_PUBLIC_IPFS_URL + "api/token/test";
    // const base = process.env.NEXT_PUBLIC_IPFS_URL_LOCAL + "api/token/test";
    axios.get(base, {
      params: params
    }).then(res => {

      if (res.data.isEndOfArray === true) {
        setHasMore(true);
      } else {
        setHasMore(false);
      }

      setAllNFT((prevNFT) => [...prevNFT, ...res.data.data]);
      setSubIsLoading(false);
      const newObject = {
        fromIndex: prevFromIndex + 100,
        toIndex: prevToIndex + 100
      }
      localStorage.setItem('indexObject', JSON.stringify(newObject))
    }).catch(err => console.log('fetch Error === ', err))
  }

  const handleScroll = (event) => {
    // Determine if the user has scrolled to the bottom of the element
    const isPageBottom = event.target.scrollHeight - event.target.scrollTop === event.target.clientHeight;

    if (isPageBottom && !hasMore) {
      // Handle reaching the bottom
      fetchMoreData();
    }
  }

  useEffect(() => {
    const container = document.getElementById('infinite-scroll');
    if (container) {
      container.addEventListener('scroll', handleScroll);

      // Remove event listener on cleanup
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [hasMore, isLoading])

  return isLoading ? (
    <div className={`${styles.flexCol} justify-center h-full`}>
      <HashLoader color="#f4fffd" size={100} loading />
    </div>
  ) :
    allNFT && allNFT.length > 0 ? (
        <div id="infinite-scroll" className={`${styles.gridContainerNFT} ${styles.example} w-full overflow-y-auto`}>
          {allNFT.map((nft, idx) => {
            return <NFTCard key={idx} nft={nft} isProfile={false}></NFTCard>;
          })}
          {subIsLoading && (
            <div className="fixed inset-0 flex w-screen items-center bg-[#000000e6] justify-center p-4 backdrop-blur-[2px]">
              <GridLoader color="#36d7b7" />
            </div>
          )}
        </div>
  ) : (
    <div className="w-full">
      <h2 className="text-white text-5xl font-[Inter] w-full flex justify-center">
        There is no NFT to mint!
      </h2>
    </div>
  );
};

export default Home;