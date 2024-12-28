import { useEffect, useContext, useState } from "react";
import { useAccount } from "wagmi";
import { BiCopy } from "react-icons/bi";
import { BsCheck } from "react-icons/bs";
import { Checkbox } from "@material-tailwind/react";
import WrapModal from "./ModalComponent/ModalComponent";
import { NFTContext } from "../utils/context";
import styles from "../styles/NFTCard.module.css";

const NFTCard = ({ nft, isProfile }) => {
  const { isConnected } = useAccount();

  const { avaTime, selectList, setSelectList, unSelectList, setUnSelectList } =
    useContext(NFTContext);
  const [copied, setCopied] = useState(false);
  const [isSelect, setIsSelect] = useState(false);
  const [isUnSelect, setIsUnSelect] = useState(false);
  const [isModal, setIsModal] = useState(false);

  const nftContract_Addr = process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDR;

  const image = isProfile
    ? nft.media[0].gateway
    : `https://ipfs.io/ipfs/QmNiAUXNiTf6jSxBwmaSkUPHLHPTXCzaVP33LroACR74Bf/${nft.edition}.png`;

  const placeholderImage = "./no-image-icon.png";

  useEffect(() => {
    if (selectList.length === 0) {
      setIsSelect(false);
    }
  }, [selectList]);

  useEffect(() => {
    if (unSelectList.length === 0) {
      setIsUnSelect(false);
    }
  }, [unSelectList]);

  const onImageError = (e) => {
    e.target.src = placeholderImage;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(nftContract_Addr).then(
      () => {
        setCopied(true);
        // changing back to default state after 2 seconds.
        setTimeout(() => {
          setCopied(false);
        }, 2000);
      },
      (err) => {
        console.log("failed to copy", err.message);
      }
    );
  };

  const handleCheckBox = (nft) => {
    // If the current state is false (NFT is not selected), add it to the selectList
    if (!isProfile) {
      setIsSelect(!isSelect);
      if (isSelect === false) {
        setSelectList((prevList) => [...prevList, nft]); // append nft to the existing selectList
      }
      // If the current state is true (NFT is selected), remove it from the selectList
      else {
        setSelectList((prevList) =>
          prevList.filter((item) => item?.edition !== nft?.edition)
        );
      }
    } else {
      setIsUnSelect(!isUnSelect);
      if (isUnSelect === false) {
        setUnSelectList((prevUnList) => [...prevUnList, nft]);
      } else {
        setUnSelectList((prevUnList) =>
          prevUnList.filter(
            (item) => item?.metadata?.edition !== nft?.metadata.edition
          )
        );
      }
    }
  };

  const handleClick = () => {
    if (isConnected) {
      setIsModal(true);
    }
  };

  return (
    <div
      className={`${styles.flexCol} ${styles.nft_container} cursor-pointer rounded-3xl`}
    >
      <WrapModal
        isModal={isModal}
        setIsModal={setIsModal}
        image={image}
        nftData={nft}
        isProfile={isProfile}
      />
      <div
        className="relative px-2 pt-2"
        onClick={() => {
          handleCheckBox(nft);
        }}
      >
        <div className="absolute right-4 top-4">
          <Checkbox
            readOnly
            checked={isProfile ? isUnSelect : isSelect}
            color="indigo"
            ripple={false}
            className="h-6 w-6 rounded-full border-gray-900/20 bg-gray-900/10 transition-all hover:scale-105 hover:before:opacity-0"
          />
        </div>

        <img
          src={image ? image : placeholderImage}
          alt="cover image"
          onError={onImageError}
          width={8}
          height={8}
          className="rounded-[18px]"
        ></img>
      </div>
      <div
        className={`${styles.flexCol} ${styles.nft_textContainer} opacity-80`}
      >
        <div>
          <h3 className="text-[#8bacda] font-[Inter]">
            {isProfile ? nft.title : nft.name}
          </h3>
          <p className=" font-[Inter]">
            Id: {isProfile ? nft.metadata.edition : nft.edition}
          </p>
          <div>
            <p className="text-[14px] font-[Inter]">{`Collection: ${nftContract_Addr.substr(
              0,
              4
            )}...${nftContract_Addr.substr(nftContract_Addr.length - 4)}`}</p>
            <button
              className={`${styles.nft_button} ${
                copied ? styles.nft_button_copied : styles.nft_button_not_copied
              }`}
              onClick={() => copyToClipboard()}
            >
              {copied ? (
                <BsCheck size={"1rem"} className={styles.text_green} />
              ) : (
                <BiCopy size={"1rem"} className={styles.text_gray} />
              )}
            </button>
          </div>
        </div>

        <div className={`${styles.nft_textDescription} font-[Inter] text-sm`}>
          <p>{nft.description}</p>
        </div>
      </div>
      <div className={styles.nft_link}>
        <button
          className={`${
            isConnected ? "" : "cursor-not-allowed"
          } disabled:bg-[rgba(185,188,199,0.5)] flex w-[90%] bg-[#1C76FF] font-medium rounded-[12px] h-10 justify-center items-center text-white text-base cursor font-[Inter] hover:text-gray-300 hover:bg-blue-500 transition-transform duration-200 ease-in-out hover:scale-[1.02]`}
          onClick={() => handleClick()}
          disabled={!isConnected || !isProfile}
        >
          {isProfile ? "UnWrap" : "Wrap"}
        </button>
      </div>
    </div>
  );

  // return (
  //   <div className={`${styles.flexCol} ${styles.nft_container}`}>
  //     <div>
  //       <img
  //         src={image ? image : placeholderImage}
  //         alt="cover image"
  //         onError={onImageError}
  //         width={8}
  //         height={8}
  //       ></img>
  //     </div>
  //     <div className={`${styles.flexCol} ${styles.nft_textContainer}`}>
  //       <div>
  //         <h2>
  //           {nft.title
  //             ? nft.title
  //             : `#${nft.id.tokenId.substr(nft.id.tokenId.length - 4)}`}
  //         </h2>
  //         <p>Id: {nft.id.tokenId.substr(nft.id.tokenId.length - 4)}</p>
  //         <div>
  //           <p>{`Collection: ${nft.contract.address.substr(
  //             0,
  //             4
  //           )}...${nft.contract.address.substr(
  //             nft.contract.address.length - 4
  //           )}`}</p>
  //           <button
  //             className={`${styles.nft_button} ${
  //               copied ? styles.nft_button_copied : styles.nft_button_not_copied
  //             }`}
  //             onClick={() => copyToClipboard()}
  //           >
  //             {copied ? (
  //               <BsCheck size={"1.5rem"} className={styles.text_green} />
  //             ) : (
  //               <BiCopy size={"1.5rem"} className={styles.text_gray} />
  //             )}
  //           </button>
  //           {copied ? <span>Copied</span> : ""}
  //         </div>
  //       </div>

  //       <div className={styles.nft_textDescription}>
  //         <p>{nft.description}</p>
  //       </div>
  //     </div>
  //     <div className={styles.nft_link}>
  //       <a
  //         target="_blank"
  //         href={`https://etherscan.io/token/${nft.contract.address}`}
  //       >
  //         View on etherscan
  //       </a>
  //     </div>
  //   </div>
  // );
};

export default NFTCard;
