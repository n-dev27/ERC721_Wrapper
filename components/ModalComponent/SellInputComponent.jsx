"use client";

import React from "react";
import { useAccount } from "wagmi";

const style = {
  sellInput:
    "flex w-full max-h-[90px] justify-between bg-[rgba(255,255,255,0.08)] shadow-[0_8px_24px_0_rgba(0,0,0,0.15)] rounded-[20px] px-4 py-2",
  sellInputText: "w-full text-sm text-white font-[Inter] font-bold font-[Inter]",
  sellInputBalanceContainer: "flex flex-col",
  sellInputBalance:
    "flex w-full justify-end items-center text-[14px] font-[Inter] text-[#94A3B8]",
  sellInputSelector:
    "flex items-center p-2 w-full h-[40px] bg-[#2C354A] justify-start rounded-[8px] border border-[#334155] gap-2 shadow-[0_4_12_0_rgba(0,0,0,0.5)]",
  sellInputMaxButton:
    "flex justify-center text-blue-400 text-sm font-[Inter] font-bold font_Inter items-center hover:animate-pulse rounded-md pt-[1px]",
  sellInputInputContainer:
    "flex justify-end items-center text-white text-[2rem] font-[Inter]",
  sellInputAmount:
    "defaultPlaceholder flex w-full justify-end text-[#F8FAFC] bg-transparent text-[32px] font-[Inter] border-none outline-none focus:outline-none focus:ring-transparent text-end p-0",
  sellInputValue:
    "flex w-full justify-end text-[16px] font-[Inter] text-[#94A3B8] font-[Inter]",
};

const SellTokenInput = (props) => {
  const { address } = useAccount();

  return (
    <div className={style.sellInput}>
      <div className="flex flex-col gap-1.5 justify-center">
        <div className="flex items-center">
          <div type="button" className={style.sellInputSelector}>
            <div className="flex gap-1 items-center h-full">
              <p className="text-[20px] text-white font-[Inter]">BOHEDZ</p>
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
            value={props.isProfile ? parseFloat(4.75 * props.number).toFixed(1) : parseFloat(5.1 * props.number).toFixed(1)}
            readOnly
          />
        </div>
      </div>
    </div>
  );
};

export default SellTokenInput;
