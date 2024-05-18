"use client";
import Image from "next/image";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
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
import { config } from "../config/config";
import { NFTContext } from "../../utils/context";
import { initialFetch } from "../../utils/FetchNFT";
import menuData from "./menuData";
import tokenABI from "../../contract/ABI/HYBRIDS.json";
import nftABI from "../../contract/ABI/HYBRIDSWRAPPER.json";

const Header = () => {
  const {
    isLoading,
    setIsLoading,
    setAllNFT,
    selectList,
    setSelectList,
    setTokenBal,
    setNFTBal,
  } = useContext(NFTContext);
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openIndex, setOpenIndex] = useState(-1);
  const [sticky, setSticky] = useState(false);

  const { address } = useAccount();

  const tokenAddr = process.env.NEXT_PUBLIC_BOHEDZ_TOKEN_ADDRESS;
  const contractAddr = process.env.NEXT_PUBLIC_BOHEDZ_WRAPPER_ADDRESS;

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
    window.addEventListener("scroll", handleStickyNavbar);
  });

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

  const reFetchNFT = async () => {
    try {
      setIsLoading(true);
      toast("Multiwrap is done successfully");
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
    } catch (err) {
      console.log("err === ", err);
      setIsLoading(false);
    }
  };

  return (
    <>
      <header
        className={`header top-0 left-0 z-40 flex w-full items-center bg-[#0d192b] !bg-opacity-90 ${
          sticky
            ? "!fixed !z-[9999] !bg-[#0d192b] !bg-opacity-90 shadow-sticky backdrop-blur-sm !transition"
            : "absolute"
        }`}
      >
        <div className="w-full px-12">
          <div className="relative -mx-4 flex items-center justify-between">
            <div className="w-24 max-w-full xl:mr-12">
              <Link
                href="/"
                className={`header-logo block w-full ${
                  sticky ? "py-5 lg:py-2" : "py-4"
                } `}
              >
                <Image
                  src="/assets/logo.svg"
                  alt="logo"
                  width={60}
                  height={5}
                  className="w-full h-16 dark:hidden"
                />
                <Image
                  src="/assets/logo.svg"
                  alt="logo"
                  width={60}
                  height={5}
                  className="hidden w-full h-16 dark:block"
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
                                className={`flex py-2 text-base text-white group-hover:opacity-70 lg:mr-0 lg:inline-flex lg:py-6 lg:px-0`}
                              >
                                {menuItem.title}
                              </Link>
                            )
                          ) : (
                            <Link
                              href={menuItem.path}
                              className={`flex py-2 text-base text-white group-hover:opacity-70 lg:mr-0 lg:inline-flex lg:py-6 lg:px-0`}
                            >
                              {menuItem.title}
                            </Link>
                          )
                        ) : (
                          <>
                            <a
                              onClick={() => handleSubmenu(index)}
                              className="flex cursor-pointer items-center justify-between py-2 text-base text-white group-hover:opacity-70 lg:mr-0 lg:inline-flex lg:py-6 lg:px-0"
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
                                  className="block rounded py-2.5 text-sm text-white hover:opacity-70 lg:px-3"
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
              <div className="flex items-center justify-end pr-16 lg:pr-0">
                {selectList.length > 0 ? (
                  <button
                    className="min-w-[115px] min-h-10 bg-[#1C76FF] hover:bg-[#5895f0] text-white font-medium py-2 px-4 rounded-xl text-base cursor hover:text-gray-300 hover:bg-blue-500 transition-transform duration-200 ease-in-out hover:scale-[1.02]"
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
                <div className="flex p-3">
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
