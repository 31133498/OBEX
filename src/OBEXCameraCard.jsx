import React, { useState, useEffect } from "react";
import { useCameraStore } from './store/camera-store';
import { useEventStore } from "./store/history-store";

export default function OBEXCameraCard({ cameraName, date, time, threatLevel, id, zoneCategory }) {
  const [alerts, setAlerts] = useState([]);
  const [latestAlert, setLatestAlert] = useState(null);
  const [performance, setPerformance] = useState(null);
  const [showHeatmap, setShowHeatmap] = useState(false);

  const threatColors = {
    Low: "bg-green-500",
    Medium: "bg-yellow-400",
    High: "bg-red-500"
  };

  const cameraStreams = useCameraStore((state) => state.cameraStreams);
  const removeFromCameraStreams = useCameraStore((state) => state.removeFromCameraStreams);

  // Poll OBEX alerts and performance
  useEffect(() => {
    const fetchOBEXData = async () => {
      try {
        const [theftRes, suspiciousRes, performanceRes] = await Promise.all([
          fetch('http://localhost:8000/theft_alerts'),
          fetch('http://localhost:8000/suspicious_behavior'),
          fetch('http://localhost:8000/performance')
        ]);

        const theftData = await theftRes.json();
        const suspiciousData = await suspiciousRes.json();
        const performanceData = await performanceRes.json();

        let allAlerts = [];
        
        if (theftData.theft_alerts) {
          allAlerts = allAlerts.concat(
            theftData.theft_alerts.map(a => ({
              type: 'theft',
              id: a.object_id,
              time: new Date(a.timestamp * 1000).toLocaleTimeString(),
              details: a.details,
              owner: a.owner_id
            }))
          );
        }
        
        if (suspiciousData.suspicious_behavior) {
          allAlerts = allAlerts.concat(
            suspiciousData.suspicious_behavior.map(a => ({
              type: 'suspicious',
              id: a.person_id,
              time: new Date(a.timestamp * 1000).toLocaleTimeString(),
              details: a.details,
              behavior: a.behavior_type
            }))
          );
        }

        setAlerts(allAlerts);
        setLatestAlert(allAlerts[0] || null);
        setPerformance(performanceData);
      } catch (error) {
        console.error('Error fetching OBEX data:', error);
      }
    };

    fetchOBEXData();
    const interval = setInterval(fetchOBEXData, 2000); // Poll every 2 seconds
    return () => clearInterval(interval);
  }, []);

  // Function to log view event
  const handleView = () => {
    const timestamp = new Date().toISOString();
    useEventStore.getState().addEvent({
      id,
      cameraName,
      date,
      time,
      ipAddress: "http://localhost:8000/video_feed",
      threatLevel,
      zoneCategory: zoneCategory || "OBEX Security",
      type: 'VIEWED',
      timestamp,
    });
  };

  // Function to handle deletion
  const handleConfirmation = () => {
    let isConfirmed = window.confirm("Are you sure you want to delete this OBEX camera stream?");
    if (isConfirmed) {
      const timestamp = new Date().toISOString();
      useEventStore.getState().addEvent({
        id,
        cameraName,
        date,
        time,
        ipAddress: "http://localhost:8000/video_feed",
        threatLevel,
        zoneCategory: zoneCategory || "OBEX Security",
        type: 'DELETED',
        timestamp,
      });
      removeFromCameraStreams(id);
    }
  };

  const getAlertColor = (alertType) => {
    switch (alertType) {
      case 'theft': return 'bg-red-600';
      case 'suspicious': return 'bg-orange-600';
      default: return 'bg-yellow-600';
    }
  };

  const getAlertIcon = (alertType) => {
    switch (alertType) {
      case 'theft': return '🚨';
      case 'suspicious': return '⚠️';
      default: return '🔔';
    }
  };

  return (
    <section
      className="bg-[#1F2937] rounded-2xl shadow-md shadow-cyan-400/50 overflow-hidden w-[80vw] h-[320px] sm:w-[80vw] sm:h-[420px] md:w-[40vw] md:h-[320px] lg:w-[40vw] lg:h-[420px] xl:w-[25vw] xl:h-[320px] 2xl:w-[28vw] 2xl:h-[420px] cursor-pointer hover:scale-105 transition-all duration-300 2xl:mt-10 outline outline-2 focus-within:outline-cyan-400 hover:outline-cyan-400"
      onClick={handleView}
    >
      <div className="bg-black h-[240px] w-full flex items-center justify-center text-white sm:h-[340px] md:h-[240px] lg:h-[340px] xl:h-[240px] 2xl:h-[340px] relative">
        {/* OBEX Video Feed */}
        <img
          src="http://localhost:8000/video_feed"
          alt="OBEX Security Feed"
          className="w-full h-full object-cover"
        />
        
        {/* Latest Alert Overlay */}
        {latestAlert && (
          <div className={`absolute top-2 left-2 right-2 ${getAlertColor(latestAlert.type)} text-white p-2 rounded-lg text-xs`}>
            <div className="flex items-center gap-2">
              <span>{getAlertIcon(latestAlert.type)}</span>
              <span className="font-bold">
                {latestAlert.type === 'theft' ? 'THEFT DETECTED!' :
                 latestAlert.type === 'suspicious' ? 'SUSPICIOUS BEHAVIOR!' :
                 'ALERT!'}
              </span>
            </div>
            <div className="text-xs mt-1">
              {latestAlert.details}
            </div>
          </div>
        )}

        {/* Performance Indicator */}
        {performance && (
          <div className="absolute bottom-2 right-2 bg-black/70 text-white p-1 rounded text-xs">
            <div>FPS: {performance.fps}</div>
            <div>Processing: {(performance.avg_processing_time * 1000).toFixed(1)}ms</div>
          </div>
        )}

        {/* Heatmap Toggle */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowHeatmap(!showHeatmap);
          }}
          className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded text-xs"
        >
          {showHeatmap ? 'Hide' : 'Show'} Heatmap
        </button>

        {/* Heatmap Overlay */}
        {showHeatmap && (
          <img
            src="http://localhost:8000/heatmap"
            alt="Heatmap"
            className="absolute inset-0 w-full h-full object-cover opacity-50 pointer-events-none"
          />
        )}
      </div>

      <div className="p-2 flex justify-between items-center m-2">
        <div>
          <p className="text-[#FFFFFF] text-sm">{date}</p>
          <p className="text-[#FFFFFF] text-sm">{time}</p>
          <p className="text-[#FFFFFF] text-sm font-[700] uppercase">{cameraName}</p>
          <p className="text-[#FFFFFF] text-xs">OBEX AI Security</p>
        </div>

        <article className="flex flex-col items-center justify-center">
          {alerts.length > 0 && (
            <h3 className="text-white bg-red-700 font-bold text-[10px] animate-pulse">
              {alerts.length} ALERTS
            </h3>
          )}
          <p className={`text-white text-xs font-bold px-3 py-1 rounded-full ${threatColors[threatLevel]} text-center`}>
            {threatLevel}
          </p>
        </article>

        <button
          onClick={(e) => {
            e.stopPropagation();
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