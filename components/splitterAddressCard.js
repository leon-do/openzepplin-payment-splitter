import React, { useState, useEffect } from "react";
import ReleaseNativeTokenCard from "./releaseNativeTokenCard";
import styles from "../styles/Home.module.css";
import { ethers } from "ethers";
import abi from "../contract/abi.json";

export default function SplitterAddressCard({ provider }) {
  const [contractAddress, setContractAddress] = useState("");
  const [readContractMsg, setReadContractMsg] = useState("");
  const [nativeTokenShares, setNativeTokenShares] = useState("");
  const [nativeTokenMsg] = useState("");

  useEffect(() => {
    const localContractAddress = localStorage.getItem("contractAddress");
    if (localContractAddress) {
      setContractAddress(localContractAddress);
    }
  }, []);

  const readContract = async (_contractAddress) => {
    setReadContractMsg("");
    // connect to walletsplitter
    const contract = new ethers.Contract(_contractAddress, abi, provider.getSigner());
    try {
      const userAddress = (await provider.listAccounts())[0];
      const shares = await contract["shares(address)"](userAddress);
      const contractBalance = await provider.getBalance(contractAddress);
      const totalReleased = await contract["totalReleased()"]();
      const totalReceived = contractBalance.add(totalReleased);
      const alreadyReleased = await contract["released(address)"](userAddress);
      const totalShares = await contract["totalShares()"]();
      // https://github.com/OpenZeppelin/openzeppelin-contracts/blob/742e85be7c08dff21410ba4aa9c60f6a033befb8/contracts/finance/PaymentSplitter.sol#L171
      const payment = totalReceived.mul(shares).div(totalShares).sub(alreadyReleased);
      setNativeTokenShares(payment);
      // set the contract address to local storage
      window.localStorage.setItem("contractAddress", _contractAddress);
    } catch (error) {
      setReadContractMsg(error.message);
    }
  };

  return (
    <>
      <div className={styles.card}>
        <h2>Splitter Address</h2>
        <input type="text" value={contractAddress} placeholder="0xWalletSplitterAddress" onChange={(e) => setContractAddress(e.target.value)}></input>
        <h3 className={styles.smallButton} onClick={() => readContract(contractAddress)}>
          Connect
        </h3>
        <code>{readContractMsg}</code>
      </div>
      {nativeTokenShares == "" ? <></> : <ReleaseNativeTokenCard provider={provider} nativeTokenShares={nativeTokenShares} nativeTokenMsg={nativeTokenMsg} contractAddress={contractAddress} />}
    </>
  );
}
