"use client"

import { useEffect, useState, useRef, useCallback, Children, cloneElement } from "react"
import { motion, useAnimationControls } from "framer-motion"

export function InfiniteSlider({ children, speed = 25, gap = 48, className = "" }) {
  const [contentWidth, setContentWidth] = useState(0)
  const innerRef = useRef(null)
  const controls = useAnimationControls()

  const measure = useCallback(() => {
    if (innerRef.current) {
      // Each "set" of children occupies half the total scrollWidth
      setContentWidth(innerRef.current.scrollWidth / 2)
    }
  }, [])

  useEffect(() => {
    // Measure after images may have loaded
    measure()
    const timer = setTimeout(measure, 500)
    window.addEventListener("resize", measure)
    return () => {
      clearTimeout(timer)
      window.removeEventListener("resize", measure)
    }
  }, [measure])

  useEffect(() => {
    if (contentWidth === 0) return

    controls.start({
      x: -contentWidth,
      transition: {
        x: {
          repeat: Infinity,
          repeatType: "loop",
          duration: contentWidth / speed,
          ease: "linear",
        },
      },
    })
  }, [contentWidth, speed, controls])

  // Render children twice for seamless loop
  const items = Children.toArray(children)

  return (
    <div className={`overflow-hidden mask-fade-x ${className}`}>
      <motion.div
        ref={innerRef}
        className="flex items-center w-max"
        style={{ gap }}
        animate={controls}
      >
        {items.map((child, i) => (
          <div key={`a-${i}`} className="shrink-0">{child}</div>
        ))}
        {items.map((child, i) => (
          <div key={`b-${i}`} className="shrink-0">{child}</div>
        ))}
      </motion.div>
    </div>
  )
}
