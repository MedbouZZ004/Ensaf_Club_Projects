import React from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { FaUser, FaEnvelope, FaUserTie, FaChevronDown, FaImage, FaArrowLeft, FaSave } from 'react-icons/fa'
import { useActionState } from 'react'
import useClubsStore from '../store/useClubsStore'

const AddAndEditBoardMember = () => {
    const {id} = useParams();   
    const [searchParams] = useSearchParams();
    const clubId = searchParams.get('id');
    const memberId = searchParams.get('memberId');
    const { addBoardMember, updateBoardMember, boardMembers, clubBoardMembers } = useClubsStore();
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
    const [imagePreview, setImagePreview] = React.useState(null);
    const formRef = React.useRef(null);
    const imageInputRef = React.useRef(null);

    // Prefill when editing a member
    React.useEffect(() => {
        const init = async () => {
            if (!memberId) return;
            if (!boardMembers || boardMembers.length === 0) {
                try { await clubBoardMembers(); } catch { /* ignore */ }
            }
            const mid = parseInt(memberId, 10);
            const member = (boardMembers || []).find(m => m.id === mid);
            if (member) {
                setFormData(prev => ({
                    ...prev,
                    fullName: member.fullname || '',
                    email: member.email || '',
                    position: member.role || '',
                }));
                setImagePreview(member.image || null);
            }
        };
        init();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [memberId]);
    
    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }
    
    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            try { if (imagePreview) URL.revokeObjectURL(imagePreview); } catch (err) { console.debug('revoke ignore', err?.message); }
            setImagePreview(URL.createObjectURL(file));
            setFormData(prev => ({ ...prev, image: file }));
        } else {
            try { if (imagePreview) URL.revokeObjectURL(imagePreview); } catch (err) { console.debug('revoke ignore', err?.message); }
            setImagePreview(null);
            setFormData(prev => ({ ...prev, image: null }));
        }
    }
    
    async function submitAction (){
        const payload = new FormData();
        payload.append('fullName', formData.fullName);
        if (formData.email) payload.append('email', formData.email);
        const role = formData.position || formData.role;
        if (role) payload.append('role', role);
        if (clubId) payload.append('clubId', clubId);
        if (formData.image) payload.append('image', formData.image);
    const result = memberId ? await updateBoardMember(parseInt(memberId,10), payload) : await addBoardMember(payload);
        if (result?.success){
            try { formRef.current?.reset(); } catch (e) { console.debug('reset ignore', e?.message); }
            setFormData({ fullName:'', email:'', role:'', position:'', image:null });
            try { if (imagePreview) URL.revokeObjectURL(imagePreview); } catch (e) { console.debug('revoke ignore', e?.message); }
            setImagePreview(null);
            try { if (imageInputRef.current) imageInputRef.current.value = ''; } catch (e) { console.debug('clear ignore', e?.message); }
            return {success:true};
        }
        return {success:false};
    }
    const [_STATE, formAction, isPending] = useActionState(submitAction, {success:null});

    return (
        <section className='py-8 h-screen overflow-y-auto px-6 '>
            <div className='mb-8'>
                <h1 className='text-4xl font-bold text-orange-400 mb-2'>{id ? 'Edit Board Member' : 'Add New Board Member'}</h1>
                <p className='text-gray-600'>Fill in the details below to {id ? 'update the board member' : 'add a new board member'}</p>
            </div>
            
            <form ref={formRef} action={formAction} method="post" encType="multipart/form-data" className='bg-white border border-orange-400 rounded-xl shadow-md p-6 md:p-8'>
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
                            <label htmlFor="board-member-image" className='relative flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-orange-300 rounded-lg cursor-pointer bg-orange-50 hover:bg-orange-100 transition-colors duration-200 overflow-hidden'>
                                {imagePreview ? (
                                    <img src={imagePreview} alt='Preview' className='absolute inset-0 h-full w-full object-cover' />
                                ) : (
                                    <div className='flex flex-col items-center justify-center pt-5 pb-6'>
                                        <FaImage className='w-10 h-10 text-orange-400 mb-2' />
                                        <p className='text-sm text-orange-500'><span className='font-semibold'>Click to upload</span> or drag and drop</p>
                                        <p className='text-xs text-gray-500'>PNG, JPG up to 5MB</p>
                                    </div>
                                )}
                                <input 
                                    id="board-member-image" 
                                    type="file" 
                                    accept="image/*" 
                                    onChange={handleImageChange}
                                    className='sr-only'
                                    ref={imageInputRef}
                                />
                            </label>
                        </div>
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
                        className='px-6 py-2 bg-orange-400 border cursor-poiner border-orange-400 rounded-lg text-white font-medium hover:bg-orange-400/80 transition-colors duration-200 flex items-center justify-center'
                    >
                        <FaSave className='mr-2' />
                        {id ? (isPending ? 'Updating...' : 'Update Board Member') : (isPending ? 'Adding...' : 'Add Board Member')}
                    </button>
                </div>
            </form>
        </section>
    )
}

export default AddAndEditBoardMember