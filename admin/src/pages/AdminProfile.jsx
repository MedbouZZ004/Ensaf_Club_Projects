import React, { useEffect, useState } from 'react'
import { FaUser, FaEnvelope, FaEdit, FaSave, FaTimes } from 'react-icons/fa'
import { RiLockPasswordFill } from "react-icons/ri";
import { toast } from 'react-toastify';
import { PiUserFocusFill } from "react-icons/pi";

const AdminProfile = () => {
  const [isEditing, setIsEditing] = useState(false)
  const [adminData, setAdminData] = useState({ fullName: '', email: '' })
  const [tempData, setTempData] = useState({ ...adminData })

  const handleEdit = () => {
    setTempData({ ...adminData })
    setIsEditing(true)
  }

  const handleSave = async () => {
    try {
      const payload = {
        full_name: tempData.fullName,
        email: tempData.email,
      };
      if (tempData.password) payload.password = tempData.password;
      const res = await fetch('/api/admin/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'include',
      });
      const data = await res.json().catch(()=>({}));
      if (!res.ok || data.success === false) {
        toast.error(data.message || 'Failed to update profile');
        return;
      }
      setAdminData({ fullName: tempData.fullName, email: tempData.email });
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (e) {
      toast.error(e?.message || 'Failed to update profile');
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
  }

  const handleChange = (e) => {
    setTempData({
      ...tempData,
      [e.target.name]: e.target.value
    })
  }

  useEffect(() => {
    const run = async () => {
      try {
        const res = await fetch('/api/admin/profile', { credentials: 'include' });
        const data = await res.json();
        if (res.ok && data?.success) {
          const { full_name, email } = data.data || {};
          setAdminData({ fullName: full_name || '', email: email || '' });
          setTempData({ fullName: full_name || '', email: email || '', password: '' });
        }
      } catch {
        // ignore fetch errors
      }
    };
    run();
  }, []);

  return (
    <div className="px-6 py-6 ">
      <div className="mb-8 flex flex-col items-start text-center">
        <h1 className='text-3xl font-bold text-orange-400 mb-2'>Admin Profile</h1>
      </div>
      
      <div className='flex justify-center'>
        <div className='bg-white w-full  rounded-xl shadow-lg overflow-hidden border border-orange-200'>
        <div className='bg-white w-full md:w-4/5 rounded-xl shadow-lg overflow-hidden border border-orange-200'>
          <div className='bg-gradient-to-r from-orange-400/90 to-orange-400/80 p-6 text-white'>
            <div className='flex items-center'>
              <div className='w-20 h-20 rounded-full bg-white flex items-center justify-center mr-5'>
                <FaUser className='text-4xl text-orange-400' />
              </div>
              <div>
                <h2 className='text-2xl font-bold'>{adminData.fullName}</h2>
                <p className='text-orange-100'>Administrator Account</p>
              </div>
            </div>
          </div>
          
          <div className='p-6'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>
              <div className='flex items-center'>
                <div className='bg-orange-100 p-3 rounded-lg mr-4'>
                  <FaUser className='text-xl text-orange-500' />
                </div>
                <div className='flex-1'>
                  <label className='block text-sm font-medium text-gray-600 mb-1'>Full Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="fullName"
                      value={tempData.fullName}
                      onChange={handleChange}
                      className="w-full outline-none px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-300 focus:border-orange-400"
                    />
                  ) : (
                    <p className='text-lg text-gray-800'>{adminData.fullName}</p>
                  )}
                </div>
              </div>
              
              <div className='flex items-center'>
                <div className='bg-orange-100 p-3 rounded-lg mr-4'>
                  <FaEnvelope className='text-xl text-orange-500' />
                </div>
                <div className='flex-1'>
                  <label className='block text-sm font-medium text-gray-600 mb-1'>Email Address</label>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={tempData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border outline-none border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-300 focus:border-orange-400"
                    />
                  ) : (
                    <p className='text-lg text-gray-800'>{adminData.email}</p>
                  )}
                </div>
              </div>

              <div className='flex items-center'>
                <div className='bg-orange-100 p-3 rounded-lg mr-4'>
                  <RiLockPasswordFill className='text-xl text-orange-500' />
                </div>
                <div className='flex-1'>
                  <label className='block text-sm font-medium text-gray-600 mb-1'>Password</label>
                  {isEditing ? (
                    <input
                      type="password"
                      name="password"
                      value={tempData.password || ''}
                      onChange={handleChange}
                      className="w-full outline-none px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-300 focus:border-orange-400"
                    />
                  ) : (
                    <p className='text-lg text-gray-800'>*************</p>
                  )}
                  {isEditing && (
                    <p className='text-xs text-gray-500 mt-1'>Leave blank to keep current password.</p>
                  )}
                </div>
              </div>
              
              <div className='flex items-center'>
                <div className='bg-orange-100 p-3 rounded-lg mr-4'>
                  <PiUserFocusFill className='text-xl text-orange-500' />
                </div>
                <div className='flex-1'>
                  <label className='block text-sm font-medium text-gray-600 mb-1'>Role</label>
                  <p className='text-lg text-gray-800'>ADMIN</p>
                </div>
              </div>

            </div>
            
            <div className='flex justify-end space-x-4 pt-4 border-t border-gray-100'>
              {isEditing ? (
                <>
                  <button
                    onClick={handleCancel}
                    className="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 flex items-center"
                  >
                    <FaTimes className="mr-2" />
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-5 py-2 bg-orange-400 border border-orange-400 rounded-lg text-white font-medium hover:bg-orange-400/80 flex items-center"
                  >
                    <FaSave className="mr-2" />
                    Save Changes
                  </button>
                </>
              ) : (
                <button
                  onClick={handleEdit}
                  className="px-5 py-2 bg-orange-400 border border-orange-400 rounded-lg text-white font-medium hover:bg-orange-400/80 flex items-center"
                >
                  <FaEdit className="mr-2" />
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      
    </div>
  )
}


export default AdminProfile