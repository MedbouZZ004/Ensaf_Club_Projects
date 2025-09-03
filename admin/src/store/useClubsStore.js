import {create} from 'zustand'
import { toast } from 'react-toastify';
const useClubsStore = create((set) => ({
  clubs: [],
  loading: false,
  error: null,
  activities:[],
  boardMembers:[],
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
  },
  addClub:async(formData)=>{
    try{
        const res = await fetch(`/api/clubs`, {
            method:"POST",
            credentials:'include',
            body:formData  
        });
        const data = await res.json();
        if(data.success){
            toast.success('club added successfully')
            return {success:true, message:data.message}
        }else{
            toast.error(data.message || 'Some wrong happen...');
            return {success:false, message:data.message || 'Some wrong happen...'}
        }
    }catch(err){
        console.error(err);
        toast.error('Error occured while adding club: ' + err.message);
        return {success:false, message:err.message}
    }
  },
  clubActivities: async ()=>{
    try{
        set({loading:true, error:null});
        const res = await fetch('/api/clubs/activities', {
            method:'GET',
            headers:{
                'Content-Type': 'application/json'
            },
            credentials:'include'
        });
        const data = await res.json();
        if(!data.success){
           return set({loading:false, error:data.message || 'Error occured while fetching activities'});
        }
        set({loading:false, error:null, activities:data.activities || []});
    }catch(err){
        console.error(err);
        return set({loading:false, error:err.message});
    }
  },
  clubBoardMembers: async ()=>{
    try{
        set({loading:true, error:null});
        const res = await fetch('/api/clubs/boardMembers', {
            method:'GET',
            headers:{
                'Content-Type':'application/json',
            },
            credentials:'include'
        });
        const data = await res.json();
        if(!data.success){
            return set({loading:false, error:data.message});
        }
        set({loading:false, error:null, boardMembers:data.board_members || []});

    }catch(err){
        console.error(err);
        return set({loading:false, error:err.message});
    }
  }
}));

export default useClubsStore;
