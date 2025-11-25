import "../styles/globals.css";
// import "antd/dist/reset.css"; // Not strictly necessary for Antd v5 but can help reset styles if needed.
// Ant Design v5 uses CSS-in-JS, so strict CSS import is not always required, but global reset is good.

//INTERNAL IMPORT 

import { TrackingProvider } from "../Context/TrackingContext";

import {Footer} from "../Components";
import { ConfigProvider } from 'antd';


export default function App({ Component, pageProps }) {

  return (
  <>
    <ConfigProvider>
      <TrackingProvider>
      <Component {...pageProps} />
      </TrackingProvider>
      <Footer />
    </ConfigProvider>
 </>
  );
}
