import React, { useState, useEffect, useRef } from "react";
import {useCameraStore} from './store/camera-store';
import useLoadingStore from './store/loading-store';
import LogoLoader from './LogoLoader';
import CameraCard from "./CameraCard";
import Header from "./Header";
import PopupModal from "./PopupModal";
import obexLogo from "./obex-logo.png"
import './index.css'
import { useEventStore } from "./store/history-store";

export default function Dashboard() {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [error, setError] = useState("");
  const [askPermission, setAskPermission] = useState(true);

  const handleStartCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
        setAskPermission(false); // hide permission prompt
        setError("");
      }
    } catch (err) {
      setError("Camera access was denied or not supported.");
      console.error("Camera error:", err);
    }
  };

  const handleStopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      setAskPermission(true); // show permission prompt again
    }
  };







  const [isModalOpen, setIsModalOpen] = useState(false);
const [selectedCamera, setSelectedCamera] = useState(null);

  const [showMain, setShowMain] = useState(true)

  const {showLoading, hideLoading} = useLoadingStore();
  useEffect(() => {
    showLoading();
    setShowSection(false)
    setShowMain(false)
    const timer = setTimeout(() => {
      hideLoading();
      setShowSection(true)
      setShowMain(true)
    }, 3000);
    return () => clearTimeout(timer);
  }, []);
  

  const [showSection, setShowSection] = useState(true)

  const CameraStreams = useCameraStore((state) => state.CameraStreams)

  const addToCameraStreams = useCameraStore((state) => state.addToCameraStreams)

  const clearCameraStreams = useCameraStore((state) => state.clearCameraStreams);

const allcameras = [
  { id: 1, cameraName: "Entrance Camera", date: "2025/07/07", time: "21:30", threatLevel: "Low", ipAddress:"https://vdo.ninja/v17/?view=SN9rmgQ&label=PrimusLite_Camera" },
  { id: 2, cameraName: "Backyard Cam", date: "2025-07-07", time: "21:30", threatLevel: "Medium", ipAddress:"https://vdo.ninja/v17/?view=SN9rmgQ&label=PrimusLite_Camera" },
  { id: 3, cameraName: "Office Cam", date: "2025-07-07", time: "21:30", threatLevel: "High", ipAddress:"https://vdo.ninja/v17/?view=SN9rmgQ&label=PrimusLite_Camera"},
  { id: 4, cameraName: "Lobby Cam", date: "2025-07-07", time: "21:30", threatLevel: "Low", ipAddress:"https://vdo.ninja/v17/?view=SN9rmgQ&label=PrimusLite_Camera"},
  { id: 5, cameraName: "Hallway Cam", date: "2025-07-07", time: "21:30", threatLevel: "Medium", ipAddress:"https://vdo.ninja/v17/?view=SN9rmgQ&label=PrimusLite_Camera" },
  { id: 6, cameraName: "Garden Cam", date: "2025-07-07", time: "21:30", threatLevel: "High", ipAddress:"https://vdo.ninja/v17/?view=SN9rmgQ&label=PrimusLite_Camera" },
  { id: 7, cameraName: "Room Cam", date: "2025-07-07", time: "21:30", threatLevel: "Low", ipAddress:"https://vdo.ninja/v17/?view=SN9rmgQ&label=PrimusLite_Camera" },
  { id: 8, cameraName: "Ward Cam", date: "2025-07-07", time: "21:30", threatLevel: "Medium", ipAddress:"https://vdo.ninja/v17/?view=SN9rmgQ&label=PrimusLite_Camera" },
];


const cameraElement = CameraStreams.map(cam => (
  <CameraCard key={cam.id} {...cam} />
))



  function addCameraStream () {
    const nextCamera = allcameras.find(
      (cam) => !CameraStreams.some((c) => c.id === cam.id)
    );
  
    if (nextCamera) {
      showLoading();
      setTimeout(() => {
        addToCameraStreams(nextCamera);
        hideLoading();
      }, 2000);
    }
  // `  if (CameraStreams.length < allcameras.length) {
  //   showLoading()
  //   setTimeout(() => {
  //     addToCameraStreams(allcameras[CameraStreams.length]);
  //     hideLoading();
  //   }, 2000);
  // }`
  }

  // function handleClicks () {
  //   addCameraStream()
  // }

  function handleClicks() {
    const nextCamera = allcameras.find(
      (cam) => !CameraStreams.some((c) => c.id === cam.id)
    );
  
    if (nextCamera) {
      setSelectedCamera(nextCamera);
      setIsModalOpen(true); // Show modal
    }
  }

  
  

  function handleModalSave(ipAddress, zone, cameraName, date, time) {
    showLoading();
    setTimeout(() => {
      addToCameraStreams({
        ...selectedCamera,
        zoneCategory: zone,
        cameraName: cameraName || selectedCamera.cameraName,
        date: date || selectedCamera.date,
        time: time || selectedCamera.time,
        ipAddress: ipAddress || selectedCamera.ipAddress
      });
      hideLoading();
      setIsModalOpen(false); // Close modal
      setSelectedCamera(null);
    }, 1000);
  }
  
// ASK IF SURE TO CLEAR CAMERA
  const handleClearCameras = () => {
    const confirmed = window.confirm("Are you sure you want to clear all cameras?");
    if (confirmed) {
      clearCameraStreams(); // from Zustand store
    }
  };

  
  return (
    <>
    <Header />
    <LogoLoader />
    {isModalOpen && (
  <PopupModal
    // ip={selectedCamera?.ipAddress}
    onSave={handleModalSave}
    onCancel={() => setIsModalOpen(false)}
  />
)}
  
    {showMain && <main className="mt-10 bg-gray-800 w-[90vw] h-auto   m-auto rounded-lg shadow shadow-cyan-400/50 mb-10 pb-10 pt-5 xl:w-[95vw]">
<article className="flex justify-between items-center m-5">
    <figure className=" flex text-3xl items-center gap-2 xl:ml-10 lg:ml-8 md:ml-6 ml-8">
    <svg className="h-6 w-6 md:h-8 md:w-8 lg:h-10 lg:w-10 text-cyan-400 "
                    fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round"
                        d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
                </svg>
      <h1 className="text-[16px] md:text-2xl lg:text-3xl font-bold  text-gray-100">Live Feed</h1>
      </figure>

      <figure className="flex items-center gap-5 xl:gap-5 md:gap-5">
        <button className="relative cursor-pointer  text-gray-100 md:hidden group"><i className="fa fa-search rounded-full"></i><span className="hidden group-hover:block absolute bottom-10 text-[14px]">Search for camera</span></button>
        <input type="text"  className="cursor-pointer hidden md:block xl:w-100 md:h-8 md:p-3 xl:h-10 bg-gray-900 outline-1 outline-cyan-700 rounded-full text-gray-100 xl:p-5" placeholder="Search Camera"/>
        {CameraStreams.length > 0 && (
          <>
          <button onClick={handleClearCameras} className="cursor-pointer outline-1 outline-cyan-700 w-40 h-10 rounded-lg text-gray-100 bg-gray-900 hidden md:block md:w-35 md:h-8 md:text-[14px]"><i className="fa-solid fa-trash"></i> clear all camera</button>

          {/* MOBILE CLEAR BTN */}
        <button onClick={handleClearCameras} className="relative group cursor-pointer text-gray-100  md:hidden xl:hidden w-8 h-8 p-2 bg-gray-900 text-[12px] rounded-full"><i className="fa-solid fa-trash"></i><span className="hidden group-hover:block absolute bottom-10">clear all cameras</span></button> 
        </>)}
      {/* Disable "+" When All Cameras Are Added */}
      {CameraStreams.length < allcameras.length && <button onClick={handleClicks} className="cursor-pointer text-sm  text-gray-100 px-3 py-2 rounded-lg animate-bounce outline-2 outline-cyan-400 mr-10 lg:mr-20 " ><i className="fa fa-plus" aria-hidden="true"></i></button>}
      </figure>
    </article>


    {/* Hide “Add Stream” Section When Cameras Exist */}
    {/* <PopupModal /> */}
    {CameraStreams.length === 0  && <><section className="flex justify-center items-center mt-10 relative">
    <article className="grid place-content-center place-items-center bg-black/50 w-[80vw] xl:w-[90vw] h-[70vh] rounded-lg outline outline-cyan-900 shadow-md shadow-cyan-400/50 overflow-hidden">

    {/* BUTTON FOR ACCESSING LIVE WEBCAM (lg screen) */}
    <a href="#webcam" className="bg-cyan-600 p-2 rounded-lg text-white font-[500] md:absolute md:right-20 md:top-10 hidden md:block hover:bg-cyan-700">Access live webcam</a>
    {/* <i className="fa-solid fa-camera-retro text-cyan-400 text-[100px] "></i> */}
    <i className="fa fa-camera-retro  text-cyan-400 text-[50px] lg:text-[100px]"></i>
      <h2 className="text-[20px] lg:text-[40px] font-bold text-gray-100 mb-6 mt-6"> Add Camera Stream</h2>
      <p className="text-sm md:text-md lg:text-lg xl:text-xl 2xl:text-2xl text-gray-100 text-center w-[60%] mb-6"><span className="text-md font-bold text-cyan-400">Click on the Plus Icon to add camera stream.<br></br></span>
        This will allow you to connect a new camera feed to the dashboard in real time. 
      Make sure the stream URL is accessible and correctly connected.</p>
      
      {/* BUTTON FOR ACCESSING LIVE WEBCAM (sm screen)*/}
      <a href="#webcam" className="bg-cyan-600 p-3 rounded-lg text-white font-[500]  mt-10 md:hidden hover:bg-cyan-700">Access live webcam</a>
    </article>

    </section> 
    
    
    <section id="webcam" className="grid place-items-center mt-10">
  <div className="relative bg-black/50 rounded-2xl shadow-md shadow-cyan-400/50 overflow-hidden w-[80vw] md:w-[80vw] xl:w-[60vw] aspect-video cursor-pointer outline outline-cyan-900 focus-within:outline-cyan-400 hover:outline-cyan-400">
    
    {/* Ask Permission Prompt */}
    {askPermission && !stream && (
      <div className="absolute inset-0 z-10 grid place-items-center bg-black/60 text-white">
        <div className="text-center">
          <p className="mb-4 w-[70vw] md:text-lg xl:text-xl xl:w-[60vw]">
            This app would like to access your camera. Do you want to allow it?
          </p>
          <button
            onClick={handleStartCamera}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 transition rounded-md cursor-pointer"
          >
            Yes, Allow Camera
          </button>
        </div>
      </div>
    )}

    {/* Close Button */}
    {stream && (
      <button
        onClick={handleStopCamera}
        className="absolute top-4 right-4 px-4 py-2 bg-red-600 text-white rounded-md z-10 hover:bg-red-700 transition"
      >
        Close Camera
      </button>
    )}

    {/* Error Message */}
    {error && (
      <p className="text-red-500 text-center mt-2">{error}</p>
    )}

    {/* Video */}
    <video
      ref={videoRef}
      autoPlay
      className="w-full h-full object-cover"
    />
  </div>
</section>
    </>}

      

      <section className=" grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3  gap-y-10  place-items-center 2xl:grid-cols-3 m-auto">

      {/* Show Camera Streams, Declared by mapping through the cameraStreams array */}
        {cameraElement}
    
      </section>



      
    </main> }
    </>
  );
}



