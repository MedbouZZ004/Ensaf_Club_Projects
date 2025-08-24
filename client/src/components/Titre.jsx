import React from 'react'

function Titre({ clubName }) {
  return (
    <h1 className="text-3xl md:text-4xl text-primary font-bold">
      ABOUT THE CLUB: <span className="text-neutral-200">{clubName}</span>
    </h1>
  )
}

export default Titre
