import { useState } from "react";
import { useEventStore } from "./store/history-store"; // ✅ Import the history store
import { useCameraStore } from "./store/camera-store";

export default function PopupModal({ onSave, onCancel }) {
  const [ipAddress, setIpAddress] = useState("");
  const [zone, setZone] = useState("");
  const [cameraName, setCameraName] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const addEvent = useEventStore((state) => state.addEvent); // ✅ Hook to log the event

  function handleSaveClick() {
    // ✅ Log to history before saving
    addEvent({
      cameraName,
      zone,
      // threatLevel, TO WORK ON THREAT LEVEL LATER
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString(), 
      ipAddress,
      type: "ADDED",
      timestamp: new Date().toISOString(),
      description: `Added camera "${cameraName}" in ${zone} zone with IP: ${ipAddress}`,
    });

    onSave(ipAddress, zone, cameraName, date, time);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-[250px] sm:w-full sm:max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-zinc-900">
        <h2 className="mb-4 text-xl font-semibold text-cyan-900">Add New Camera</h2>

        <label className="mb-2 block text-sm font-medium text-cyan-900">IP Address</label>
        <input
          type="text"
          value={ipAddress}
          onChange={(e) => setIpAddress(e.target.value)}
          className="mb-4 w-full rounded border border-gray-300 bg-gray-100 p-2 text-sm"
        />

        
        <label className="mb-2 block text-sm font-medium text-cyan-900">Zone Category</label>
        <select
          value={zone}
          onChange={(e) => setZone(e.target.value)}
          className="mb-4 w-full rounded border border-gray-300 p-2 text-sm dark:bg-zinc-800 dark:text-white"
        >
          <option value="">-- Select Zone Category --</option>
          <option value="public">Public</option>
          <option value="private">Private</option>
          <option value="closure">Closure</option>
          <option value="vault">Vault</option>
        </select>

        <label className="mb-2 block text-sm font-medium text-cyan-900">Camera Name</label>
        <input
          type="text"
          value={cameraName}
          onChange={(e) => setCameraName(e.target.value)}
          placeholder="e.g. Backyard"
          className="mb-4 w-full rounded border border-gray-300 p-2 text-sm dark:bg-zinc-800 dark:text-white"
        />

        <label className="mb-2 block text-sm font-medium text-cyan-900">Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="mb-4 w-full rounded border border-gray-300 p-2 text-sm dark:bg-zinc-800 dark:text-white"
        />

        <label className="mb-2 block text-sm font-medium text-cyan-900">Time</label>
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="mb-4 w-full rounded border border-gray-300 p-2 text-sm dark:bg-zinc-800 dark:text-white"
        />

        <div className="flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-zinc-800"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveClick}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
















// import { useState } from "react";

// export default function PopupModal({ onSave, onCancel }) {
//   const [ipAddress, setIpAddress] = useState("");
//   const [zone, setZone] = useState("public");
//   const [cameraName, setCameraName] = useState("");
//   const [date, setDate] = useState("")
//   const [time, setTime] = useState("")
  

//   function handleSaveClick() {
//     onSave(ipAddress, zone, cameraName, date, time);
//   }

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
//       <div className=" w-[250px] sm:w-full sm:max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-zinc-900 ">
//         <h2 className="mb-4 text-xl font-semibold text-cyan-900">Add New Camera</h2>

//         <label className="mb-2 block text-sm font-medium text-cyan-900">IP Address</label>
//         <input
//           type="text"
//           value={ipAddress}
//           onChange={(e) => setIpAddress(e.target.value)}
//           className="mb-4 w-full rounded border border-gray-300 bg-gray-100 p-2 text-sm"
//         />

//         <label className="mb-2 block text-sm font-medium text-cyan-900">Zone Category</label>
//         <select
//           value={zone}
//           onChange={(e) => setZone(e.target.value)}
//           className="mb-4 w-full rounded border border-gray-300 p-2 text-sm dark:bg-zinc-800 dark:text-white"
//         >
//           <option value="public">Public</option>
//           <option value="private">Private</option>
//           <option value="closure">Closure</option>
//           <option value="vault">Vault</option>
//         </select>

//         <label className="mb-2 block text-sm font-medium text-cyan-900">Camera Name</label>
//         <input
//           type="text"
//           value={cameraName}
//           onChange={(e) => setCameraName(e.target.value)}
//           placeholder="e.g. Backyard"
//           className="mb-4 w-full rounded border border-gray-300 p-2 text-sm dark:bg-zinc-800 dark:text-white"
//         />

//           <label className="mb-2 block text-sm font-medium text-cyan-900">Date</label>
//           <input
//           type="date"
//           value={date}
//           onChange={(e) => setDate(e.target.value)}
//           className="mb-4 w-full rounded border border-gray-300 p-2 text-sm dark:bg-zinc-800 dark:text-white"
//         />

//           <label className="mb-2 block text-sm font-medium text-cyan-900">Time</label>
//           <input
//           type="time"
//           value={time}
//           onChange={(e) => setTime(e.target.value)}
//           className="mb-4 w-full rounded border border-gray-300 p-2 text-sm dark:bg-zinc-800 dark:text-white"
//         />

//         <div className="flex justify-end gap-2">
//           <button
//             onClick={onCancel}
//             className="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-zinc-800"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleSaveClick}
//             className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
//           >
//             Save
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }



















































// import { useState } from "react";

// export default function PopupModal () {
// // const [isPopupSaved, setIsPopupSaved] = useState(true)

// // function handleIsPopupSaved () {
// //   setIsPopupSaved(!isPopupSaved)
// // }

//     const IP_ADDRESS = "192.168.0.143"
//     return (
//         <>
//          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
//           <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-zinc-900">
//             <h2 className="mb-4 text-xl font-semibold text-cyan-900">Add New Camera</h2>
    
//             {/* Hard‑coded IP, read‑only */}
//             <label className="mb-2 block text-sm font-medium text-cyan-900">IP Address</label>
//             <input
//               type="text"
//               value={IP_ADDRESS}
//               readOnly
//               className="mb-4 w-full rounded border border-gray-300 bg-gray-100 p-2 text-sm"
//             />
    
//             {/* Zone category dropdown */}
//             <label className="mb-2 block text-sm font-medium text-cyan-900">Zone Category</label>
//             <select
//               className="mb-4 w-full rounded border border-gray-300 p-2 text-sm dark:bg-zinc-800 dark:text-white"
//             >
//               <option value="public">Public</option>
//               <option value="private">Private</option>
//               <option value="closure">Closure</option>
//               <option value="vault">Vault</option>
//             </select>
    
//             {/* Camera name */}
//             <label className="mb-2 block text-sm font-medium text-cyan-900">Camera Name</label>
//             <input
//               type="text"
//               placeholder="e.g. Backyard"
//               className="mb-4 w-full rounded border border-gray-300 p-2 text-sm dark:bg-zinc-800 dark:text-white"
//             />
    
//             {/* Real‑time clock */}
//             <div className="mb-6 text-sm text-gray-600 dark:text-gray-300">
//               <span className="font-medium text-cyan-900">Current Date:</span><input type="date"></input><br />
//               <span className="font-medium text-cyan-900">Current Time:</span><input type="time"></input>
//             </div>
    
//             {/* Action buttons */}
//             <div className="flex justify-end gap-2">
//               <button
//                 className="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-zinc-800"
//               >
//                 Cancel
//               </button>
//               <button
//                 className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
//               >
//                 Save
//               </button>
//             </div>
//           </div>
//         </div> 
//         </>
//       );
//     }





// return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
//       <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-zinc-900">
//         <h2 className="mb-4 text-xl font-semibold">Add New Camera</h2>

//         {/* Hard‑coded IP, read‑only */}
//         <label className="mb-2 block text-sm font-medium">IP Address</label>
//         <input
//           type="text"
//           value={IP_ADDRESS}
//           readOnly
//           className="mb-4 w-full rounded border border-gray-300 bg-gray-100 p-2 text-sm"
//         />

//         {/* Zone category dropdown */}
//         <label className="mb-2 block text-sm font-medium">Zone Category</label>
//         <select
//           value={zone}
//           onChange={e => setZone(e.target.value)}
//           className="mb-4 w-full rounded border border-gray-300 p-2 text-sm dark:bg-zinc-800 dark:text-white"
//         >
//           <option value="public">Public</option>
//           <option value="private">Private</option>
//           <option value="closure">Closure</option>
//           <option value="vault">Vault</option>
//         </select>

//         {/* Camera name */}
//         <label className="mb-2 block text-sm font-medium">Camera Name</label>
//         <input
//           type="text"
//           placeholder="e.g. Backyard"
//           value={cameraName}
//           onChange={e => setCameraName(e.target.value)}
//           className="mb-4 w-full rounded border border-gray-300 p-2 text-sm dark:bg-zinc-800 dark:text-white"
//         />

//         {/* Real‑time clock */}
//         <div className="mb-6 text-sm text-gray-600 dark:text-gray-300">
//           <span className="font-medium">Current Date:</span> {dateTime.toLocaleDateString()}<br />
//           <span className="font-medium">Current Time:</span> {dateTime.toLocaleTimeString()}
//         </div>

//         {/* Action buttons */}
//         <div className="flex justify-end gap-2">
//           <button
//             onClick={onClose}
//             className="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-zinc-800"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleSave}
//             className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
//           >
//             Save
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
