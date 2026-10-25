import type { ReactNode } from 'react'
import PhoneDevice from './PhoneDevice'
import LaptopDevice from './LaptopDevice'

type DeviceKind = 'phone' | 'laptop'

type ProjectDevice3DProps = {
  device: DeviceKind
  children: ReactNode
}

/**
 * Keep the project previews in the regular React DOM. The previous R3F Html
 * portal could fight React during intersection-driven Canvas unmounts, leaving
 * the device blank and throwing removeChild NotFoundError in production.
 * The device shells still use the carefully styled perspective CSS models.
 */
export function ProjectDevice3D({ device, children }: ProjectDevice3DProps) {
  return (
    <div className={'project-device-3d project-device-3d--' + device}>
      {device === 'phone' ? (
        <PhoneDevice className="projects-showcase__phone">{children}</PhoneDevice>
      ) : (
        <LaptopDevice className="projects-showcase__laptop">{children}</LaptopDevice>
      )}
    </div>
  )
}
