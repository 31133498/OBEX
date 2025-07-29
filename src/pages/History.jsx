// HistoryPage.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useEventStore } from '../store/history-store';
import VideoModal from '../VideoModal';
import Header from '../Header';
import LogoLoader from '../LogoLoader';
import useLoadingStore from '../store/loading-store';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function History() {
//LOAD BEFORE IT SHOWS HISTORY PAGE
  const [showHistory, setShowHistory] = useState(false)

  const {showLoading, hideLoading} = useLoadingStore();
  useEffect(() => {
    showLoading();
    const timer = setTimeout(() => {
      hideLoading();
      handleShowHistory()
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  function handleShowHistory () {
    setShowHistory(!showHistory)
  }

  const { events } = useEventStore();
  const [search, setSearch] = useState('');
  const [filterThreat, setFilterThreat] = useState('');
  const [filterDate, setFilterDate] = useState('');

  const formatTimestamp = (ts) => new Date(ts).toLocaleString();

  const filteredEvents = events.filter((e) =>
    (!search || String(e.cameraName || '').toLowerCase().includes(search.toLowerCase())) &&
    (!filterThreat || (e.threatLevel || '') === filterThreat) &&
    (!filterDate || (e.date || '') === filterDate)
  );
  
  

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text('Camera Event History', 14, 15);

    const tableData = filteredEvents.map((e) => [
      e.cameraName,
      e.zoneCategory,
      e.date,
      e.time,
      e.ipAddress,
      e.threatLevel,
      e.type || 'ADDED',
      formatTimestamp(e.timestamp),
    ]);

    autoTable(doc, {
      startY: 20,
      head: [[
        'Camera', 'Zone', 'Date', 'Time', 'IP', 'Threat', 'Action', 'Timestamp'
      ]],
      body: tableData,
    });

    doc.save('camera_history.pdf');
  };

  return (
    <>
    <Header />
    <LogoLoader />

    {showHistory &&<div className="p-6 text-white">
      <h1 className="text-2xl text-cyan-400 text-[20px] md:text-[30px] xl:text-[40px] font-bold mb-4">Camera Event History</h1>

      <section className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          type="text"
          placeholder="Search by camera name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 rounded-md bg-gray-700"
        />
        <select
          value={filterThreat}
          onChange={(e) => setFilterThreat(e.target.value)}
          className="p-2 rounded-md bg-gray-700"
        >
          <option value="">All Threats</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="p-2 rounded-md bg-gray-700"
        />
      </section>

      <button onClick={exportToPDF} className="bg-cyan-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm mb-4 font-bold">
        Export to PDF
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEvents.map((event, index) => (
          <div key={index} className="bg-gray-800 rounded-xl p-4 border border-cyan-900">
            <h2 className="text-lg font-semibold text-cyan-300">{String(event.cameraName)}</h2>
            <p className="text-sm text-gray-400">Zone: <span className="text-white">{String(event.zone)}</span></p>
            <p className="text-sm text-gray-400">Date: {String(event.date)}</p>
            <p className="text-sm text-gray-400">Time: {String(event.time)}</p>
            <p className="text-sm text-gray-400 truncate">IP: {String(event.ipAddress)}</p>
            <p className={`text-xs mt-2 inline-block px-3 py-1 rounded-full font-bold ${
              event.threatLevel === 'High' ? 'bg-red-600' :
              event.threatLevel === 'Medium' ? 'bg-yellow-500' :
              'bg-green-500'
            }`}>
              Threat: {String(event.threatLevel)}
            </p>
            <p className="mt-2 text-xs italic text-gray-400">
              Action: {String(event.type || 'ADDED')} at {formatTimestamp(event.timestamp)}
            </p>
          </div>
        ))}
      </div>
    </div>}
    </>
  );
}







//THE HISTORY CODE I MET HERE//

// const History = () => {
//   const { setActive } = useNavStore();
//   const [detections, setDetections] = useState([]);
//   const [filter, setFilter] = useState('');

//   useEffect(() => {
//     setActive('history');
//     const fetchDetections = async () => {
//       try {
//         const response = await fetch('http://localhost:8000/api/detections', {
//           headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
//         });
//         if (!response.ok) throw new Error('Failed to fetch detections');
//         const data = await response.json();
//         setDetections(data);
//       } catch (error) {
//         console.error('Error fetching detections:', error);
//       }
//     };
//     fetchDetections();
//   }, [setActive]);

//   const filteredDetections = detections.filter(
//     (d) =>
//       d.type.toLowerCase().includes(filter.toLowerCase()) ||
//       d.timestamp.toLowerCase().includes(filter.toLowerCase())
//   );

//   return (
//     <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6 lg:p-10">
//       <h1 className="text-3xl font-bold text-cyan-200 mb-6">Detection History</h1>
//       <div className="mb-4">
//         <input
//           type="text"
//           placeholder="Filter by type or date..."
//           value={filter}
//           onChange={(e) => setFilter(e.target.value)}
//           className="w-full max-w-md px-4 py-2 rounded-md bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-400"
//         />
//       </div>
//       <div className="overflow-x-auto">
//         <table className="w-full text-left border-collapse">
//           <thead>
//             <tr className="bg-gray-800">
//               <th className="p-3 text-sm font-medium text-cyan-200">Timestamp</th>
//               <th className="p-3 text-sm font-medium text-cyan-200">Type</th>
//               <th className="p-3 text-sm font-medium text-cyan-200">Camera</th>
//               <th className="p-3 text-sm font-medium text-cyan-200">Details</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredDetections.length > 0 ? (
//               filteredDetections.map((detection) => (
//                 <tr key={detection.id} className="border-b border-gray-700 hover:bg-gray-700">
//                   <td className="p-3">{new Date(detection.timestamp).toLocaleString()}</td>
//                   <td className="p-3">{detection.type}</td>
//                   <td className="p-3">{detection.cameraId}</td>
//                   <td className="p-3">{detection.details}</td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan={4} className="p-3 text-center">No detections found</td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default History;
