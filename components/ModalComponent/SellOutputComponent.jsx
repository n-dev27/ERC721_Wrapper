"use client";

import React from "react";
import { useAccount } from "wagmi";

const style = {
  sellOutput:
    "flex w-full max-h-[90px] justify-between bg-[rgba(255,255,255,0.08)] shadow-[0_8px_24px_0_rgba(0,0,0,0.15)] rounded-[20px] px-4 py-2",
  sellOutputText: "w-full text-sm text-white font-[Inter] font-bold font-[Inter]",
  sellOutputBalanceContainer: "flex flex-col",
  sellOutputBalance:
    "flex w-full justify-end items-center text-[14px] font-[Inter] text-[#94A3B8]",
  sellOutputMaxButton:
    "flex justify-center text-blue-400 text-sm font-[Inter] font-bold font_Inter items-center hover:animate-pulse rounded-md pt-[1px]",
  sellOutputSelector:
    "flex items-center p-2 w-full h-[40px] bg-[#2C354A] justify-start rounded-[8px] border border-[#334155] gap-2 shadow-[0_4_12_0_rgba(0,0,0,0.5)]",
  sellOutputInputContainer:
    "flex justify-end items-center text-white text-[2rem] font-[Inter]",
  sellOutputAmount:
    "defaultPlaceholder flex w-full justify-end text-[#F8FAFC] bg-transparent text-[32px] font-[Inter] border-none outline-none focus:outline-none focus:ring-transparent text-end p-0",
  sellOutputValue:
    "flex w-full justify-end text-[16px] font-[Inter] text-[#94A3B8] font-[Inter]",
};

const SellTokenOutput = (props) => {
  const { address } = useAccount();

  return (
    <div>
      <div className={style.sellOutput}>
        <div className="flex flex-col gap-1.5 justify-center">
          <div type="button" className={style.sellOutputSelector}>
            <div className="flex items-center h-full gap-1">
              <p className="text-[20px] text-white font-[Inter]">NFT</p>
            </div>
          </div>
        </div>
        <div className={style.sellOutputBalanceContainer}>
          <div className="flex justify-end gap-[4px]">
            <div className={style.sellOutputBalance}>
              Balance:&nbsp;
              {address && props.nftBal && (
                <div>
                  {Number(
                    parseFloat(props.nftBal).toFixed(4)
                  )?.toLocaleString()}
                </div>
              )}
            </div>
          </div>
          <div className={style.sellOutputInputContainer}>
            <input
              className={style.sellOutputAmount}
              type="text"
              inputMode="numeric"
              autoComplete="off"
              autoCorrect="off"
              spellCheck="false"
              placeholder="0.0"
              pattern="[0-9]*"
              minLength="1"
              maxLength="79"
              value={1 * props.number}
              readOnly
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellTokenOutput;
