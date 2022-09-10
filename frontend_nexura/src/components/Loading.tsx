import { FC } from "react";
import Lottie from "react-lottie-player";

const Loading: FC = () => {
  return (
    <div
      style={{
        zIndex: 10000,
        backgroundColor: "RGB(122, 207, 255, 0.2)",
        position: "fixed",
        top: "50%",
        left: "50%",
        marginRight: "-50%",
        transform: "translate(-50%, -50%)",
        width: "100%",
      }}
    >
      <Lottie
        loop
        animationData={require("../assets/animations/loading.json")}
        play
        style={{ transform: "scale(0.4)" }}
      />
    </div>
  );
};

export default Loading;
