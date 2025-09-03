import React from 'react'
import { useParams } from 'react-router-dom'
import { FaUser, FaEnvelope, FaUserTie, FaChevronDown, FaImage, FaArrowLeft, FaSave } from 'react-icons/fa'

const AddAndEditBoardMember = () => {
    const {id} = useParams();   
    const roles = [
        'Chair',
        'Vice Chair',
        'Secretary',
        'Treasurer',
        'Media Chair',
        'Program Chair',
        'Design Chair'
    ]
    
    const [formData, setFormData] = React.useState({
        fullName: '',
        email: '',
        role: '',
        position: '',
        image: null
    })
    
    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }
    
    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFormData(prev => ({
                ...prev,
                image: e.target.files[0]
            }))
        }
    }
    
    const handleSubmit = (e) => {
        e.preventDefault()
        // Form submission logic would go here
        console.log('Form submitted:', formData)
    }

    return (
        <section className='py-8 px-6 '>
            <div className='mb-8'>
                <h1 className='text-4xl font-bold text-orange-400 mb-2'>{id ? 'Edit Board Member' : 'Add New Board Member'}</h1>
                <p className='text-gray-600'>Fill in the details below to {id ? 'update the board member' : 'add a new board member'}</p>
            </div>
            
            <form onSubmit={handleSubmit} className='bg-white rounded-xl shadow-md p-6 md:p-8'>
                <div className='space-y-6'>
                    {/* Full Name Field */}
                    <div>
                        <label htmlFor="fullName" className='text-md font-medium text-gray-700 mb-2 flex items-center'>
                            <FaUser className='mr-2 text-orange-400' />
                            Full Name <span className='text-orange-400 ml-1'>*</span>
                        </label>
                        <div className='relative'>
                            <input 
                                type="text" 
                                id="fullName"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleInputChange}
                                required
                                className='w-full pl-10 outline-none pr-4 py-2 border border-gray-300 rounded-lg  focus:ring-orange-300 focus:border-orange-400 transition-colors duration-200'
                                placeholder='Enter full name'
                            />
                            <FaUser className='absolute left-3 top-3 text-gray-400' />
                        </div>
                    </div>
                    
                    {/* Email Field */}
                    <div>
                        <label htmlFor="email" className='text-md font-medium text-gray-700 mb-2 flex items-center'>
                            <FaEnvelope className='mr-2 text-orange-400' />
                            Email Address
                        </label>
                        <div className='relative'>
                            <input 
                                type="email" 
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className='w-full pl-10 outline-none pr-4 py-2 border border-gray-300 rounded-lg  focus:ring-orange-300 focus:border-orange-400 transition-colors duration-200'
                                placeholder='Enter email address'
                            />
                            <FaEnvelope className='absolute left-3 top-3 text-gray-400' />
                        </div>
                    </div>
                    
                    
                    {/* role Field */}
                    <div>
                        <label htmlFor="position" className='text-md font-medium text-gray-700 mb-2 flex items-center'>
                            <FaUserTie className='mr-2 text-orange-400' />
                            Role <span className='text-orange-400 ml-1'>*</span>
                        </label>
                        <div className='relative'>
                            <select
                                id="position"
                                name="position"
                                value={formData.position}
                                onChange={handleInputChange}
                                required
                                className='w-full pl-10 pr-10 py-2 outline-none border border-gray-300 rounded-lg  focus:ring-orange-300 focus:border-orange-400 appearance-none transition-colors duration-200'
                            >
                                <option value="">Select a position</option>
                                {roles.map(role => (
                                    <option key={role} value={role}>{role}</option>
                                ))}
                            </select>
                            <FaUserTie className='absolute left-3 top-3 text-gray-400' />
                            <FaChevronDown className='absolute right-3 top-3 text-gray-400' />
                        </div>
                    </div>
                    
                    {/* Image Upload Field */}
                    <div>
                        <label htmlFor="board-member-image" className='text-md font-medium text-gray-700 mb-2 flex items-center'>
                            <FaImage className='mr-2 text-orange-400' />
                            Board Member Image
                        </label>
                        <div className='flex items-center justify-center w-full'>
                            <label htmlFor="board-member-image" className='flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-orange-300 rounded-lg cursor-pointer bg-orange-50 hover:bg-orange-100 transition-colors duration-200'>
                                <div className='flex flex-col items-center justify-center pt-5 pb-6'>
                                    <FaImage className='w-10 h-10 text-orange-400 mb-2' />
                                    <p className='text-sm text-orange-500'><span className='font-semibold'>Click to upload</span> or drag and drop</p>
                                    <p className='text-xs text-gray-500'>PNG, JPG up to 5MB</p>
                                </div>
                                <input 
                                    id="board-member-image" 
                                    type="file" 
                                    accept="image/*" 
                                    onChange={handleImageChange}
                                    className='hidden' 
                                />
                            </label>
                        </div>
                        {formData.image && (
                            <p className='mt-2 text-sm text-green-600'>Image selected: {formData.image.name}</p>
                        )}
                    </div>
                </div>
                
                {/* Action Buttons */}
                <div className='flex flex-col sm:flex-row justify-end gap-4 pt-8 mt-8 border-t border-gray-200'>
                    <button 
                        type='button' 
                        onClick={() => window.history.back()}
                        className='px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center'
                    >
                        <FaArrowLeft className='mr-2' />
                        Return
                    </button>
                    <button 
                        type='submit' 
                        className='px-6 py-2 bg-orange-400 border border-orange-400 rounded-lg text-white font-medium hover:bg-orange-500 transition-colors duration-200 flex items-center justify-center'
                    >
                        <FaSave className='mr-2' />
                        {id ? 'Update Board Member' : 'Add Board Member'}
                    </button>
                </div>
            </form>
        </section>
    )
}

export default AddAndEditBoardMember