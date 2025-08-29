import {create} from 'zustand'
const useClubsStore = create((set) => ({
  clubs: [],
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
}));

export default useClubsStore;
