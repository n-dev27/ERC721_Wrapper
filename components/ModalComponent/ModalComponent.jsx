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
import { config } from "../config/config";
import tokenABI from "../../contract/ABI/HYBRIDS.json";
import nftABI from "../../contract/ABI/HYBRIDSWRAPPER.json";
import { NFTContext } from "../../utils/context";

export default function WrapModal({
  isModal,
  setIsModal,
  image,
  nftData,
  isProfile,
}) {
  const {
    setIsLoading,
    setAllNFT,
    setProfileNFT,
    tokenBal,
    setTokenBal,
    nftBal,
    setNFTBal,
  } = useContext(NFTContext);

  const [loading, setLoading] = useState(false);
  const [isApprove, setIsApprove] = useState(true);

  const placeholderImage = "./no-image-icon.png";
  const tokenAddr = process.env.NEXT_PUBLIC_BOHEDZ_TOKEN_ADDRESS;
  const contractAddr = process.env.NEXT_PUBLIC_BOHEDZ_WRAPPER_ADDRESS;

  const toast_string = isProfile
    ? isApprove
      ? "Approve is done successfully"
      : "Unwrap is done successfully"
    : "Wrap is done successfully";

  const { address } = useAccount();

  toastConfig({ theme: "light" }); // configure global toast settings, like theme

  useEffect(() => {
    const fetchMarketPrices = async () => {
      if (address) {
        const tokenBalance = await readContract(config, {
          address: tokenAddr,
          abi: tokenABI,
          functionName: "balanceOf",
          args: [address],
        });

        const nftBalance = await readContract(config, {
          address: contractAddr,
          abi: nftABI,
          functionName: "balanceOf",
          args: [address],
        });

        setTokenBal(Number(tokenBalance) / 10 ** 18);
        setNFTBal(Number(nftBalance));
      }
    };

    fetchMarketPrices();
  }, [address]);

  const onImageError = (e) => {
    e.target.src = placeholderImage;
  };

  const closeModal = () => {
    setIsModal(false);
  };

  const clickWrap = async () => {
    setIsApprove(true);
    if (!isApprove || !isProfile) {
      const result = await executeContract(isProfile);
      return;
    }

    if (address) {
      setLoading(true);
      try {
        const result = await writeContract(config, {
          address: contractAddr,
          abi: nftABI,
          functionName: "approve",
          args: [contractAddr, nftData.metadata.edition],
        });

        if (!result) {
          setLoading(false);
          console.error(`Failed to execute ${"wrap"} function on contract`);
          throw new Error("Transaction Failed");
        }

        const transaction = await waitForTransactionReceipt(config, {
          hash: result,
        });

        if (!transaction) {
          console.error("Receipt failed");
          setLoading(false);
          throw new Error("Receipt Failed");
        }
        toast(toast_string);
        setIsApprove(false);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        if (error.code === 4001) {
          console.log("Transaction was not approved by user.");
        } else {
          console.error(error);
        }
      }
    }
  };

  const executeContract = async (isProfile) => {
    setLoading(true);
    try {
      const contractFunction = isProfile ? "unwrap" : "wrap";
      const result = await writeContract(config, {
        address: tokenAddr,
        abi: tokenABI,
        functionName: contractFunction,
        args: [isProfile ? nftData.metadata.edition : nftData.edition],
      });

      if (!result) {
        setLoading(false);
        console.error(`Failed to execute ${"wrap"} function on contract`);
        throw new Error("Transaction Failed");
      }

      const transaction = await waitForTransactionReceipt(config, {
        hash: result,
      });

      if (!transaction) {
        console.error("Receipt failed");
        setLoading(false);
        throw new Error("Receipt Failed");
      } else {
        const tokenBalance = await readContract(config, {
          address: tokenAddr,
          abi: tokenABI,
          functionName: "balanceOf",
          args: [address],
        });

        const nftBalance = await readContract(config, {
          address: contractAddr,
          abi: nftABI,
          functionName: "balanceOf",
          args: [address],
        });

        setTokenBal(Number(tokenBalance) / 10 ** 18);
        setNFTBal(Number(nftBalance));
        setLoading(false);
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
        const result = await initialFetch();
        const getWrappedTokens = await readContract(config, {
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
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
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
                <div className="fixed inset-0 flex w-screen items-center bg-[#000000e6] justify-center p-4">
                  <Dialog.Panel className="w-full max-w-[32rem] transform overflow-hidden rounded-[20px] shadow bg-[#14253d] text-left align-middle transition-all">
                    <div className="flex flex-col mx-auto p-4 rounded-[20px] bg-[#14253d] justify-between gap-4">
                      <img
                        src={image ? image : placeholderImage}
                        alt="cover image"
                        onError={onImageError}
                        className="rounded-[20px]"
                      ></img>
                      <div className="relative flex flex-col w-full gap-4">
                        {isProfile ? (
                          <>
                            <div>
                              <SellTokenOutput
                                nftBal={nftBal}
                                setNFTBal={setNFTBal}
                              />
                            </div>
                            <div>
                              <SellTokenInput
                                tokenBal={tokenBal}
                                setTokenBal={setTokenBal}
                              />
                            </div>
                          </>
                        ) : (
                          <>
                            <div>
                              <SellTokenInput
                                tokenBal={tokenBal}
                                setTokenBal={setTokenBal}
                              />
                            </div>
                            <div>
                              <SellTokenOutput
                                nftBal={nftBal}
                                setNFTBal={setNFTBal}
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
                        } flex w-full bg-[#1C76FF] rounded-[20px] h-16 justify-center items-center text-white text-2xl cursor hover:text-gray-300 hover:bg-blue-500 transition-transform duration-200 ease-in-out hover:scale-[1.02]`}
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
                          isApprove ? (
                            "Approve"
                          ) : (
                            "UnWrap"
                          )
                        ) : (
                          "Wrap"
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
