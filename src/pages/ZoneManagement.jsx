// src/pages/ZoneManagement.jsx
import React, { useState, useEffect } from 'react';
import Header from '../Header';
import { useZoneStore } from '../store/zone-store';
import { Dialog } from '@headlessui/react';
import { Plus, Trash2, Pencil } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import useLoadingStore from '../store/loading-store';
import LogoLoader from '../LogoLoader';

const defaultZone = {
  id: null,
  name: '',
  camera: '',
  sensitivity: 'Medium',
};

const ZoneManagement = () => {
//LOAD BEFORE DISPLAYING PAGE//
    const [showZoneMgt, setShowZoneMgt] = useState(false)

  const {showLoading, hideLoading} = useLoadingStore();
  useEffect(() => {
    showLoading();
    const timer = setTimeout(() => {
      hideLoading();
      handleShowZoneMgt()
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  function handleShowZoneMgt () {
    setShowZoneMgt(!showZoneMgt)
  }


  const { zones, addZone, editZone, deleteZone } = useZoneStore();
  const [isOpen, setIsOpen] = useState(false);
  const [zoneData, setZoneData] = useState(defaultZone);
  const [isEdit, setIsEdit] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEdit) {
      editZone(zoneData.id, zoneData);
    } else {
      addZone({ ...zoneData, id: Date.now() });
    }
    setZoneData(defaultZone);
    setIsOpen(false);
    setIsEdit(false);
  };

  const handleEdit = (zone) => {
    setZoneData(zone);
    setIsEdit(true);
    setIsOpen(true);
  };

  const heatmapZones = [
    { x: 1, y: 10 },
    { x: 2, y: 30 },
    { x: 3, y: 50 },
    { x: 4, y: 40 },
    { x: 5, y: 80 },
    { x: 6, y: 60 },
  ];

  return (
    <>
    <Header />
    <LogoLoader />
    {showZoneMgt && <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl text-cyan-400 text-[20px] md:text-[30px] xl:text-[40px] font-bold mb-4">Zone Management</h1>
        <button
          onClick={() => {
            setIsOpen(true);
            setZoneData(defaultZone);
            setIsEdit(false);
          }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          <Plus size={18} /> Add Zone
        </button>
      </div>

      <table className="w-full text-left border rounded overflow-hidden mb-8">
        <thead className="bg-gray-100 text-gray-600">
          <tr>
            <th className="p-3">Name</th>
            <th className="p-3">Assigned Camera</th>
            <th className="p-3">Sensitivity</th>
            <th className="p-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {zones.map((zone) => (
            <tr key={zone.id} className="border-t">
              <td className="p-3 font-bold text-white">{zone.name}</td>
              <td className="p-3 text-white">{zone.camera}</td>
              <td className="p-3">
                <span className={`px-2 py-1 text-sm rounded text-white ${
                  zone.sensitivity === 'High'
                    ? 'bg-red-600'
                    : zone.sensitivity === 'Medium'
                    ? 'bg-yellow-500'
                    : 'bg-green-600'
                }`}>
                  {zone.sensitivity}
                </span>
              </td>
              <td className="p-3 text-right space-x-2">
                <button
                  onClick={() => handleEdit(zone)}
                  className="text-blue-600 hover:underline"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => deleteZone(zone.id)}
                  className="text-red-600 hover:underline"
                >
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Heatmap Section */}
      <div className="bg-white rounded shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Zone Heatmap</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={heatmapZones}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="x" label={{ value: 'Zone Index', position: 'insideBottom', offset: -5 }} />
            <YAxis label={{ value: 'Activity Level', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Line type="monotone" dataKey="y" stroke="#3b82f6" strokeWidth={3} dot={{ r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md rounded bg-white p-6 shadow-xl">
            <Dialog.Title className="text-lg font-semibold mb-4">
              {isEdit ? 'Edit Zone' : 'Add New Zone'}
            </Dialog.Title>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-1 text-sm font-medium">Zone Name</label>
                <input
                  type="text"
                  className="w-full border px-3 py-2 rounded"
                  value={zoneData.name}
                  onChange={(e) => setZoneData({ ...zoneData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">Assigned Camera</label>
                <input
                  type="text"
                  className="w-full border px-3 py-2 rounded"
                  value={zoneData.camera}
                  onChange={(e) => setZoneData({ ...zoneData, camera: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">Sensitivity</label>
                <select
                  className="w-full border px-3 py-2 rounded"
                  value={zoneData.sensitivity}
                  onChange={(e) => setZoneData({ ...zoneData, sensitivity: e.target.value })}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  className="px-4 py-2 border rounded"
                  onClick={() => setIsOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  {isEdit ? 'Update Zone' : 'Add Zone'}
                </button>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>}
    </>
  );
};

export default ZoneManagement;
