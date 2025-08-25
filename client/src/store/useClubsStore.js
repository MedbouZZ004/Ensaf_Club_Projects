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
  }
}))

export default useClubsStore;
