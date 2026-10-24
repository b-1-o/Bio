'use client'

import type { ReactNode } from 'react'

type PhoneDeviceProps = {
  children?: ReactNode
  className?: string
}

export default function PhoneDevice({ children, className = '' }: PhoneDeviceProps) {
  return (
    <div
      className={`phone-device group relative mx-auto w-[min(100%,280px)] aspect-[9/19] ${className}`}
      style={{ perspective: '1200px' }}
    >
      <div
        className="phone-device__body relative h-full w-full rounded-[2.2rem] border border-[#262626] bg-[#0a0a0a] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.85)] transition-transform duration-500 ease-out group-hover:[transform:rotateY(-8deg)_rotateX(4deg)]"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Side bezel shine */}
        <div className="pointer-events-none absolute inset-y-4 -left-px w-px bg-gradient-to-b from-transparent via-[#404040] to-transparent opacity-60" />
        <div className="pointer-events-none absolute inset-y-4 -right-px w-px bg-gradient-to-b from-transparent via-[#404040] to-transparent opacity-40" />

        {/* Notch / Dynamic Island */}
        <div className="absolute left-1/2 top-3 z-20 h-6 w-24 -translate-x-1/2 rounded-full bg-[#050505] border border-[#1a1a1a]" />

        {/* Screen */}
        <div className="absolute inset-[10px] overflow-hidden rounded-[1.7rem] bg-[#050505]">
          <div className="h-full w-full grayscale contrast-110">
            {children ?? (
              <div className="flex h-full items-center justify-center font-mono text-[10px] text-[#333]">
                [ NO PREVIEW ]
              </div>
            )}
          </div>
        </div>

        {/* Home indicator */}
        <div className="absolute bottom-2 left-1/2 z-20 h-1 w-16 -translate-x-1/2 rounded-full bg-[#262626]" />
      </div>
    </div>
  )
}
