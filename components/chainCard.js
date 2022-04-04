import React, { useState, useEffect } from "react";
import styles from "../styles/Home.module.css";

export default function ChainCard({ provider }) {
  const [chainName, setChainName] = useState("");
  const [chainId, setChainId] = useState("");

  useEffect(() => {
    (async () => {
      const { name, chainId } = await provider.getNetwork();
      setChainId(chainId);
      setChainName(name);
    })();
  });

  return (
    <div className={styles.card}>
      <h2>Chain</h2>
      <p>Name: {chainName.toUpperCase()}</p>
      <p>Chain ID: {chainId}</p>
    </div>
  );
}
