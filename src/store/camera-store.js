import { create } from 'zustand';
import { cameraAPI } from '../services/api';

export const useCameraStore = create((set, get) => ({
  // Camera streams state
  CameraStreams: [],
  loading: false,
  error: null,

  // Add camera to streams
  addToCameraStreams: async (cameraData) => {
    set({ loading: true, error: null });
    try {
      // Format camera data for backend
      const backendCameraData = {
        name: cameraData.cameraName,
        cameraType: "IP",
        streamUrl: cameraData.ipAddress,
        isActive: true,
        zoneName: cameraData.zoneCategory || "Default Zone",
        recordingEnabled: true,
        motionSensitivity: 70,
        offlineAlertEnabled: true,
        lastStreamCheck: new Date().toISOString()
      };

      const response = await cameraAPI.addCamera(backendCameraData);
      
      // Add to local state with backend data
      const newCamera = {
        id: response.data.data._id,
        cameraName: response.data.data.camera_name,
        ipAddress: response.data.data.stream_url,
        zoneCategory: response.data.data.zone_name,
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString(),
        threatLevel: "Low", // Default threat level
        isActive: response.data.data.is_active
      };

      set((state) => ({
        CameraStreams: [...state.CameraStreams, newCamera],
        loading: false
      }));
    } catch (error) {
      console.error('Error adding camera:', error);
      set({ 
        error: error.response?.data?.message || 'Failed to add camera',
        loading: false 
      });
    }
  },

  // Remove camera from streams
  removeFromCameraStreams: async (cameraId) => {
    set({ loading: true, error: null });
    try {
      await cameraAPI.deleteCamera(cameraId);
      
      set((state) => ({
        CameraStreams: state.CameraStreams.filter(cam => cam.id !== cameraId),
        loading: false
      }));
    } catch (error) {
      console.error('Error removing camera:', error);
      set({ 
        error: error.response?.data?.message || 'Failed to remove camera',
        loading: false 
      });
    }
  },

  // Get all cameras from backend
  fetchCameras: async () => {
    set({ loading: true, error: null });
    try {
      const response = await cameraAPI.getAllCameras();
      
      // Transform backend data to frontend format
      const cameras = response.data.data.map(camera => ({
        id: camera._id,
        cameraName: camera.camera_name,
        ipAddress: camera.stream_url,
        zoneCategory: camera.zone_name,
        date: new Date(camera.createdAt).toISOString().split('T')[0],
        time: new Date(camera.createdAt).toLocaleTimeString(),
        threatLevel: "Low", // Default threat level
        isActive: camera.is_active
      }));

      set({ CameraStreams: cameras, loading: false });
    } catch (error) {
      console.error('Error fetching cameras:', error);
      set({ 
        error: error.response?.data?.message || 'Failed to fetch cameras',
        loading: false 
      });
    }
  },

  // Clear all cameras
  clearCameraStreams: () => {
    set({ CameraStreams: [] });
  },

  // Update camera
  updateCamera: async (cameraId, updateData) => {
    set({ loading: true, error: null });
    try {
      const response = await cameraAPI.updateCamera(cameraId, updateData);
      
      set((state) => ({
        CameraStreams: state.CameraStreams.map(cam => 
          cam.id === cameraId 
            ? { ...cam, ...updateData }
            : cam
        ),
        loading: false
      }));
    } catch (error) {
      console.error('Error updating camera:', error);
      set({ 
        error: error.response?.data?.message || 'Failed to update camera',
        loading: false 
      });
    }
  },

  // Clear error
  clearError: () => set({ error: null }),
}));
