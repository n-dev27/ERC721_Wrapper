"use client";

import React, { useEffect, useContext, useState, useCallback } from "react";
import { GridLoader } from "react-spinners";
import NFTCard from "../components/NFTCard";
import styles from "../styles/index.module.css";
import { initialFetch } from "../utils/FetchNFT";
import { NFTContext } from "../utils/context";
import { List } from 'immutable';
import InfiniteScroll from "react-infinite-scroll-component";

const Home = () => {
  const {
    setUnSelectList,
    isLoading,
    setIsLoading,
    setAllNFT,
  } = useContext(NFTContext);

  // const [indices, setIndices] = useState({ fromIndex: 0, toIndex: 99 });
  // const [subIsLoading, setSubIsLoading] = useState(false);
  // const [hasMore, setHasMore] = useState(false);

  // const fetchData = useCallback(async () => {
  //   try {
  //     setIsLoading(true);
  //     const nfts = await initialFetch(indices.fromIndex, indices.toIndex);

  //     if (nfts.data.isEndOfArray) {
  //       setHasMore(true);
  //     } else {
  //       setHasMore(false);
  //       setIndices({ fromIndex: indices.fromIndex + 100, toIndex: indices.toIndex + 100 });
  //     }

  //     setAllNFT(nfts.data.data);
  //     setIsLoading(false);
  //   } catch (err) {
  //     console.error('Initial fetch error:', err);
  //     setIsLoading(false);
  //   }
  // }, []);

  // useEffect(() => {
  //   fetchData();
  // }, [fetchData]);

  // const fetchMoreData = useCallback(() => {
  //   setSubIsLoading(true);
  //   const params = {
  //     fromIndex: indices.fromIndex,
  //     toIndex: indices.toIndex
  //   }
  //   const base = process.env.NEXT_PUBLIC_IPFS_URL + "api/token/test";
    
  //   axios.get(base, {
  //     params: params
  //   }).then(res => {

  //     if (res.data.isEndOfArray) {
  //       setHasMore(true);
  //     } else {
  //       setHasMore(false);
  //       setIndices({
  //         fromIndex: indices.fromIndex + 100,
  //         toIndex: indices.toIndex + 100
  //       });
  //     }

  //     setAllNFT((prevNFT) => [...prevNFT, ...res.data.data]);
  //   }).catch(err => {
  //     console.error('Fetch more data error:', err);
  //   })
  //   .finally(() => {
  //     setSubIsLoading(false);
  //   });
  // }, [indices, setAllNFT]);

  // useEffect(() => {
  //   const handleScroll = (event) => {
  //     const isPageBottom = event.target.scrollHeight - event.target.scrollTop === event.target.clientHeight;

  //     if (isPageBottom && !hasMore && !subIsLoading) {
  //       fetchMoreData();
  //     }
  //   };

  //   const container = document.getElementById('infinite-scroll');
  //   if (container) {
  //     container.addEventListener('scroll', handleScroll);
  //     return () => container.removeEventListener('scroll', handleScroll);
  //   }

  // }, [hasMore, subIsLoading, fetchMoreData]);
  const PAGE_SIZE = 20;

  const [data, setData] = useState(List());
  const [hasMore, setHasMore] = useState(true);
  const [from, setFrom] = useState(0);  // Start index for the data to fetch
  const [to, setTo] = useState(PAGE_SIZE - 1);
  const [subLoading, setSubIsLoading] = useState(false);

  const Loader = (isLoading) => {
    if (isLoading) return null;

    return <div className="fixed inset-0 flex items-center justify-center backdrop-blur-[2px] bg-black bg-opacity-60">
    <GridLoader color="#36d7b7" />
  </div>;
  }

  const fetchData = async () => {
    setUnSelectList([]);
    try {
      if (from === 0) setIsLoading(true);
      setSubIsLoading(true);
      const response = await initialFetch(from, to);
      setData(prevData => prevData.concat(List(response.data.data)));
      setAllNFT(prevData => prevData.concat(response.data.data))
      setFrom(to + 1);
      setTo(to + PAGE_SIZE);
      setHasMore(!response.data.data.isEndOfArray)
      if (from === 0) setIsLoading(false);
      setSubIsLoading(false);
    } catch (error) {
      if (from === 0) setIsLoading(false);
      setSubIsLoading(false);
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const loadMore = async () => {
    await fetchData();
  };

  return isLoading ? (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-[2px] bg-black bg-opacity-60">
      <GridLoader color="#36d7b7" />
    </div>
  ) : data && data.size > 0 ? (
    <InfiniteScroll
      className={`${styles.gridContainerNFT} ${styles.example} w-full overflow-y-auto`}
      dataLength={data.size} // This is important field to render the next data
      next={loadMore}
      hasMore={hasMore}
      loader={<Loader isLoading={subLoading} />}
      endMessage={
        <p style={{ textAlign: 'center' }}>
          <b>Yay! You have seen it all</b>
        </p>
      }
    >
      {data.map((nft, index) => (
        <NFTCard key={index} nft={nft} isProfile={false}></NFTCard>
      ))}
    </InfiniteScroll>
  ) : (
    <div className="w-full text-white text-center">
      <h2 className="text-5xl font-[Inter]">
        There is no NFT to mint!
      </h2>
    </div>
  );
};

export default Home;