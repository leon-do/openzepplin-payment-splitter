import React, { useState, useEffect } from "react";
import styles from "../styles/Home.module.css";
import { ethers } from "ethers";
import abi from "../contract/abi.json";
import erc20Abi from "../contract/erc20Abi.json";

export default function ERC20AddressCard({ provider, contractAddress }) {
  const [erc20Address, setErc20Address] = useState("");
  const [erc20Shares, setErc20Shares] = useState("");
  const [erc20Msg, setErc20Msg] = useState("");

  useEffect(() => {
    const localErc20Address = localStorage.getItem("erc20Address");
    if (localErc20Address) {
      setErc20Address(localErc20Address);
    }
  }, []);

  const readContract = async (_erc20Address) => {
    setErc20Msg("");
    const contract = new ethers.Contract(contractAddress, abi, provider.getSigner());
    const erc20Contract = new ethers.Contract(_erc20Address, erc20Abi, provider.getSigner());
    try {
      const userAddress = (await provider.listAccounts())[0];
      const shares = await contract["shares(address)"](userAddress);
      const tokenBalance = await erc20Contract.balanceOf(contractAddress);
      const totalReleased = await contract["totalReleased(address)"](erc20Address);
      const totalReceived = tokenBalance.add(totalReleased);
      const alreadyReleased = await contract["released(address,address)"](erc20Address, userAddress);
      const totalShares = await contract["totalShares()"]();
      console.log({ shares: shares.toString(), tokenBalance: tokenBalance.toString(), totalReleased: totalReleased.toString(), totalReceived: totalReceived.toString(), alreadyReleased: alreadyReleased.toString(), totalShares: totalShares.toString() });
      // https://github.com/OpenZeppelin/openzeppelin-contracts/blob/742e85be7c08dff21410ba4aa9c60f6a033befb8/contracts/finance/PaymentSplitter.sol#L171
      const payment = totalReceived.mul(shares).div(totalShares).sub(alreadyReleased);
      setErc20Shares(payment);
      // set the contract address to local storage
      window.localStorage.setItem("erc20Address", _erc20Address);
    } catch (error) {
      console.error(error)
      setErc20Msg(error.reason);
    }
  };

  return (
    <div className={styles.card}>
      <h2>ERC-20 Address</h2>
      <input type="text" value={erc20Address} placeholder="0xERC20Address" onChange={(e) => setErc20Address(e.target.value)}></input>
      <h3 className={styles.smallButton} onClick={() => readContract(erc20Address)}>
        Connect {erc20Shares.toString()}
      </h3>
      <code>{erc20Msg}</code>
    </div>
  );
}
