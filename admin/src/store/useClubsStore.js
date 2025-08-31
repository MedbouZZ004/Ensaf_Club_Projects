import {create} from 'zustand'
import { toast } from 'react-toastify';
const useClubsStore = create((set) => ({
  clubs: [],
  loading: false,
  error: null,
  getClubs: async ()=>{
    try{
        set({loading:true, error:null})
        const res = await fetch('/api/clubs',
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials:'include'
            }
        );
        if(!res.ok){
           return set({loading:false, error:'Error occured while fetching clubs'})
        }
        const data = await res.json();
        console.log('data', data)
        set({clubs:data, loading:false})
    }catch(err){
        set({loading:false, error:'Error occured while fetching clubs: ' + err.message})
    }
  },
  deleteClub: async (clubId)=>{
    try{
        const res = await fetch(`/api/clubs/${clubId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials:'include'
        });
        const data = await res.json();
        if(!data.success){
            toast.error(data.message);  
            return; 
        }
        set((state) => ({
          clubs: state.clubs.filter((club) => club.club_id !== clubId)
        }));        
        toast.success("Club deleted successfully");
    
    }catch(err){
        console.error(err)
        toast.error('Error occured while deleting club: ' + err.message);
        return;
    }
  }
}));

export default useClubsStore;
