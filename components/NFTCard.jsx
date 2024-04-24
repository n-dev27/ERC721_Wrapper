import { useState } from "react";
import { BiCopy } from "react-icons/bi";
import { BsCheck } from "react-icons/bs";
import styles from "../styles/NFTCard.module.css";

const NFTCard = ({ nft }) => {
  const [copied, setCopied] = useState(false);

  const nftContract_Addr = process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDR;

  // NFT image from Alchemy
  // const image = nft.media[0].gateway;

  // NFT image from IPFS
  const image = `https://ipfs.io/ipfs/QmfEudVfYCLn1eWXYqpSxFohZJ7T5LeFUUEELrEBiGv4EQ/${nft.edition}.png`;

  const placeholderImage = "./no-image-icon.png";

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

  return (
    <div className={`${styles.flexCol} ${styles.nft_container}`}>
      <div>
        <img
          src={image ? image : placeholderImage}
          alt="cover image"
          onError={onImageError}
          width={8}
          height={8}
          className="rounded-t-[18px]"
        ></img>
      </div>
      <div className={`${styles.flexCol} ${styles.nft_textContainer}`}>
        <div>
          <h3 className="text-white">{nft.name}</h3>
          <p>Id: {nft.edition}</p>
          <div>
            <p className="text-[16px]">{`Collection: ${nftContract_Addr.substr(
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
            {copied ? <span>Copied</span> : ""}
          </div>
        </div>

        <div className={styles.nft_textDescription}>
          <p>{nft.description}</p>
        </div>
      </div>
      <div className={styles.nft_link}>
        <a
          target="_blank"
          href={`https://sepolia.basescan.org/address/${nftContract_Addr}`}
        >
          View on basescan
        </a>
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
