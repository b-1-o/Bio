'use client'

import type { ReactNode } from 'react'

type LaptopDeviceProps = {
  children?: ReactNode
  className?: string
}

export default function LaptopDevice({ children, className = '' }: LaptopDeviceProps) {
  return (
    <div
      className={`laptop-device group relative mx-auto w-full max-w-[520px] ${className}`}
      style={{ perspective: '1400px' }}
    >
      <div
        className="laptop-device__lid relative w-full aspect-[16/10] rounded-t-[12px] border border-[#262626] bg-[#0a0a0a] shadow-[0_24px_50px_-18px_rgba(0,0,0,0.8)] transition-transform duration-500 ease-out group-hover:[transform:rotateX(6deg)_rotateY(-4deg)]"
        style={{ transformStyle: 'preserve-3d', transformOrigin: 'bottom center' }}
      >
        {/* Top bezel camera */}
        <div className="absolute left-1/2 top-2 z-20 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-[#1a1a1a] ring-1 ring-[#333]" />

        {/* Screen */}
        <div className="absolute inset-[10px] top-5 overflow-hidden rounded-[6px] bg-[#050505] border border-[#1a1a1a]">
          <div className="h-full w-full grayscale contrast-110">
            {children ?? (
              <div className="flex h-full items-center justify-center font-mono text-xs text-[#333]">
                [ NO PREVIEW ]
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Base / keyboard deck */}
      <div className="relative mx-auto h-3 w-[106%] -translate-x-[3%] rounded-b-[10px] border border-t-0 border-[#262626] bg-gradient-to-b from-[#111] to-[#0a0a0a]">
        <div className="absolute left-1/2 top-1 h-1 w-16 -translate-x-1/2 rounded-full bg-[#1a1a1a]" />
      </div>
      <div className="mx-auto h-2 w-[112%] -translate-x-[6%] rounded-b-[4px] bg-[#0a0a0a] border-x border-b border-[#1a1a1a]" />
    </div>
  )
}
