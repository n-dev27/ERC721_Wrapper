import axios from "axios";

const api_key = process.env.NEXT_PUBLIC_ALCHEMY_TEST_NET;
const requestOptions = {
  method: "GET",
  redirect: "follow",
};

export const fetchNFTs = async (wallet, collection = "") => {
  let nfts;
  const baseURL = `https://eth-mainnet.g.alchemy.com/v2/${api_key}/getNFTs/`;

  if (!collection.length) {
    const fetchURL = `${baseURL}?owner=${wallet}`;

    nfts = await fetch(fetchURL, requestOptions).then((data) => data.json());
  } else {
    /**
     * The "5B%5D" string right after the "contractAddresses" parameters specifies
     * that the "contractAddresses" parameter is an array and not a simple string.
     * This is because you could actually filter by multiple "contractAddresses", not just one.
     */
    const fetchURL = `${baseURL}?owner=${wallet}&contractAddresses%5B%5D=${collection}`;
    nfts = await fetch(fetchURL, requestOptions).then((data) => data.json());
  }

  if (nfts) {
    return nfts.ownedNfts;
  }
};

export const fetchNFTsForCollection = async (collection) => {
  if (collection.length) {
    const baseURL = `https://eth-mainnet.g.alchemy.com/v2/${api_key}/getNFTsForCollection/`;
    const fetchURL = `${baseURL}?contractAddress=${collection}&withMetadata=${"true"}`;
    const nfts = await fetch(fetchURL, requestOptions).then((data) =>
      data.json()
    );
    if (nfts) {
      return nfts.nfts;
    }
  }
};

export const initialFetch = async (from, to) => {
  const params = {
    fromIndex: from,
    toIndex: to
  }
  const base = process.env.NEXT_PUBLIC_IPFS_URL + "api/token/test";
  // const base = process.env.NEXT_PUBLIC_IPFS_URL_LOCAL + "api/token/test";
  const response = await axios.get(base, {
    params: params
  });
  if (response.data.data) {
    return response;
  }
};

export const getOwnerNFTFetch = async (address) => {
  // Collection Bored Ape
  const baseURL = `https://eth-mainnet.g.alchemy.com/v2/${api_key}/getNFTs/`;
  const fetchURL = `${baseURL}?owner=${address}`;
  const nfts = await fetch(fetchURL, requestOptions).then((data) =>
    data.json()
  );
  if (nfts) {
    return nfts.ownedNfts;
  }
};
