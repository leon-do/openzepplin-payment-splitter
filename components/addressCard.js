import React, { useState, useEffect } from "react";
import styles from "../styles/Home.module.css";

export default function AddressCard({ provider }) {
  const [userAddress, setUserAddress] = useState("");

  useEffect(() => {
    (async () => {
      const accounts = await provider.listAccounts();
      setUserAddress(accounts[0]);
    })();
  });

  return (
    <div className={styles.card}>
      <h2>Address</h2>
      <p>{userAddress}</p>
    </div>
  );
}
