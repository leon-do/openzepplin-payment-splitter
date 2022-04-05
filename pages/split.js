import Head from "next/head";
import styles from "../styles/Home.module.css";
import React, { useState } from "react";
import { ethers } from "ethers";
import UserInfoCard from "../components/userInfoCard";
import SplitterAddressCard from "../components/splitterAddressCard";
import Footer from "../components/footer";

export default function Split() {
  const [provider, setProvider] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

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
            <h1 className={styles.title}>Payment Splitter</h1>
            <div className={styles.grid}>
              <UserInfoCard provider={provider} />
              <SplitterAddressCard provider={provider} />
            </div>
          </>
        ) : (
          <h2 className={styles.bigButton} onClick={handleConnect}>
            Connect Wallet &rarr;
          </h2>
        )}
      </main>

     <Footer /> 
    </div>
  );
}
