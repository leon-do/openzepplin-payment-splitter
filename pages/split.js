import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import abi from "../contract/abi.json";

function Split() {
  const [isConnected, setIsConnected] = useState(false);
  const [contractAddress, setContractAddress] = useState("");
  const [userAddress, setUserAddress] = useState("");
  const [chainId, setChainId] = useState("");
  const [nativeTokenShares, setNativeTokenShares] = useState("");

  useEffect(() => {
    const localContractAddress = localStorage.getItem("contractAddress");
    if (localContractAddress) {
      setContractAddress(localContractAddress);
    }
  }, []);

  const readContract = async (_contractAddress) => {
    if (!isConnected) return;
    // set the contract address to local storage
    window.localStorage.setItem("contractAddress", _contractAddress);
    // get provider
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    // connect to walletsplitter
    const contract = new ethers.Contract(_contractAddress, abi, provider.getSigner());
    try {
      const shares = await contract["shares(address)"](userAddress);
      setNativeTokenShares(shares.toString());
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleConnect = async () => {
    // if no metamask installed
    if (!window.ethereum) {
      return alert("please install wallet");
    }
    // get provider
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    // get accounts
    const accounts = await provider.listAccounts();
    // if not connected, connect to metamask
    if (accounts.length == 0) {
      await ethereum.request({ method: "eth_requestAccounts" });
    }
    // restart when account changes
    window.ethereum.on("accountsChanged", (account) => {
      setIsConnected(false);
    });
    // restart when network changes
    window.ethereum.on("chainChanged", (network) => {
      setIsConnected(false);
    });
    // set user address
    setUserAddress(accounts[0]);
    // set networkId
    setChainId((await provider.getNetwork()).chainId);
    // set isConnected to true
    setIsConnected(true);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>OZ Payment Splitter</title>
        <meta name="description" content="Open Zepplin Payment Splitter" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        {isConnected ? (
          <>
            <div>
              Hello {userAddress} on chain {chainId}
            </div>
            <input type="text" value={contractAddress} placeholder="0xWalletSplitterAddress" onChange={(e) => setContractAddress(e.target.value)}></input>
            <button onClick={() => readContract(contractAddress)}>Read Contract</button>
            <div>Native tokens to claim: {nativeTokenShares} </div>
            <div></div>
          </>
        ) : (
          <h2 className={styles.button} onClick={handleConnect}>
            Connect Wallet &rarr;
          </h2>
        )}
      </main>

      <footer className={styles.footer}>
        <a href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app" target="_blank" rel="noopener noreferrer">
          Powered by{" "}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  );
}

export default Split;
