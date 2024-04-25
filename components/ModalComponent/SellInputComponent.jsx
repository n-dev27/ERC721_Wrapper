"use client";

import React, { useState, useEffect } from "react";
import { useAccount } from "wagmi";
// import { config } from "../config/config";
// import { tokenContract } from "../config/constant";
// import tokenABI from "../../contract/RizoModule#Rizo.json";
// import RIZO_token from "../../app/assets/RIZO_token.png";

const style = {
  sellInput:
    "flex w-full max-h-[90px] justify-between bg-[#1E2431] sm:bg-[rgba(255,255,255,0.08)] shadow-[0_8px_24px_0_rgba(0,0,0,0.15)] rounded-[20px] px-4 py-2",
  sellInputText: "w-full text-sm text-white font-bold font-[Inter]",
  sellInputBalanceContainer: "flex flex-col",
  sellInputBalance:
    "flex w-full justify-end items-center text-[14px] font-[Inter] text-[#94A3B8]",
  sellInputSelector:
    "flex items-center p-2 w-full h-[40px] bg-[#2C354A] justify-start rounded-[8px] border border-[#334155] gap-2 shadow-[0_4_12_0_rgba(0,0,0,0.5)]",
  sellInputMaxButton:
    "flex justify-center text-blue-400 text-sm font-bold font_Inter items-center hover:animate-pulse rounded-md pt-[1px]",
  sellInputInputContainer:
    "flex justify-end items-center text-white text-[2rem]",
  sellInputAmount:
    "defaultPlaceholder flex w-full justify-end text-[#F8FAFC] bg-transparent text-[32px] border-none outline-none focus:outline-none focus:ring-transparent text-end p-0",
  sellInputValue:
    "flex w-full justify-end text-[16px] font-[Inter] text-[#94A3B8]",
};

const SellTokenInput = (props) => {
  const { address } = useAccount();

  // useEffect(() => {
  //   const fetchMarketPrices = async () => {
  //     if (address) {
  //       const tokenBalance = await readContract(config, {
  //         address: tokenContract,
  //         abi: tokenABI,
  //         functionName: "balanceOf",
  //         args: [address],
  //         chainId: 1,
  //       });
  //       props.setRizoBalance(Number(tokenBalance) / 10 ** 18);
  //     }
  //   };

  //   fetchMarketPrices();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [address, props.inputTokenAmount]);

  return (
    <div className={style.sellInput}>
      <div className="flex flex-col gap-1.5 justify-center">
        <div className="flex items-center">
          <div type="button" className={style.sellInputSelector}>
            <div className="flex gap-1 items-center h-full">
              <p className="text-[20px] text-white font_Roboto">HYBRID</p>
            </div>
          </div>
        </div>
      </div>
      <div className={style.sellInputBalanceContainer}>
        <div className="flex justify-end gap-[4px]">
          <div className={style.sellInputBalance}>
            Balance:&nbsp;
            {address && props.tokenBal && (
              <div>
                {Number(
                  parseFloat(props.tokenBal).toFixed(4)
                )?.toLocaleString()}
              </div>
            )}
          </div>
          {/* <div className={style.sellInputMaxButton}>
            <button
              className="text-white"
              onClick={() => {
                props.setInputTokenAmount(props.tokenBal.toString());
                props.setOutputTokenAmount(
                  Math.floor(props.tokenBal / 5000000).toString()
                );
              }}
            >
              Max
            </button>
          </div> */}
        </div>
        <div className={style.sellInputInputContainer}>
          <input
            className={style.sellInputAmount}
            type="text"
            inputMode="decimal"
            autoComplete="off"
            autoCorrect="off"
            spellCheck="false"
            placeholder="0.0"
            pattern="^[0-9]*[.,]?[0-9]*$"
            minLength="1"
            maxLength="79"
            value={1}
            readOnly
            // onChange={(event) => {
            //   props.setInputTokenAmount(event.target.value);
            //   props.setOutputTokenAmount(
            //     Math.floor(event.target.value / 5000000)
            //   );
            // }}
          />
        </div>
      </div>
    </div>
  );
};

export default SellTokenInput;
