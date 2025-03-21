import { React, Fragment, useState, useEffect, useContext } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useAccount } from "wagmi";
import {
  readContract,
  writeContract,
  waitForTransactionReceipt,
} from "@wagmi/core";
import { ScaleLoader } from "react-spinners";
import toast, { toastConfig } from "react-simple-toasts";
import "react-simple-toasts/dist/theme/light.css"; // choose your theme
import { initialFetch, getOwnerNFTFetch } from "../../utils/FetchNFT";
import SellTokenInput from "./SellInputComponent";
import SellTokenOutput from "./SellOutputComponent";
import { config } from "../config/newConfig";
import tokenABI from "../../contract/ABI/HYBRIDS.json";
import nftABI from "../../contract/ABI/HYBRIDSWRAPPER.json";
import { NFTContext } from "../../utils/context";
import { exConfig } from "../config/exConfig";

export default function MultiWrapModal({ isModal, setIsModal, isProfile }) {
  const {
    setIsLoading,
    setAllNFT,
    setProfileNFT,
    tokenBal,
    setTokenBal,
    nftBal,
    setNFTBal,
    selectList,
    setSelectList,
    unSelectList,
    setUnSelectList,
  } = useContext(NFTContext);

  const [loading, setLoading] = useState(false);

  const tokenAddr = process.env.NEXT_PUBLIC_BOHEDZ_TOKEN_ADDRESS;
  const contractAddr = process.env.NEXT_PUBLIC_BOHEDZ_WRAPPER_ADDRESS;

  const toast_string = isProfile
    ? "Multi Unwrap is done successfully"
    : "Multi Wrap is done successfully";

  const { address } = useAccount();

  toastConfig({ theme: "light" }); // configure global toast settings, like theme

  useEffect(() => {
    const fetchMarketPrices = async () => {
      if (address) {
        const tokenBalance = await readContract(exConfig, {
          address: tokenAddr,
          abi: tokenABI,
          functionName: "balanceOf",
          args: [address],
          chainId: 1,
        });

        const nftBalance = await readContract(exConfig, {
          address: contractAddr,
          abi: nftABI,
          functionName: "balanceOf",
          args: [address],
          chainId: 1,
        });

        setTokenBal(Number(tokenBalance) / 10 ** 18);
        setNFTBal(Number(nftBalance));
      }
    };

    fetchMarketPrices();
  }, [address]);

  const closeModal = () => {
    setIsModal(false);
  };

  const clickWrap = async () => {
    const tokenIDs = isProfile
      ? unSelectList.map((data) => data.metadata.edition)
      : selectList.map((data) => data.edition);
    setLoading(true);
    try {
      const contractFunction = isProfile ? "batchUnwrap" : "batchWrap";
      const result = await writeContract(exConfig, {
        address: tokenAddr,
        abi: tokenABI,
        functionName: contractFunction,
        args: [tokenIDs],
      });

      if (!result) {
        setLoading(false);
        console.error(`Failed to execute ${"wrap"} function on contract`);
        throw new Error("Transaction Failed");
      }

      const transaction = await waitForTransactionReceipt(exConfig, {
        hash: result,
      });

      if (!transaction) {
        console.error("Receipt failed");
        setLoading(false);
        throw new Error("Receipt Failed");
      } else {
        const tokenBalance = await readContract(exConfig, {
          address: tokenAddr,
          abi: tokenABI,
          functionName: "balanceOf",
          args: [address],
        });

        const nftBalance = await readContract(exConfig, {
          address: contractAddr,
          abi: nftABI,
          functionName: "balanceOf",
          args: [address],
        });

        setTokenBal(Number(tokenBalance) / 10 ** 18);
        setNFTBal(Number(nftBalance));
        setLoading(false);
        setSelectList([]);
        setUnSelectList([]);
        await reFetchNFT(isProfile);
      }
    } catch (error) {
      setLoading(false);
      if (error.code === 4001) {
        console.log("Transaction was not approved by user.");
      } else {
        console.error(error);
      }
    }
  };

  const reFetchNFT = async (isProfile) => {
    setIsLoading(true);
    toast(toast_string);
    setIsModal(false);
    try {
      if (isProfile) {
        const result = await getOwnerNFTFetch(address);
        const resultingArray = result.filter(
          (value) =>
            value.contract.address.toLowerCase() === contractAddr.toLowerCase()
        );
        setProfileNFT(resultingArray);
        setIsLoading(false);
      } else {
        const result = await initialFetch(1, 100);
        const getWrappedTokens = await readContract(exConfig, {
          address: contractAddr,
          abi: nftABI,
          functionName: "getWrappedTokenIds",
        });
        const transformedIDS = getWrappedTokens.map((id) => Number(id));

        const resultingArray = result.filter(
          (value) => !transformedIDS.includes(value.edition)
        );
        setAllNFT(resultingArray);
        setIsLoading(false);
      }
    } catch (err) {
      console.log("err === ", err);
      setIsLoading(false);
    }
  };

  return (
    <>
      <Transition appear show={isModal} as={Fragment}>
        <Dialog as="div" className="relative z-40" onClose={closeModal}>
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <div className="fixed inset-0 flex w-screen items-center bg-[#000000e6] justify-center p-4 backdrop-blur-sm">
                  <Dialog.Panel className="w-full max-w-[30rem] transform overflow-hidden rounded-[20px] shadow bg-[#14253d] text-left align-middle transition-all">
                    <div className="flex flex-col mx-auto p-4 rounded-[20px] bg-[#14253d] justify-between gap-4">
                      <div className="relative flex flex-col w-full gap-4">
                        {isProfile ? (
                          <>
                            <div>
                              <SellTokenOutput
                                nftBal={nftBal}
                                setNFTBal={setNFTBal}
                                number={
                                  isProfile
                                    ? unSelectList.length
                                    : selectList.length
                                }
                              />
                            </div>
                            <div>
                              <SellTokenInput
                                isProfile={isProfile}
                                tokenBal={tokenBal}
                                setTokenBal={setTokenBal}
                                number={
                                  isProfile
                                    ? unSelectList.length
                                    : selectList.length
                                }
                              />
                            </div>
                          </>
                        ) : (
                          <>
                            <div>
                              <SellTokenInput
                                isProfile={isProfile}
                                tokenBal={tokenBal}
                                setTokenBal={setTokenBal}
                                number={
                                  isProfile
                                    ? unSelectList.length
                                    : selectList.length
                                }
                              />
                            </div>
                            <div>
                              <SellTokenOutput
                                nftBal={nftBal}
                                setNFTBal={setNFTBal}
                                number={
                                  isProfile
                                    ? unSelectList.length
                                    : selectList.length
                                }
                              />
                            </div>
                          </>
                        )}
                      </div>
                      <button
                        className={`${
                          loading || (isProfile ? nftBal < 1 : tokenBal < 1)
                            ? "cursor-not-allowed"
                            : ""
                        } flex w-full bg-[#1C76FF] rounded-[20px] h-16 justify-center items-center text-white text-2xl font-[Inter] cursor hover:text-gray-300 hover:bg-blue-500 transition-transform duration-200 ease-in-out hover:scale-[1.02]`}
                        onClick={() => {
                          if (
                            !loading &&
                            (isProfile ? nftBal >= 1 : tokenBal >= 1)
                          ) {
                            clickWrap();
                          }
                        }}
                      >
                        {loading ? (
                          <div className="w-full h-full flex justify-center items-center">
                            <ScaleLoader
                              color="#ffffff"
                              margin={1}
                              height={20}
                            />
                          </div>
                        ) : isProfile ? (
                          "Multi-UnWrap"
                        ) : (
                          "Multi-Wrap"
                        )}
                      </button>
                    </div>
                  </Dialog.Panel>
                </div>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
