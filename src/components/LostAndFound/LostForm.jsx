
import React, { useState } from 'react';
import { submitItem } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import MapPicker from '../Location/MapPicker';



export default function LostForm() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    contact: ''
  });
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState(null);
  const [picture, setPicture] = useState(null);
  const [pictureUrl, setPictureUrl] = useState('');
  const { user } = useAuth();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handlePictureChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setPicture(e.target.files[0]);
      setPictureUrl(URL.createObjectURL(e.target.files[0]));
    }
  };

    const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return setStatus('You must be logged in.');
    if (!location) return setStatus('Please select a location.');
    if (!form.title) return setStatus('Please enter a title.');
    if (!form.description) return setStatus('Please enter a description.');
    if (!form.contact) return setStatus('Please enter a contact.');
    setLoading(true);
    setStatus('');
    try {
      // Automatically set current date/time when submitting
      const currentDateTime = new Date().toISOString();
      await submitItem({ 
        ...form, 
        type: 'lost', 
        location,
        date: currentDateTime 
      });
      setStatus('Lost item request submitted for approval.');
      setForm({ title: '', description: '', contact: '' });
      setLocation(null);
      setPicture(null);
      setPictureUrl('');
    } catch (err) {
      setStatus(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-[70vh] bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 py-8">
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 w-full max-w-md flex flex-col gap-4 border border-blue-100 dark:border-gray-700">
  <h2 className="text-2xl font-bold text-center mb-2 text-blue-700 dark:text-yellow-300 flex items-center justify-center gap-2">
          <span className="inline-block text-3xl">❓</span> Report Lost Item
        </h2>
        <div className="flex flex-col gap-2">
          <label htmlFor="title" className="text-sm font-medium text-gray-700 dark:text-gray-200">Item Name</label>
          <input
            id="title"
            name="title"
            required
            placeholder="What did you lose?"
            value={form.title}
            onChange={handleChange}
            className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-900 dark:text-white dark:border-gray-700"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="description" className="text-sm font-medium text-gray-700 dark:text-gray-200">Description</label>
          <textarea
            id="description"
            name="description"
            required
            placeholder="Describe the item"
            value={form.description}
            onChange={handleChange}
            className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 min-h-[80px] dark:bg-gray-900 dark:text-white dark:border-gray-700"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="contact" className="text-sm font-medium text-gray-700 dark:text-gray-200">Contact Info</label>
          <input
            id="contact"
            name="contact"
            required
            placeholder="Your email or phone number"
            value={form.contact}
            onChange={handleChange}
            className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-900 dark:text-white dark:border-gray-700"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Location</label>
          <div className="transition-all duration-300">
            <MapPicker onLocationSelect={setLocation} zoom={location ? 16 : 2} center={location ? [location.lat, location.lng] : [20, 0]} />
          </div>
          {location && (
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${location.lat},${location.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block mx-auto mt-3 w-fit px-5 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full shadow-lg hover:from-green-600 hover:to-emerald-700 text-sm font-bold tracking-wide transition-all duration-200 border-2 border-green-400 hover:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-300 dark:bg-gradient-to-r dark:from-green-700 dark:to-emerald-900 dark:border-green-700 dark:hover:border-emerald-900"
            >
              📍 View on Map
            </a>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="picture" className="text-sm font-medium text-gray-700 dark:text-gray-200">Picture (optional)</label>
          <input
            id="picture"
            name="picture"
            type="file"
            accept="image/*"
            onChange={handlePictureChange}
            className="file:mr-2 file:py-1 file:px-3 file:rounded file:border file:border-blue-400 file:bg-blue-50 dark:file:bg-blue-900 dark:file:text-white"
          />
          {pictureUrl && (
            <img src={pictureUrl} alt="Preview" className="mt-2 rounded max-h-40 object-contain border dark:border-gray-700" />
          )}
        </div>
        <button
          type="submit"
          className="mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition disabled:opacity-60 dark:bg-blue-800 dark:hover:bg-blue-900"
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Submit'}
        </button>
  {status && <p className={`text-center text-sm ${status.includes('submitted') ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>{status}</p>}
      </form>
    </div>
  );
}