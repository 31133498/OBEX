import React, { useState, useEffect, useRef } from "react";
import { useCameraStore } from './store/camera-store';
import { useEventStore } from "./store/history-store"; // <-- ZUSTAND STORE for event logging

export default function CameraCard({ cameraName, date, time, threatLevel, id, url, zoneCategory }) {

  const threatColors = {
    Low: "bg-green-500",
    Medium: "bg-yellow-400",
    High: "bg-red-500"
  };

  const cameraStreams = useCameraStore((state) => state.cameraStreams)
  const removeFromCameraStreams = useCameraStore((state) => state.removeFromCameraStreams)

  // ✅ Function to log view event
  const handleView = () => {
    const timestamp = new Date().toISOString();
    useEventStore.getState().addEvent({
      id,
      cameraName,
      date,
      time,
      ipAddress: url,
      threatLevel,
      zoneCategory: zoneCategory || "Unknown",
      type: 'VIEWED',
      timestamp,
    });
  };

  // ✅ Function to handle deletion
  const handleConfirmation = () => {
    let isConfirmed = window.confirm("Are you sure you want to delete this camera stream?");
    if (isConfirmed) {
      const timestamp = new Date().toISOString();
      useEventStore.getState().addEvent({
        id,
        cameraName,
        date,
        time,
        ipAddress: url,
        threatLevel,
        zoneCategory: zoneCategory || "Unknown",
        type: 'DELETED',
        timestamp,
      });
      removeFromCameraStreams(id);
    } else {
      cameraStreams();
    }
  };

  return (
    <section
      className="bg-[#1F2937] rounded-2xl shadow-md shadow-cyan-400/50 overflow-hidden w-[80vw] h-[320px] sm:w-[80vw] sm:h-[420px] md:w-[40vw] md:h-[320px] lg:w-[40vw] lg:h-[420px] xl:w-[25vw] xl:h-[320px] 2xl:w-[28vw] 2xl:h-[420px] cursor-pointer hover:scale-105 transition-all duration-300 2xl:mt-10 outline outline-2  focus-within:outline-cyan-400 hover:outline-cyan-400"
      onClick={handleView} // Log view when clicked
    >
      <div className="bg-black h-[240px] w-full flex items-center justify-center text-white sm:h-[340px] md:h-[240px] lg:h-[340px] xl:h-[240px] 2xl:h-[340px]">
        <iframe
          src={url}
          allow="camera; microphone; autoplay"
          allowFullScreen
          className="w-full h-full border-none"
        />
      </div>

      <div className="p-2 flex justify-between items-center m-2 ">
        <div>
          <p className="text-[#FFFFFF] text-sm">{date}</p>
          <p className="text-[#FFFFFF] text-sm">{time}</p>
          <p className="text-[#FFFFFF] text-sm font-[700] uppercase">{cameraName}</p>
        </div>

        <article className="flex flex-col items-center justify-center">
          <h3 className="text-white bg-red-700  font-bold text-[12px] animate-ping ">THREAT DETECTED!!!</h3>
          <p className={`text-white text-xs font-bold px-3 py-1 rounded-full ${threatColors[threatLevel]} text-center`}>
            {threatLevel}
          </p>
        </article>

        <button
          onClick={(e) => {
            e.stopPropagation(); // prevent triggering handleView
            handleConfirmation();
          }}
          className="text-[10px] text-white bg-blue-800 rounded-full p-2 cursor-pointer"
        >
          Delete
        </button>
      </div>
    </section>
  );
}


























// import React, { useState, useEffect, UseRef} from "react";
// import {useCameraStore} from './store/camera-store';
// import { useEventStore } from "./store/history-store";
// // import useLoadingStore from "./store/loading-store";


// export default function CameraCard({ cameraName, date, time, threatLevel, id, url }) {

//   const threatColors = {
//     Low: "bg-green-500",
//     Medium: "bg-yellow-400",
//     High: "bg-red-500"
//   };

//   const cameraStreams = useCameraStore((state) => state.cameraStreams)
//   const removeFromCameraStreams = useCameraStore((state) => state.removeFromCameraStreams)

//   function deleteCamera () {
//     removeFromCameraStreams(id)
//   }

//   function leaveCameraStreams () {
//     cameraStreams()
//   }

//   function handleConfirmation () {
//     let isConfirmed = window.confirm("Are you sure you want to delete this camera stream?");
//     if (isConfirmed === true) {
//       deleteCamera()
//     } else if (isConfirmed === false) {
//       leaveCameraStreams()
//     }
//   }
//   // THIS FUNCTION IS PASSING BOTH THE CONFIRMATION AND THE DELETE FUNCTION
//   function handleDelete () {
//     handleConfirmation()
//     deleteCamera()
//   }
//   return (
//     <section className="bg-[#1F2937] rounded-2xl shadow-md shadow-cyan-400/50 overflow-hidden w-[80vw] h-[320px] sm:w-[80vw] sm:h-[420px] md:w-[40vw] md:h-[320px] lg:w-[40vw] lg:h-[420px] xl:w-[25vw] xl:h-[320px] 2xl:w-[28vw] 2xl:h-[420px] cursor-pointer hover:scale-105 transition-all duration-300 2xl:mt-10 outline outline-2  focus-within:outline-cyan-400 hover:outline-cyan-400">
//       <div className="bg-black h-[240px] w-full flex items-center justify-center text-white sm:h-[340px] md:h-[240px] lg:h-[340px] xl:h-[240px] 2xl:h-[340px]">
//         {/* Replace with actual video stream */}
//         {/* <video controls autoPlay muted loop poster="thumbnail.jpg" className="w-full h-full object-cover object-center">
//         <source src="https://vdo.ninja/v17/?view=SN9rmgQ&label=PrimusLite_Camera" type="video/mp4"/>
//         </video> */}
//         <iframe
//         src={url}
//         allow="camera; microphone; autoplay"
//         allowFullScreen
//         className="w-full h-full border-none"
//       />
//       </div>
//       <div className="p-2 flex justify-between items-center m-2 ">
//         <div>
//           <p className="text-[#FFFFFF] text-sm">{date}</p>
//           <p className="text-[#FFFFFF] text-sm">{time}</p>
//           <p className="text-[#FFFFFF] text-sm font-[700] uppercase">{cameraName}</p>
//         </div>

//         <article className="flex flex-col items-center justify-center">
//           <h3 className="text-white bg-red-700  font-bold text-[12px] animate-ping ">THREAT DETECTED!!!</h3>
//         <p className={`text-white text-xs font-bold px-3 py-1 rounded-full ${threatColors[threatLevel]} text-center`}>
//           {threatLevel}
//         </p>
//         </article>
//         <button onClick={handleDelete} className="text-[10px] text-white bg-blue-800 rounded-full p-2 cursor-pointer">Delete</button>
//       </div>
//     </section>
//   );
// }
