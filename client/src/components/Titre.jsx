import React from 'react'

function Titre({ clubName }) {
  return (
    <h1 className="text-3xl md:text-4xl text-primary font-bold">
      About the Club {clubName}
    </h1>
  )
}

export default Titre
