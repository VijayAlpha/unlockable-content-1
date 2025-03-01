import { WalletContextProvider } from "@mintbase-js/react";
import "@near-wallet-selector/modal-ui/styles.css";
import "../public/assets/css/bootstrap.min.css";
import "../public/assets/css//icofont.min.css";
import "../public/assets/css/animate.css";
import "../public/assets/css/lightcase.css";
import "../public/assets/css/swiper-bundle.min.css";
import "../public/assets/css/style.css";

import { NavBar } from "../components/NavBar";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { mbjs, NEAR_NETWORKS } from "@mintbase-js/sdk";

const mbjsConfig =
  process.env.NEXT_PUBLIC_NEAR_NETWORK === "mainnet"
    ? {
        network: NEAR_NETWORKS.MAINNET,
      }
    : {
        network: NEAR_NETWORKS.TESTNET,
      };

mbjs.config(mbjsConfig);

mbjs.keys.apiKey = "omni-site";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <WalletContextProvider>
        <Header />
        <NavBar />
        <Component {...pageProps} />
        <Footer />
      </WalletContextProvider>
    </>
  );
}

export default MyApp;
