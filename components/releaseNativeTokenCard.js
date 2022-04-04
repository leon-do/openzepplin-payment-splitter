import React, { useState } from "react";
import styles from "../styles/Home.module.css";
import { ethers } from "ethers";
import abi from "../contract/abi.json";

export default function ReleaseNativeTokenCard({ provider, nativeTokenShares, nativeTokenMsg, contractAddress }) {
  const [tokenShares] = useState(nativeTokenShares);
  const [tokenMsg, setTokenMsg] = useState(nativeTokenMsg);

  const releaseNativeTokens = async () => {
    setTokenMsg("");
    const contract = new ethers.Contract(contractAddress, abi, provider.getSigner());
    const userAddress = (await provider.listAccounts())[0];
    try {
      const response = await contract["release(address)"](userAddress);
      setTokenMsg(response.hash);
    } catch (error) {
      setTokenMsg(error.reason);
    }
  };

  return (
    <div className={styles.card}>
      <h2>Native Tokens</h2>
      <p>Amount To Release: {-1 * ethers.utils.formatEther(tokenShares)}</p>
      <h3 className={styles.smallButton} onClick={() => releaseNativeTokens()}>
        Release
      </h3>
      <code>{tokenMsg}</code>
    </div>
  );
}
