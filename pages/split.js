import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import React, { useState, useEffect } from "react";
import { BigNumber, ethers } from "ethers";
import abi from "../contract/abi.json";

export default function Split() {
  const [provider, setProvider] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [contractAddress, setContractAddress] = useState("");
  const [readContractMsg, setReadContractMsg] = useState("");
  const [userAddress, setUserAddress] = useState("");
  const [chainName, setChainName] = useState("");
  const [chainId, setChainId] = useState("");
  const [nativeTokenShares, setNativeTokenShares] = useState("");
  const [nativeTokenMsg, setNativeTokenMsg] = useState("");

  useEffect(() => {
    const localContractAddress = localStorage.getItem("contractAddress");
    if (localContractAddress) {
      setContractAddress(localContractAddress);
    }
  }, []);

  const handleConnect = async () => {
    // if no metamask installed
    if (!window.ethereum) {
      return alert("please install wallet");
    }
    // get provider
    const prov = new ethers.providers.Web3Provider(window.ethereum);
    // set provider
    setProvider(prov);
    // get accounts
    const accounts = await prov.listAccounts();
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
    // set state
    const { name, chainId } = await prov.getNetwork();
    setChainId(chainId);
    setChainName(name);
    setUserAddress(accounts[0]);
    setIsConnected(true);
  };

  const readContract = async (_contractAddress) => {
    if (!isConnected) return;
    setReadContractMsg("");
    // set the contract address to local storage
    window.localStorage.setItem("contractAddress", _contractAddress);
    // connect to walletsplitter
    const contract = new ethers.Contract(_contractAddress, abi, provider.getSigner());
    try {
      const shares = await contract["shares(address)"](userAddress);
      const contractBalance = await provider.getBalance(contractAddress);
      const totalReleased = await contract["totalReleased(address)"](userAddress);
      const totalReceived = contractBalance.add(totalReleased);
      const alreadyReleased = await contract["released(address)"](userAddress);
      const totalShares = await contract["totalShares()"]();
      console.log({shares: shares.toString(), contractBalance: contractBalance.toString(), totalReleased: totalReleased.toString(), totalReceived: totalReceived.toString(), alreadyReleased: alreadyReleased.toString(), totalShares: totalShares.toString()});
      // https://github.com/OpenZeppelin/openzeppelin-contracts/blob/742e85be7c08dff21410ba4aa9c60f6a033befb8/contracts/finance/PaymentSplitter.sol#L171
      const payment = totalReceived.mul(shares).div(totalShares).sub(alreadyReleased);
      setNativeTokenShares(payment);
    } catch (error) {
      setReadContractMsg(error.reason);
    }
  };

  const releaseNativeTokens = async () => {
    if (!isConnected) return;
    setNativeTokenMsg("");
    // connect to walletsplitter
    const contract = new ethers.Contract(contractAddress, abi, provider.getSigner());
    try {
      const receipt = await contract["release(address)"](userAddress);
      setNativeTokenMsg(receipt.hash);
    } catch (error) {
      setNativeTokenMsg(error.reason);
    }
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
          <div className={styles.grid}>
            <div className={styles.card}>
              <h2>Address</h2>
              <p>{userAddress}</p>
            </div>
            <div className={styles.card}>
              <h2>Chain</h2>
              <p>Name: {chainName.toUpperCase()}</p>
              <p>Chain ID: {chainId}</p>
            </div>
            <div className={`grid grid-cols-3 ${styles.card}`}>
              <h2>Splitter Address</h2>
              <input type="text" value={contractAddress} placeholder="0xWalletSplitterAddress" onChange={(e) => setContractAddress(e.target.value)}></input>
              <h3 className={styles.smallButton} onClick={() => readContract(contractAddress)}>
                Connect
              </h3>
              <code>{readContractMsg}</code>
            </div>
            {nativeTokenShares ? (
              <div className={styles.card}>
                <h2>Native Tokens</h2>
                <p>Amount To Release: {(-1 * ethers.utils.formatEther(nativeTokenShares)).toFixed(2)}</p>
                <h3 className={styles.smallButton} onClick={() => releaseNativeTokens()}>
                  Release
                </h3>
                <code>{nativeTokenMsg}</code>
              </div>
            ) : (
              <></>
            )}
          </div>
        ) : (
          <h2 className={styles.bigButton} onClick={handleConnect}>
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
