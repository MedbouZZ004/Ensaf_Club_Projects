
import {create} from 'zustand'
import { toast } from 'react-toastify';
const useClubsStore = create((set) => ({
  clubs: [],
  loading: false,
  error: null,
  activities:[],
  boardMembers:[],
  clubStatistics:[],
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
  },
  deleteActivity: async(activityId)=>{
    try{
        const res = await fetch(`/api/clubs/activities/${activityId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });
        const data = await res.json();
        if(!data.success){
            toast.error(data.message);
            return;
        }
        set((state) => ({
            activities: state.activities.filter((activity) => activity.activity_id !== activityId)
        }));
        toast.success("Activity deleted successfully");
    }catch(err){
        console.error(err);
        toast.error('Error occured while deleting activity: ' + err.message);
        return;
    }
  },
  deleteBoardMember: async(memberId)=>{
    try{
        const res = await fetch(`/api/clubs/boardMembers/${memberId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });
        const data = await res.json();
        if(!data.success){
            toast.error(data.message);
            return;
        }
        set((state) => ({
            boardMembers: state.boardMembers.filter((member) => member.id !== memberId)
        }));
        toast.success("Board member deleted successfully");
    }catch(err){
        console.error(err);
        toast.error('Error occured while deleting board member: ' + err.message);
        return;
    }
  },
  addBoardMember: async(formData)=>{
    try{
        const res = await fetch(`/api/clubs/boardMembers`, {
            method:'POST',
            credentials:'include',
            body: formData
        });
        const data = await res.json().catch(() => ({}));
        if(!res.ok || data.success === false){
            toast.error(data.message || 'Failed to add board member');
            return {success:false, message: data.message || 'Failed to add board member'};
        }
                toast.success('Board member added successfully');
                // Optimistically add to state so list updates without refetch
                if (data.member) {
                    set((state) => ({ boardMembers: [data.member, ...state.boardMembers] }));
                }
                return {success:true, member: data.member};
    }catch(err){
        console.error(err);
        toast.error('Error occured while adding board member: ' + err.message);
        return {success:false, message: err.message};
    }
  },
   updateBoardMember: async(memberId, formData)=>{
        try{
                const res = await fetch(`/api/clubs/boardMembers/${memberId}`, {
                        method:'PUT',
                        credentials:'include',
                        body: formData
                });
                const data = await res.json().catch(() => ({}));
                if(!res.ok || data.success === false){
                        toast.error(data.message || 'Failed to update board member');
                        return {success:false, message: data.message || 'Failed to update board member'};
                }
                set((state)=>({
                    boardMembers: state.boardMembers.map(m=> m.id === memberId ? data.member : m)
                }));
                toast.success('Board member updated successfully');
                return {success:true, member: data.member};
        }catch(err){
                console.error(err);
                toast.error('Error occured while updating board member: ' + err.message);
                return {success:false, message: err.message};
        }
    },
    addActivity: async(formData)=>{
        try{
                const res = await fetch(`/api/clubs/activity`, {
                        method:"POST",
                        credentials:'include',
                        body: formData
                });
                const data = await res.json().catch(() => ({}));
                if(!res.ok || data.success === false){
                        toast.error(data.message || 'Failed to add activity');
                        return {success:false, message: data.message || 'Failed to add activity'};
                }
                toast.success('Activity added successfully');
                return {success:true, activity:data.activity};
            } 
        catch(err){
                console.error(err);
                toast.error('Error occured while adding activity: ' + err.message);
                return {success:false, message: err.message};
        }
    },

    updateActivity: async(activityId, formData)=>{
    try{
        const res = await fetch(`/api/clubs/activities/${activityId}`, {
            method:"PUT",
            credentials:'include',
            body: formData
        });
        const data = await res.json().catch(() => ({}));
        if(!res.ok || data.success === false){
            toast.error(data.message || 'Failed to update activity');
            return {success:false, message: data.message || 'Failed to update activity'};
        }
        set((state)=>({
          activities: state.activities.map(a=> a.activity_id === activityId ? data.activity : a)
        }));
        toast.success('Activity updated successfully');
        return {success:true, activity:data.activity};
        } 
    catch(err){
        console.error(err);
        toast.error('Error occured while updating activity: ' + err.message);
        return {success:false, message: err.message};
    }
    },
    updateClub: async (clubId, formData) => {
        try {
            const res = await fetch(`/api/clubs/${clubId}`, {
                method: 'PUT',
                credentials: 'include',
                body: formData
            });
            const data = await res.json();
            if (!res.ok || data.success === false) {
                toast.error(data.message || 'Failed to update club');
                return { success: false, message: data.message || 'Failed to update club' };
            }
            toast.success('Club updated successfully');
            // Optionally update state.clubs here if needed
            return { success: true, club: data.club };
        } catch (err) {
            console.error(err);
            toast.error('Error occured while updating club: ' + err.message);
            return { success: false, message: err.message };
        }
    },
    getClubStatistics: async()=>{
        try{
            set({loading:true, error:null});    
            const res = await fetch('/api/clubs/stats', {
                method:'GET',
                headers:{
                    'Content-Type':'application/json'
                },
                credentials:'include'
            })
            const data = await res.json();
            set({loading:false, error:null, clubStatistics:data.data || []});
        }catch(err){
            console.error(err.message);
            return set({loading:false, error:'Error ouccured while fetching statistics' + err.message});
        }
    }
}));

export default useClubsStore;
