import { Montserrat, Merriweather_Sans } from "next/font/google";
import "@/styles/globals.css";
import { Fragment } from "react";
import { Provider } from "react-redux";
import store from "@/store/store";
import CustomNavBar from "@/components/Header/CustomNavbar";
import Script from "next/script";
import { SocketContextProvider } from "@/store/SocketContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const merri = Merriweather_Sans({
  weight: "500",
  subsets: ["latin"],
});

const mont = Montserrat({
  weight: "400",
  subsets: ["latin"],
});

export default function App({ Component, pageProps }) {
  return (
    <Fragment>
      <Script
        src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
        integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
        crossOrigin=""
      ></Script>
      <style jsx global>
        {`
          .merri {
            font-family: ${merri.style.fontFamily};
          }
          .mont {
            font-family: ${mont.style.fontFamily};
          }
        `}
      </style>
      <SocketContextProvider>
        <Provider store={store}>
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
          <CustomNavBar />
          <Component {...pageProps} />
        </Provider>
      </SocketContextProvider>
    </Fragment>
  );
}
