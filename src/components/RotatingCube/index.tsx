import React, { useState, useEffect, useRef } from "react";
import CubeFace from "./CubeFace";
import styles from "./styles.module.scss";
import { getMarketBandData } from "utils/utils";
import APIS_CONFIG from "../../network/config.json";

// Declare global variables
declare const geoinfo: any;
declare global {
  interface Window {
    objMarketBand: any;
  }
}

interface CubeFaceData {
  template: string;
  topAdCode: string;
  bgColor: string;
  detail: string;
  dl: string;
}

interface RotatingCubeProps {
  objVc: any; // Using any as per your requirement
}

const RotatingCube: React.FC<RotatingCubeProps> = ({ objVc }) => {
  const [cubeData, setCubeData] = useState<CubeFaceData[]>([]);
  const [currentFaceIndex, setCurrentFaceIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [rotationDuration, setRotationDuration] = useState(7);
  const [positionStyle, setPositionStyle] = useState({});
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!sessionStorage.getItem("closeCube")) {
      const checkExist = setInterval(() => {
        if (window.objMarketBand && window.objMarketBand.bandData && window.objMarketBand.bandData["S1"]) {
          clearInterval(checkExist);
          setIsVisible(true); // Render the cube once data is ready
        } else {
          window.isDev && getMarketBandData(); // Fetch market band data if not available
        }
      }, 6e3); // Data updating every 6 sec
    }
  }, []);

  useEffect(() => {
    const fetchCubeData = async () => {
      const cube_faces = objVc?.global_cube_faces || "2";
      const cube_fullad = objVc?.global_cube_fullad || "0";
      const cube_landingon = (objVc?.global_cube_landingon || "sensex").toLowerCase();

      try {
        const response = await fetch(
          `${APIS_CONFIG.DOMAIN[window.APP_ENV]}cubefeed.cms?feedtype=etjson&platform=web&cube_faces=${cube_faces}&cube_fullad=${cube_fullad}&cube_landingon=${cube_landingon}`
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();

        if (data.cubeStatus === "0") {
          setIsVisible(false);
          return;
        }

        setRotationDuration(Number(data.timer) || 7);
        setCubeData(data.faces);

        // Set position style based on screen width
        const isWideScreen = window.innerWidth > 1003;
        const positionOffset = isWideScreen ? (window.innerWidth - 1003) / 2 + "px" : "160px";

        setPositionStyle({
          left: objVc?.position === "right" ? undefined : positionOffset,
          right: objVc?.position === "right" ? positionOffset : undefined,
          bottom: "5%"
        });
      } catch (error) {
        console.error("Failed to fetch cube data:", error);
      }
    };

    if (isVisible) {
      fetchCubeData();
    }
  }, [isVisible, objVc]);

  useEffect(() => {
    if (isVisible) {
      const startRotation = () => {
        intervalRef.current = setInterval(() => {
          setCurrentFaceIndex((prevIndex) => {
            return prevIndex + 1;
          });
        }, rotationDuration * 1000); // Convert seconds to milliseconds
      };

      startRotation();

      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    }
  }, [isVisible, cubeData, rotationDuration]);

  const handleMouseOver = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const handleMouseOut = () => {
    intervalRef.current = setInterval(() => {
      setCurrentFaceIndex((prevIndex) => prevIndex + 1);
    }, rotationDuration * 1000);
  };

  const handleClose = () => {
    setIsVisible(false);
    sessionStorage.setItem("closeCube", "true"); // Set closeCube in sessionStorage
  };

  if (!isVisible) {
    return null; // Return null if the cube is not visible
  }

  return (
    <div className={styles.cube} style={positionStyle} onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
      <div
        className={styles["cube-inner"]}
        style={{
          transform: `rotateY(${currentFaceIndex * -90}deg)`,
          transition: `transform 2100ms ease`
        }}
      >
        {cubeData.map((face, index) => (
          <CubeFace key={index} index={index} faceData={face} onClose={handleClose} />
        ))}
      </div>
      <iframe
        src={`${APIS_CONFIG.DOMAIN[window.APP_ENV]}comscore_cube.cms`}
        width={0}
        height={0}
        frameBorder={0}
        scrolling="no"
        marginHeight={0}
        marginWidth={0}
      ></iframe>
    </div>
  );
};

export default RotatingCube;
