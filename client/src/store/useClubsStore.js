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
                }
            }
        );
        if(!res.ok){
           return set({loading:false, error:'Error occured while fetching clubs'})
        }
        const data = await res.json();
        set({loading:false, clubs:data, error:null})
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
                }
            }
        );
        if(!res.ok){
           return set({loading:false, error:'Error occured while fetching club'})
        }
        const data = await res.json();
        set({loading:false, club:data, error:null})
    }catch(err){
        console.error(err);
        return set({loading:false, error:'Error occured while fetching club: ' + err.message})
    }
  }
}))

export default useClubsStore;
