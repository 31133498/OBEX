import React, { useState, useEffect, useRef } from "react";
import { useCameraStore } from './store/camera-store';
import { useEventStore } from "./store/history-store";

export default function OBEXCameraCard({ cameraName, date, time, threatLevel, id, zoneCategory, videoKey = "scene2" }) {
  const [alerts, setAlerts] = useState([]);
  const [latestAlert, setLatestAlert] = useState(null);
  const [performance, setPerformance] = useState(null);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [isDrawingZone, setIsDrawingZone] = useState(false);
  const [zoneStart, setZoneStart] = useState(null);
  const [currentZone, setCurrentZone] = useState(null);
  const videoRef = useRef(null);

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
        const [theftRes, suspiciousRes, performanceRes, intrusionRes, loiteringRes, zonesRes] = await Promise.all([
          fetch(`http://localhost:8000/alerts/${videoKey}`),
          fetch(`http://localhost:8000/suspicious_behavior`),
          fetch(`http://localhost:8000/performance/${videoKey}`),
          fetch(`http://localhost:8000/intrusion_alerts`),
          fetch(`http://localhost:8000/loitering_alerts`),
          fetch('http://localhost:8000/zones')
        ]);

        const theftData = await theftRes.json();
        const suspiciousData = await suspiciousRes.json();
        const performanceData = await performanceRes.json();
        const intrusionData = await intrusionRes.json();
        const loiteringData = await loiteringRes.json();
        const zonesData = await zonesRes.json();

        // Load existing zone if available
        if (zonesData.zones && zonesData.zones.length > 0 && !currentZone) {
          const zone = zonesData.zones[0];
          setCurrentZone({
            x1: zone[0],
            y1: zone[1], 
            x2: zone[2],
            y2: zone[3]
          });
        }

        let allAlerts = [];
        
        // Handle theft alerts
        if (theftData.theft_alerts && theftData.theft_alerts.length > 0) {
          allAlerts = allAlerts.concat(
            theftData.theft_alerts.map(a => ({
              type: 'theft',
              id: a.type || 'unknown',
              time: new Date(a.timestamp * 1000).toLocaleTimeString(),
              details: a.details || `${a.type} detected`,
              severity: a.severity || 'HIGH'
            }))
          );
        }
        
        // Handle suspicious behavior alerts
        if (suspiciousData.suspicious_behavior && suspiciousData.suspicious_behavior.length > 0) {
          allAlerts = allAlerts.concat(
            suspiciousData.suspicious_behavior.map(a => ({
              type: 'suspicious',
              id: a.type || 'behavior',
              time: new Date(a.timestamp * 1000).toLocaleTimeString(),
              details: a.details || `${a.type} behavior detected`,
              severity: a.severity || 'MEDIUM'
            }))
          );
        }

        // Handle intrusion alerts
        if (intrusionData.intrusion_alerts && intrusionData.intrusion_alerts.length > 0) {
          allAlerts = allAlerts.concat(
            intrusionData.intrusion_alerts.map(a => ({
              type: 'intrusion',
              id: a.track_id,
              time: new Date(a.entry_time * 1000).toLocaleTimeString(),
              details: `Person ${a.track_id} entered restricted zone`,
              severity: 'HIGH'
            }))
          );
        }

        // Handle loitering alerts
        if (loiteringData.loitering_alerts && loiteringData.loitering_alerts.length > 0) {
          allAlerts = allAlerts.concat(
            loiteringData.loitering_alerts.map(a => ({
              type: 'loitering',
              id: a.track_id,
              time: new Date(a.entry_time * 1000).toLocaleTimeString(),
              details: `Person ${a.track_id} loitering for ${a.duration?.toFixed(1) || 'unknown'}s`,
              severity: 'MEDIUM'
            }))
          );
        }

        // Sort alerts by most recent first
        allAlerts.sort((a, b) => new Date(b.time) - new Date(a.time));

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
  }, [currentZone, videoKey]);

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
      case 'intrusion': return 'bg-red-500';
      case 'loitering': return 'bg-yellow-500';
      default: return 'bg-yellow-600';
    }
  };

  const getAlertIcon = (alertType) => {
    switch (alertType) {
      case 'theft': return '🚨';
      case 'suspicious': return '⚠️';
      case 'intrusion': return '🚪';
      case 'loitering': return '⏱️';
      default: return '🔔';
    }
  };

  // Zone drawing functions
  const handleMouseDown = (e) => {
    if (!isDrawingZone) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setZoneStart({ x, y });
  };

  const handleMouseMove = (e) => {
    if (!isDrawingZone || !zoneStart) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setCurrentZone({
      x1: Math.min(zoneStart.x, x),
      y1: Math.min(zoneStart.y, y),
      x2: Math.max(zoneStart.x, x),
      y2: Math.max(zoneStart.y, y)
    });
  };

  const handleMouseUp = async () => {
    if (!isDrawingZone || !currentZone) return;
    
    try {
      // Send zone coordinates to backend
      const response = await fetch('http://localhost:8000/set_zone', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(currentZone),
      });
      
      if (response.ok) {
        console.log('Zone set successfully');
        setIsDrawingZone(false);
        setZoneStart(null);
        // Keep currentZone to show the drawn zone
      }
    } catch (error) {
      console.error('Error setting zone:', error);
    }
  };

  const clearZone = () => {
    setCurrentZone(null);
    setZoneStart(null);
    setIsDrawingZone(false);
  };

  return (
    <section
      className="bg-[#1F2937] rounded-2xl shadow-md shadow-cyan-400/50 overflow-hidden w-[80vw] h-[320px] sm:w-[80vw] sm:h-[420px] md:w-[40vw] md:h-[320px] lg:w-[40vw] lg:h-[420px] xl:w-[25vw] xl:h-[320px] 2xl:w-[28vw] 2xl:h-[420px] cursor-pointer hover:scale-105 transition-all duration-300 2xl:mt-10 outline outline-2 focus-within:outline-cyan-400 hover:outline-cyan-400"
      onClick={handleView}
    >
      <div className="bg-black h-[240px] w-full flex items-center justify-center text-white sm:h-[340px] md:h-[240px] lg:h-[340px] xl:h-[240px] 2xl:h-[340px] relative"
           onMouseDown={handleMouseDown}
           onMouseMove={handleMouseMove}
           onMouseUp={handleMouseUp}
           style={{ cursor: isDrawingZone ? 'crosshair' : 'pointer' }}>
        {/* OBEX Video Feed */}
        <img
          ref={videoRef}
          src={`http://localhost:8000/video_feed/${videoKey}`}
          alt="OBEX Security Feed"
          className="w-full h-full object-cover"
        />
        
        {/* Zone Overlay */}
        {currentZone && (
          <div
            className="absolute border-2 border-red-500 bg-red-500/20"
            style={{
              left: currentZone.x1,
              top: currentZone.y1,
              width: currentZone.x2 - currentZone.x1,
              height: currentZone.y2 - currentZone.y1,
            }}
          >
            <div className="absolute -top-6 left-0 text-xs bg-red-500 text-white px-2 py-1 rounded">
              RESTRICTED ZONE
            </div>
          </div>
        )}
        
        {/* Latest Alert Overlay */}
        {latestAlert && (
          <div className={`absolute top-2 left-2 right-2 ${getAlertColor(latestAlert.type)} text-white p-2 rounded-lg text-xs`}>
            <div className="flex items-center gap-2">
              <span>{getAlertIcon(latestAlert.type)}</span>
              <span className="font-bold">
                {latestAlert.type === 'theft' ? 'THEFT DETECTED!' :
                 latestAlert.type === 'suspicious' ? 'SUSPICIOUS BEHAVIOR!' :
                 latestAlert.type === 'intrusion' ? 'INTRUSION ALERT!' :
                 latestAlert.type === 'loitering' ? 'LOITERING DETECTED!' :
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
            <div>Faces: {performance.faces_detected}</div>
            <div>Objects: {performance.objects_detected}</div>
            {performance.zone_active && <div>Zone: Active</div>}
          </div>
        )}

        {/* Zone Management Controls */}
        <div className="absolute top-2 right-2 flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsDrawingZone(!isDrawingZone);
            }}
            className={`px-2 py-1 rounded text-xs ${isDrawingZone ? 'bg-red-600' : 'bg-blue-600'} text-white`}
          >
            {isDrawingZone ? 'Cancel Zone' : 'Draw Zone'}
          </button>
          
          {currentZone && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                clearZone();
              }}
              className="bg-gray-600 text-white px-2 py-1 rounded text-xs"
            >
              Clear Zone
            </button>
          )}
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowHeatmap(!showHeatmap);
            }}
            className="bg-green-600 text-white px-2 py-1 rounded text-xs"
          >
            {showHeatmap ? 'Hide' : 'Show'} Heatmap
          </button>
        </div>

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