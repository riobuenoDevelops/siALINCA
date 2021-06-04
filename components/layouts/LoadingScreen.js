import { motion } from "framer-motion";
import Logo from "../../public/img/logo.png";

import { MoonLoader } from "react-spinners";

const LoadingScreen = () => {
  return (
    <div
      className="full-width full-height"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <motion.div
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{
          ease: "linear",
          duration: 2,
          repeat: Infinity,
        }}
      >
        <img src={Logo} alt="siALINCA logo" />
      </motion.div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          alignContent: "center",
          marginTop: "2em",
          marginLeft: "2.5em",
        }}
      >
        <MoonLoader size={40} color="#00B3EB" speedMultiplier={0.5} />
      </div>
    </div>
  );
};
export default LoadingScreen;
