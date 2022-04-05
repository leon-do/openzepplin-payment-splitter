import Head from "next/head";
import Link from "next/link";
import styles from "../styles/Home.module.css";
import Footer from "../components/footer";

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>OZ Payment Splitter</title>
        <meta name="description" content="Open Zepplin Payment Splitter" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Open Zepplin{" "}
          <a target="_blank" rel="noreferrer" href="https://docs.openzeppelin.com/contracts/2.x/api/payment">
            Payment Splitter
          </a>
        </h1>

        <p className={styles.code}>function release(address payable account) public virtual </p>

        <div className={styles.grid}>
          <Link href="/create" passHref>
            <a className={styles.card}>
              <h2>Create New &rarr;</h2>
              <p>Deploy a new contract and any EVM.</p>
            </a>
          </Link>

          <Link href="/split" passHref>
            <a className={styles.card}>
              <h2>Split Existing &rarr;</h2>
              <p>Split payments among a group of accounts.</p>
            </a>
          </Link>

          <a target="_blank" rel="noreferrer" href="https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/finance/PaymentSplitter.sol" className={styles.card}>
            <h2>Source Code &rarr;</h2>
            <p>Build on a solid foundation of community-vetted code.</p>
          </a>
        </div>
      </main>

      <Footer />
    </div>
  );
}
