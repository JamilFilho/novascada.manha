"use client"

import { Provider, ClapButton } from '@lyket/react';
import { useEffect, useState } from "react";

export default function ApplauseButton({slug}:any) {
  const [mounted, setMounted] = useState(false)
    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return <div className="h-9 w-24" />
  }
  return(
    <Provider apiKey="pt_89cc199a4163149abcc63d6668992a">
    <ClapButton
        namespace="testing-react"
        id={`cadamanha-${slug}`}
    />
    </Provider>
  )
}