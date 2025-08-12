import React, { useState, useEffect } from "react";
import { useCameraStore } from './store/camera-store';
import useLoadingStore from './store/loading-store';
import LogoLoader from './LogoLoader';
import OBEXCameraCard from "./OBEXCameraCard";
import Header from "./Header";
import './index.css';

export default function MultiVideoDashboard() {
  const [videos, setVideos] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);
  
  const {showLoading, hideLoading} = useLoadingStore();

  // Load available videos on component mount
  useEffect(() => {
    fetchAvailableVideos();
  }, []);

  const fetchAvailableVideos = async () => {
    try {
      const response = await fetch('http://localhost:8000/videos');
      const data = await response.json();
      
      const videoCards = data.videos.map((videoKey, index) => ({
        id: index + 1,
        cameraName: `${videoKey.charAt(0).toUpperCase() + videoKey.slice(1)} Camera`,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
        threatLevel: "Medium",
        ipAddress: `http://localhost:8000/video_feed/${videoKey}`,
        zoneCategory: "AI Security Zone",
        videoKey: videoKey,
        filename: data.video_files[index]
      }));
      
      setVideos(videoCards);
    } catch (error) {
      console.error('Error fetching videos:', error);
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('video/')) {
      setSelectedFile(file);
    } else {
      alert('Please select a valid video file');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Please select a video file first');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('video', selectedFile);

    try {
      const response = await fetch('http://localhost:8000/upload_video', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      
      if (result.status === 'ok') {
        alert('Video uploaded successfully!');
        setSelectedFile(null);
        fetchAvailableVideos(); // Refresh video list
      } else {
        alert(`Upload failed: ${result.message}`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  useEffect(() => {
    showLoading();
    const timer = setTimeout(() => {
      hideLoading();
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Header />
      <LogoLoader />
      
      <main className="mt-10 bg-gray-800 w-[90vw] h-auto m-auto rounded-lg shadow shadow-cyan-400/50 mb-10 pb-10 pt-5 xl:w-[95vw]">
        
        {/* Header Section */}
        <article className="flex justify-between items-center m-5">
          <figure className="flex text-3xl items-center gap-2 xl:ml-10 lg:ml-8 md:ml-6 ml-8">
            <svg className="h-6 w-6 md:h-8 md:w-8 lg:h-10 lg:w-10 text-cyan-400"
                fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round"
                  d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
            </svg>
            <h1 className="text-[16px] md:text-2xl lg:text-3xl font-bold text-gray-100">Multi-Video AI Security</h1>
          </figure>

          {/* Upload Section */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <input
                type="file"
                accept="video/*"
                onChange={handleFileSelect}
                className="hidden"
                id="video-upload"
              />
              <label
                htmlFor="video-upload"
                className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Select Video
              </label>
              {selectedFile && (
                <span className="text-gray-300 text-sm">
                  {selectedFile.name}
                </span>
              )}
            </div>
            
            {selectedFile && (
              <button
                onClick={handleUpload}
                disabled={uploading}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
              >
                {uploading ? 'Uploading...' : 'Upload Video'}
              </button>
            )}
          </div>
        </article>

        {/* Upload Progress */}
        {uploading && (
          <div className="mx-5 mb-4">
            <div className="bg-gray-700 rounded-full h-2">
              <div 
                className="bg-cyan-400 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="text-gray-300 text-sm mt-1">Uploading: {uploadProgress}%</p>
          </div>
        )}

        {/* Video Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-y-10 place-items-center 2xl:grid-cols-3 m-auto">
          {videos.map((video) => (
            <OBEXCameraCard 
              key={video.id} 
              {...video}
              videoKey={video.videoKey}
            />
          ))}
        </section>

        {/* Empty State */}
        {videos.length === 0 && (
          <section className="flex justify-center items-center mt-10">
            <article className="grid place-content-center place-items-center bg-black/50 w-[80vw] xl:w-[90vw] h-[70vh] rounded-lg outline outline-cyan-900 shadow-md shadow-cyan-400/50 overflow-hidden">
              <i className="fa fa-video text-cyan-400 text-[50px] lg:text-[100px]"></i>
              <h2 className="text-[20px] lg:text-[40px] font-bold text-gray-100 mb-6 mt-6">No Videos Available</h2>
              <p className="text-sm md:text-md lg:text-lg xl:text-xl 2xl:text-2xl text-gray-100 text-center w-[60%] mb-6">
                <span className="text-md font-bold text-cyan-400">Upload a video file to get started.<br></br></span>
                The AI will analyze the video for security threats, suspicious behavior, and zone violations.
              </p>
            </article>
          </section>
        )}
      </main>
    </>
  );
} 