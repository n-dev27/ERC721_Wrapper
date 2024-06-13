"use client";
import Image from "next/image";
import Link from "next/link";
import { Fragment, useContext, useEffect, useState } from "react";
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/20/solid';
import { useRouter } from "next/router";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import {
  readContract,
  writeContract,
  waitForTransactionReceipt,
} from "@wagmi/core";
import { PuffLoader } from "react-spinners";
import toast, { toastConfig } from "react-simple-toasts";
import "react-simple-toasts/dist/theme/light.css"; // choose your theme
import { config } from "../config/newConfig";
import { NFTContext } from "../../utils/context";
import { initialFetch } from "../../utils/FetchNFT";
import menuData from "./menuData";
import tokenABI from "../../contract/ABI/HYBRIDS.json";
import nftABI from "../../contract/ABI/HYBRIDSWRAPPER.json";
import escrowABI from "../../contract/ABI/EscrowABI.json";

const Header = () => {
  const {
    avaTime,
    setAvaTime,
    setIsLoading,
    setAllNFT,
    selectList,
    setSelectList,
    unSelectList,
    setUnSelectList,
    setTokenBal,
    setNFTBal,
  } = useContext(NFTContext);
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [unLoading, setUnLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [openIndex, setOpenIndex] = useState(-1);
  const [sticky, setSticky] = useState(false);
  const [rewardValue, setRewardValue] = useState(0);
  const [isClaimModalFlag, setIsClaimModalFlag] = useState(false);
  const [historyFlag, setHistoryFlag] = useState(false);
  const [rewardHistory, setRewardHistory] = useState([]);

  const { address } = useAccount();
  const router = useRouter();

  const tokenAddr = process.env.NEXT_PUBLIC_BOHEDZ_TOKEN_ADDRESS;
  const contractAddr = process.env.NEXT_PUBLIC_BOHEDZ_WRAPPER_ADDRESS;
  const escrowAddr = process.env.NEXT_PUBLIC_ESCROW_NFT_HOLDER;

  toastConfig({ theme: "light" }); // configure global toast settings, like theme

  const navbarToggleHandler = () => {
    setNavbarOpen(!navbarOpen);
  };

  const handleStickyNavbar = () => {
    if (window.scrollY >= 80) {
      setSticky(true);
    } else {
      setSticky(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const availableTime = await readContract(config, {
          address: escrowAddr,
          abi: escrowABI,
          functionName: "contractDeploymentTimestamp",
          chainId: 1,
        });

        const unlockDate = (Number(availableTime) * 1000 + 7 * 24 * 60 * 60 * 1000);      
        
        // Start the countdown timer
        const interval = setInterval(() => {
          const timeNow = new Date().getTime();
          const distance = unlockDate - timeNow;

          // Time calculations for days, hours, minutes and seconds
          const days = Math.floor(distance / (1000 * 60 * 60 * 24));
          const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      
          if (distance <= 0) {
            clearInterval(interval);
            console.log('Contract deployment date reached!');
            setAvaTime(true)
          } else {
            setAvaTime({
              days: days,
              hours: hours,
              minutes: minutes,
              seconds: seconds
            })
          }
        }, 1000);

      } catch (err) {
        console.log(err);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleStickyNavbar);

    const fetchData = async () => {
      if (address) {
        try {
          const rewardResult = await readContract(config, {
            address: escrowAddr,
            abi: escrowABI,
            functionName: "checkClaimableRewards",
            args: [address],
            chainId: 1,
          });
          setRewardValue(Number(rewardResult) / 10 ** 18);
        } catch (err) {
          console.error(err);
        }
      } else {
        router.push("/");
      }
    };
    fetchData();
  }, [address]);

  const handleSubmenu = (index) => {
    if (openIndex === index) {
      setOpenIndex(-1);
    } else {
      setOpenIndex(index);
    }
  };

  const handleMultiWrap = async () => {
    setLoading(true);
    const tokenIDs = selectList.map((data) => data.edition);
    try {
      const result = await writeContract(config, {
        address: tokenAddr,
        abi: tokenABI,
        functionName: "batchWrap",
        args: [tokenIDs],
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
      setSelectList([]);
      await reFetchNFT();
    } catch (error) {
      setLoading(false);
      if (error.code === 4001) {
        console.log("Transaction was not approved by user.");
      } else {
        console.error(error);
      }
    }
  };

  const handleMultiUnWrap = async () => {
    setUnLoading(true);
    const tokenIDs = unSelectList.map((data) => data.metadata.edition);
    try {
      const result = await writeContract(config, {
        address: tokenAddr,
        abi: tokenABI,
        functionName: "batchUnwrap",
        args: [tokenIDs],
      });

      if (!result) {
        setUnLoading(false);
        console.error(`Failed to execute ${"wrap"} function on contract`);
        throw new Error("Transaction Failed");
      }

      const transaction = await waitForTransactionReceipt(config, {
        hash: result,
      });

      if (!transaction) {
        console.error("Receipt failed");
        setUnLoading(false);
        throw new Error("Receipt Failed");
      }
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
      setUnLoading(false);
      setUnSelectList([]);
      await reFetchNFT();
    } catch (error) {
      setUnLoading(false);
      if (error.code === 4001) {
        console.log("Transaction was not approved by user.");
      } else {
        console.error(error);
      }
    }
  };

  const handleClaim = async () => {
    setLoading2(true);
    try {
      const result = await writeContract(config, {
        address: escrowAddr,
        abi: escrowABI,
        functionName: "claimRewards",
        args: [address],
      });

      if (!result) {
        setLoading2(false);
        console.error(`Failed to execute ${"wrap"} function on contract`);
        throw new Error("Transaction Failed");
      }

      const transaction = await waitForTransactionReceipt(config, {
        hash: result,
      });

      if (!transaction) {
        console.error("Receipt failed");
        setLoading2(false);
        throw new Error("Receipt Failed");
      }

      const rewardResult = await readContract(config, {
        address: escrowAddr,
        abi: escrowABI,
        functionName: "checkClaimableRewards",
        args: [address],
        chainId: 1,
      });

      setRewardValue(Number(rewardResult));
      setLoading2(false);
    } catch (error) {
      setLoading2(false);
      if (error.code === 4001) {
        console.log("Transaction was not approved by user.");
      } else {
        console.error(error);
      }
    }
  };

  const handleRewardHistory = async () => {
    setHistoryFlag(true);
    try {
      const result = await readContract(config, {
        address: escrowAddr,
        abi: escrowABI,
        functionName: "calculateDailyNFTRewards",
        chainId: 1
      });

      if (!result) {
        console.error(`Failed to execute ${"reward history"} function on contract`);
        throw new Error("Transaction Failed");
      }

      const numOfReward = result.map(item => Number(item) / 10 ** 18)
      setRewardHistory(numOfReward);

    } catch(error) {
      console.log('reward history === ', error)
    }
  };

  function countLeadingZerosAfterDecimal(num) {
    let afterDecimal = num.toString().split(".")[1];

    // Count leading zeros only if there is a fractional part
    if (afterDecimal) {
      let count = 0;
      for (let i = 0; i < afterDecimal.length; i++) {
        if (afterDecimal[i] === "0") {
          count++;
        } else {
          break; // if it encounters a non-zero, break the loop
        }
      }
      return parseFloat(num).toFixed(count + 2);
    }

    // Return 0 if no fractional part
    return num;
  }

  const reFetchNFT = async () => {
    try {
      isProfile ? setUnLoading(true) : setIsLoading(true);
      toast(isProfile? "MultiUnwrap is done successfully" : "MultiWrap is done successfully");
      const result = await initialFetch(0, 99);
      const getWrappedTokens = await readContract(config, {
        address: contractAddr,
        abi: nftABI,
        functionName: "getWrappedTokenIds",
      });

      const transformedIDS = getWrappedTokens.map((id) => Number(id));
      console.log('transformedIDS on reFetch === ', transformedIDS)
      const resultingArray = result.filter(
        (value) => !transformedIDS.includes(value.edition)
      );
      setAllNFT(resultingArray);
      isProfile ? setUnLoading(false) : setIsLoading(false);
    } catch (err) {
      console.log("err === ", err);
      isProfile ? setUnLoading(false) : setIsLoading(false);
    }
  };

  return (
    <>
      <Transition appear show={isClaimModalFlag} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setIsClaimModalFlag(false)}>
          <div className="fixed inset-0 bg-black/30 backdrop-blur-[20px]" aria-hidden="true" />
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
                <Dialog.Panel className="w-full max-w-[38rem] transform overflow-hidden rounded-2xl shadow bg-[#14253d] text-left align-middle transition-all border border-[rgba(255,255,255,0.1)]">
                  <div className="flex items-center justify-between p-4 md:p-5">
                    <h3 className="text-lg text-[rgba(255,255,255,0.8)] font-[Inter] font-semibold">
                      Are you sure you want to claim the rewards?
                    </h3>
                    <button type="button" className="text-gray-400 bg-transparent hover:bg-[rgba(255,255,255,0.2)] hover:text-[rgba(255,255,255,0.8)] rounded-lg text-sm h-8 w-8 ms-auto inline-flex justify-center items-center" data-modal-toggle="course-modal"
                      onClick={() => setIsClaimModalFlag(false)}
                    >
                      <XMarkIcon className='w-6 h-6' />
                      <span className="sr-only">Close modal</span>
                    </button>
                  </div>

                  <div className='flex gap-6 px-4 pb-4 md:px-5 md:pb-5'>
                    <button type="button" className="py-1 px-4 text-sm font-medium text-[rgba(255,255,255,0.6)] font-[Inter] focus:outline-none bg-[rgba(255,255,255,0.05)] rounded-lg border border-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.2)] hover:text-[rgba(255,255,255,0.8)] focus:z-10 focus:ring-4 focus:ring-gray-200"
                      onClick={() => setIsClaimModalFlag(false)}
                    >No, cancel</button>
                    <button type="button" className="py-1 px-4 text-sm font-medium text-[rgba(255,255,255,0.6)] font-[Inter] focus:outline-none bg-[rgba(255,255,255,0.05)] rounded-lg border border-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.2)] hover:text-[rgba(255,255,255,0.8)] focus:z-10 focus:ring-4 focus:ring-gray-200"
                      onClick={() => {
                        handleClaim();
                        setIsClaimModalFlag(false);
                      }}
                    >Yes, I'm sure</button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      <Transition appear show={historyFlag} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setHistoryFlag(false)}>
          <div className="fixed inset-0 bg-black/30 backdrop-blur-[20px]" aria-hidden="true" />
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
                <Dialog.Panel className="w-full max-w-[28rem] transform overflow-hidden rounded-2xl shadow bg-[#14253d] text-left align-middle transition-all border border-[rgba(255,255,255,0.1)]">
                  <div className="flex items-center justify-between px-4 pt-4 md:pt-5 md:px-8">
                    <h3 className="text-lg text-[rgba(255,255,255,0.8)] font-[Inter] font-semibold">
                      Reward history per BOHEDZ NFT
                    </h3>
                    <button type="button" className="text-gray-400 bg-transparent hover:bg-[rgba(255,255,255,0.2)] hover:text-[rgba(255,255,255,0.8)] rounded-lg text-sm h-8 w-8 ms-auto inline-flex justify-center items-center" data-modal-toggle="course-modal"
                      onClick={() => setHistoryFlag(false)}
                    >
                      <XMarkIcon className='w-6 h-6' />
                      <span className="sr-only">Close modal</span>
                    </button>
                  </div>

                  {rewardHistory.length !== 0 && (
                    <div className="w-full flex flex-col px-4 py-4 md:px-8 md:py-5">
                      {rewardHistory.map((item, index) => {
                        return (
                          <div key={index} className={`${index === 0 ? "border-none" : "border-t border-[rgba(255,255,255,0.2)]"} p-2 w-full flex gap-8 items-center`}>
                            <div className="flex gap-1">
                            <p className="text-[rgba(255,255,255,0.6)] text-sm font-[Inter] min-w-[50px]">Daily {index + 1}</p>
                            <p className="text-[rgba(255,255,255,0.6)] text-sm font-[Inter]">:</p>
                            </div>
                            <p className="text-[rgba(255,255,255,0.8)] text-sm font-[Inter]">{countLeadingZerosAfterDecimal(item)} ETH</p>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  <div className='flex gap-6 px-4 pb-4 md:px-8 md:pb-5'>
                    <button type="button" className="py-1 px-4 text-sm font-medium text-[rgba(255,255,255,0.6)] font-[Inter] focus:outline-none bg-[rgba(255,255,255,0.05)] rounded-lg border border-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.2)] hover:text-[rgba(255,255,255,0.8)] focus:z-10 focus:ring-4 focus:ring-gray-200"
                      onClick={() => setHistoryFlag(false)}
                    >Ok</button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
      <header
        className={`header top-0 left-0 z-40 flex w-full items-center bg-[#0d192b] !bg-opacity-90 ${
          sticky
            ? "!fixed !z-[9999] !bg-[#0d192b] !bg-opacity-90 shadow-sticky backdrop-blur-sm !transition"
            : "absolute"
        }`}
      >
        <div className="w-full px-4 sm:px-12">
          <div className="relative -mx-4 flex items-center justify-between">
            <div className="w-24 max-w-full xl:mr-12">
              <Link
                href="/"
                className={`header-logo block w-full ${
                  sticky ? "py-5 lg:py-2" : "py-4"
                } `}
              >
                <Image
                  src="/assets/logo.png"
                  alt="logo"
                  width={60}
                  height={72}
                  className="w-full h-[72px] dark:hidden"
                />
                <Image
                  src="/assets/logo.png"
                  alt="logo"
                  width={60}
                  height={72}
                  className="hidden w-full h-[72px] dark:block"
                />
              </Link>
            </div>
            <div className="flex w-full items-center justify-between px-4">
              <div>
                <button
                  onClick={navbarToggleHandler}
                  id="navbarToggler"
                  aria-label="Mobile Menu"
                  className="absolute right-4 top-1/2 block translate-y-[-50%] rounded-lg px-3 py-[6px] ring-primary focus:ring-2 lg:hidden"
                >
                  <span
                    className={`relative my-1.5 block h-0.5 w-[20px] bg-white transition-all duration-300 ${
                      navbarOpen ? " top-[7px] rotate-45" : " "
                    }`}
                  />
                  <span
                    className={`relative my-1.5 block h-0.5 w-[20px] bg-white transition-all duration-300 ${
                      navbarOpen ? "opacity-0 " : " "
                    }`}
                  />
                  <span
                    className={`relative my-1.5 block h-0.5 w-[20px] bg-white transition-all duration-300 ${
                      navbarOpen ? " top-[-9px] -rotate-45" : " "
                    }`}
                  />
                </button>
                <nav
                  id="navbarCollapse"
                  className={`navbar absolute right-0 z-30 w-[250px] rounded-2xl border-[.5px] border-body-color/50 bg-[#1e232e] py-4 px-6 duration-300 lg:visible lg:static lg:w-auto lg:border-none lg:!bg-transparent lg:p-0 lg:opacity-100 ${
                    navbarOpen
                      ? "visibility top-full opacity-100"
                      : "invisible top-[120%] opacity-0"
                  }`}
                >
                  <ul className="block lg:flex lg:space-x-12">
                    {menuData.map((menuItem, index) => (
                      <li key={menuItem.id} className="group relative">
                        {menuItem.path ? (
                          menuItem.id === 2 ? (
                            address && (
                              <Link
                                href={menuItem.path}
                                className={`flex py-2 text-base text-white font-[Inter] group-hover:opacity-70 lg:mr-0 lg:inline-flex lg:py-6 lg:px-0`}
                              >
                                {menuItem.title}
                              </Link>
                            )
                          ) : menuItem.id === 3 ? (
                            address && (
                              <button className={`flex py-2 text-base text-white font-[Inter] group-hover:opacity-70 lg:mr-0 lg:inline-flex lg:py-6 lg:px-0`}
                                onClick={() => handleRewardHistory()}
                              >
                                {menuItem.title}
                              </button>
                            )
                          ) :
                          (
                            <Link
                              href={menuItem.path}
                              className={`flex py-2 text-base text-white font-[Inter] group-hover:opacity-70 lg:mr-0 lg:inline-flex lg:py-6 lg:px-0`}
                            >
                              {menuItem.title}
                            </Link>
                          )
                        ) : (
                          <>
                            <a
                              onClick={() => handleSubmenu(index)}
                              className="flex cursor-pointer items-center justify-between py-2 text-base text-white font-[Inter] group-hover:opacity-70 lg:mr-0 lg:inline-flex lg:py-6 lg:px-0"
                            >
                              {menuItem.title}
                              <span className="pl-3">
                                <svg width="15" height="14" viewBox="0 0 15 14">
                                  <path
                                    d="M7.81602 9.97495C7.68477 9.97495 7.57539 9.9312 7.46602 9.8437L2.43477 4.89995C2.23789 4.70308 2.23789 4.39683 2.43477 4.19995C2.63164 4.00308 2.93789 4.00308 3.13477 4.19995L7.81602 8.77183L12.4973 4.1562C12.6941 3.95933 13.0004 3.95933 13.1973 4.1562C13.3941 4.35308 13.3941 4.65933 13.1973 4.8562L8.16601 9.79995C8.05664 9.90933 7.94727 9.97495 7.81602 9.97495Z"
                                    fill="currentColor"
                                  />
                                </svg>
                              </span>
                            </a>
                            <div
                              className={`submenu relative top-full left-0 rounded-md bg-white transition-[top] duration-300 group-hover:opacity-100 lg:invisible lg:absolute lg:top-[110%] lg:block lg:w-[250px] lg:p-4 lg:opacity-0 lg:shadow-lg lg:group-hover:visible lg:group-hover:top-full ${
                                openIndex === index ? "block" : "hidden"
                              }`}
                            >
                              {menuItem.submenu.map((submenuItem) => (
                                <Link
                                  href={submenuItem.path}
                                  key={submenuItem.id}
                                  className="block rounded py-2.5 text-sm text-white font-[Inter] hover:opacity-70 lg:px-3"
                                >
                                  {submenuItem.title}
                                </Link>
                              ))}
                            </div>
                          </>
                        )}
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
              <div className="absolute left-[40%] text-[rgba(255,255,255,0.6)] hidden xl:flex justify-center items-center font-[Inter] text-lg font-semibold py-2 px-2 2xl:px-8 bg-[rgba(28,118,255,0.6)] rounded-xl">
                {avaTime === true ? 
                  'Unwrapping is available now!!!' : 
                  (
                    <>
                      <div className="hidden 2xl:flex justify-center items-center">
                        Unwrapping will be available on{' '}<p className="text-2xl font-[Abel] mx-1 text-white">{avaTime.days}</p>d{' '}<p className="text-2xl font-[Abel] mx-1 text-white">{avaTime.hours}</p>h{' '}<p className="text-2xl font-[Abel] mx-1 text-white">{avaTime.minutes}</p>m{' '}<p className="text-2xl font-[Abel] mx-1 text-white">{avaTime.seconds}</p>s
                      </div>
                      <div className="flex 2xl:hidden justify-center items-center">
                        <p className="text-2xl font-[Abel] mx-1 text-white">{avaTime.days}</p>d{' '}<p className="text-2xl font-[Abel] mx-1 text-white">{avaTime.hours}</p>h{' '}<p className="text-2xl font-[Abel] mx-1 text-white">{avaTime.minutes}</p>m{' '}<p className="text-2xl font-[Abel] mx-1 text-white">{avaTime.seconds}</p>s
                      </div>
                    </>
                  )
                }
              </div>
              <div className="flex flex-row gap-3 items-center justify-end pr-16 lg:pr-0">
                {selectList.length > 0 ? (
                  <button
                    className="min-w-[115px] min-h-10 bg-[#1C76FF] hover:bg-[#5895f0] text-white font-[Inter] font-medium py-2 px-4 rounded-xl text-base cursor hover:text-gray-300 hover:bg-blue-500 transition-transform duration-200 ease-in-out hover:scale-[1.02]"
                    onClick={() => handleMultiWrap()}
                  >
                    {loading ? (
                      <div className="w-full h-full flex justify-center items-center">
                        <PuffLoader color="#ffff" size={20} />
                      </div>
                    ) : (
                      "Multi Wrap"
                    )}
                  </button>
                ) : (
                  <></>
                )}
                {unSelectList.length > 0 ? (
                  <button
                    disabled={avaTime === true ? false : true}
                    className="disabled:bg-[rgba(185,188,199,0.5)] min-w-[115px] min-h-10 bg-[#1C76FF] hover:bg-[#5895f0] text-white font-[Inter] font-medium py-2 px-4 rounded-xl text-base cursor hover:text-gray-300 hover:bg-blue-500 transition-transform duration-200 ease-in-out hover:scale-[1.02]"
                    onClick={() => handleMultiUnWrap()}
                  >
                    {unLoading ? (
                      <div className="w-full h-full flex justify-center items-center">
                        <PuffLoader color="#ffff" size={20} />
                      </div>
                    ) : (
                      "Multi Unwrap"
                    )}
                  </button>
                ) : (
                  <></>
                )}
                {address ? (
                  <button
                    className="flex justify-center min-w-[80px] items-center min-h-10 bg-[#1C76FF] hover:bg-[#5895f0] text-white font-[Inter] font-medium py-2 px-2 sm:px-4 rounded-xl text-xs sm:text-base cursor hover:text-gray-300 hover:bg-blue-500 transition-transform duration-200 ease-in-out hover:scale-[1.02]"
                    onClick={() => setIsClaimModalFlag(true)}
                  >
                    {loading2 ? (
                      <div className="w-full h-full flex justify-center items-center">
                        <PuffLoader color="#ffff" size={20} />
                      </div>
                    ) : (
                      <div className="flex gap-1">
                        <span className="hidden sm:flex">Claim reward: </span>
                        <span>
                          {countLeadingZerosAfterDecimal(rewardValue)} ETH
                        </span>
                      </div>
                    )}
                  </button>
                ) : (
                  <></>
                )}
                <div className="flex">
                  <ConnectButton />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
