"use client"

import { useState, useRef } from "react"
import type React from "react"

export function useButtonAnimation() {
  const [rentButtonPos, setRentButtonPos] = useState({ x: 0, y: 0 })
  const [viewButtonPos, setViewButtonPos] = useState({ x: 0, y: 0 })
  const rentButtonRef = useRef<HTMLButtonElement>(null)
  const viewButtonRef = useRef<HTMLButtonElement>(null)

  const handleMouseEnter = (
    e: React.MouseEvent<HTMLButtonElement>,
    buttonRef: React.RefObject<HTMLButtonElement>,
    setPosition: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>,
  ) => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      setPosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
    }
  }

  return {
    rentButtonPos,
    viewButtonPos,
    rentButtonRef,
    viewButtonRef,
    handleMouseEnter,
    setRentButtonPos,
    setViewButtonPos,
  }
}
