import { toast } from "react-toastify";
import {create} from "zustand"

const useClubsStore = create((set) => ({
  clubs: [],
  club:null,
  loading:false,
  error:null,
  getClubs:async ()=>{
   
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
                const normalized = Array.isArray(data)
                    ? data.map((c) => ({
                            ...c,
                            likes: typeof c.likes === 'number' ? c.likes : Number(c.likes) || 0,
                            likedByMe: Boolean(c.likedByMe),
                        }))
                    : [];
                set({loading:false, clubs:normalized, error:null})
    }catch(err){
        set({loading:false, error:'Error occured while fetching clubs: ' + err.message})
    }
  },
  getClubById:async (club_id)=>{
    try{
        set({loading:true, error:null})
        const res = await fetch(`/api/clubs/${club_id}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials:'include'
            }
        );
        if(!res.ok){
           return set({loading:false, error:'Error occured while fetching club'})
        }
                const data = await res.json();
                const normalized = data ? {
                    ...data,
                    likes: typeof data.likes === 'number' ? data.likes : Number(data.likes) || 0,
                    likedByMe: Boolean(data.likedByMe),
                } : null;
                set({loading:false, club:normalized, error:null})
    }catch(err){
        console.error(err);
        return set({loading:false, error:'Error occured while fetching club: ' + err.message})
    }
  },
  addLike: async (club_id)=>{
    // Optimistic toggle first for instant UI
        const user = localStorage.getItem('user');
    if(!user) return toast.error("You must be logged in...");
        let prevSnapshot;
        set((state) => {
            prevSnapshot = { clubs: state.clubs, club: state.club };
            const toggle = (c) => {
                if (!c || c.club_id !== club_id) return c;
                const liked = Boolean(c.likedByMe);
                const nextLikes = Math.max(0, (Number(c.likes) || 0) + (liked ? -1 : 1));
                return { ...c, likedByMe: !liked, likes: nextLikes };
            };
            return {
                clubs: state.clubs.map((c) => toggle(c)),
                club: toggle(state.club)
            };
        });

        try{
                const res = await fetch(`/api/clubs/like/${club_id}`,
                        {
                                method: 'POST',
                                headers: {
                                        'Content-Type': 'application/json'
                                },
                                credentials:'include',    
                        }
                )
        if(!res.ok){
                        console.log("Error occurred while adding like:", res.statusText);
                        // Revert optimistic change on failure
                        set(() => ({ clubs: prevSnapshot.clubs, club: prevSnapshot.club }));
                        return ;
                }
                // If backend returns counts, you could sync here.
        }catch(err){
             console.error(err);
             // Revert on error
             set(() => ({ clubs: prevSnapshot.clubs, club: prevSnapshot.club }));
             return;
        }
  },
  addView : async (club_id)=>{
        try{
            const res = await fetch(`/api/clubs/views/${club_id}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials:'include'
            });
            if(!res.ok){
              console.log("Error occured while adding view:", res.statusText);
               return set({loading:false, error:'Error occured while adding view'})
            }
            const data = await res.json();
            console.log(data)
        }catch(err){
            console.error(err);
        }
  },
  addReview: async (club_id, reviewText)=>{
    const user = localStorage.getItem('user');
    if(!user) return toast.error('You must be logged in to submit a review.');
    try{
       set({error:null})
       const res = await fetch(`/api/clubs/reviews/${club_id}`, 
        {
            method:'POST',
            headers:{
                'content-type':'application/json'
            },
            credentials:'include',
            body:JSON.stringify({text:reviewText})
        }
       )
       if(!res.ok){
        toast.error("Error occured while submitting the review")
        return {success:false, error:'error occured while subimitting the review'}
       }

             const data = await res.json();
             const review = data?.review;
             toast.success("Review submitted successfully");
             set((state)=>{
                 const existing = state.club?.reviews || [];
                 return {
                     loading:false,
                     club: {
                         ...state.club,
                         reviews: review ? [...existing, review] : existing
                     }
                 };
             })
             return {success:true, error:null}
    }catch(err){
        console.error(err)
        toast.error('Error occured white submitting the review...')
        return {success:false, error:'Error occurred while submitting the review '}
    }
    
  },
  sendMessage: async (formData, admin_id)=>{
    const user = localStorage.getItem('user');
    if(!user) return toast.error('You must be logged in to send a message.');
    try{
        const res = await fetch(`/api/clubs/message`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ ...formData, admin_id })
        });
        if(!res.ok){
            console.log("Error occurred while sending message:", res.statusText);
            return {success:false, error:'Error occurred while sending message'};
        }
        const data = await res.json();
        if(data.success){
            toast.success(data.message);
            return {success:true, error:null};
        }else{
            toast.error(data.message || "Error occurred while sending message");
            return {success:false, error:data.error || 'Error occurred while sending message'};
        }
    }catch(err){
        console.error("Error occurred while sending message:", err);
        return {success:false, error:'Error occurred while sending message'};
    }
  },
 
}))

export default useClubsStore;
