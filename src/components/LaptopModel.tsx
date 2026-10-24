import { RoundedBox } from '@react-three/drei'

export type ProjectScreen = 'music' | 'docs' | 'jobs' | 'shop'
type Mark = { x: number; y: number; w: number; h: number; tone?: string }

const screenMarks: Record<ProjectScreen, Mark[]> = {
  music: [
    { x: -0.83, y: 0.76, w: 0.45, h: 0.035, tone: '#eeeeee' },
    { x: 0.83, y: 0.76, w: 0.25, h: 0.025, tone: '#777777' },
    { x: -0.89, y: 0.23, w: 0.33, h: 0.82, tone: '#161616' },
    { x: 0.1, y: 0.3, w: 0.68, h: 0.64, tone: '#282828' },
    { x: 0.1, y: 0.3, w: 0.28, h: 0.28, tone: '#bcbcbc' },
    { x: 0.74, y: -0.08, w: 0.28, h: 0.025, tone: '#dedede' },
    { x: 0.67, y: -0.18, w: 0.42, h: 0.02, tone: '#777777' },
    { x: 0.67, y: -0.32, w: 0.42, h: 0.02, tone: '#555555' },
    { x: 0.1, y: -0.59, w: 1.9, h: 0.026, tone: '#777777' },
    { x: -0.42, y: -0.73, w: 0.06, h: 0.06, tone: '#eeeeee' },
    { x: -0.18, y: -0.73, w: 0.06, h: 0.06, tone: '#8d8d8d' },
    { x: 0.06, y: -0.73, w: 0.06, h: 0.06, tone: '#8d8d8d' },
  ],
  docs: [
    { x: -0.86, y: 0.76, w: 0.5, h: 0.035, tone: '#ededed' },
    { x: 0.84, y: 0.76, w: 0.23, h: 0.025, tone: '#777777' },
    { x: -0.84, y: 0.29, w: 0.32, h: 0.92, tone: '#161616' },
    { x: 0.13, y: 0.48, w: 1.1, h: 0.08, tone: '#e0e0e0' },
    { x: 0.02, y: 0.21, w: 0.92, h: 0.025, tone: '#848484' },
    { x: 0.1, y: 0.07, w: 1.12, h: 0.025, tone: '#555555' },
    { x: 0.0, y: -0.12, w: 0.88, h: 0.025, tone: '#626262' },
    { x: 0.14, y: -0.27, w: 1.12, h: 0.025, tone: '#555555' },
    { x: -0.02, y: -0.42, w: 0.84, h: 0.025, tone: '#777777' },
    { x: 0.1, y: -0.6, w: 1.09, h: 0.025, tone: '#424242' },
  ],
  jobs: [
    { x: -0.85, y: 0.76, w: 0.47, h: 0.035, tone: '#ededed' },
    { x: 0.84, y: 0.76, w: 0.22, h: 0.025, tone: '#777777' },
    { x: -0.82, y: 0.28, w: 0.34, h: 0.9, tone: '#161616' },
    { x: -0.15, y: 0.48, w: 0.5, h: 0.3, tone: '#242424' },
    { x: 0.53, y: 0.48, w: 0.5, h: 0.3, tone: '#202020' },
    { x: 0.0, y: 0.35, w: 0.16, h: 0.025, tone: '#d3d3d3' },
    { x: 0.65, y: 0.35, w: 0.2, h: 0.025, tone: '#9a9a9a' },
    { x: -0.15, y: -0.27, w: 1.1, h: 0.02, tone: '#444444' },
    { x: -0.15, y: -0.43, w: 0.92, h: 0.02, tone: '#444444' },
    { x: -0.15, y: -0.59, w: 0.76, h: 0.02, tone: '#444444' },
    { x: -0.15, y: -0.7, w: 1.65, h: 0.07, tone: '#9a9a9a' },
  ],
  shop: [
    { x: -0.84, y: 0.76, w: 0.5, h: 0.035, tone: '#ededed' },
    { x: 0.84, y: 0.76, w: 0.23, h: 0.025, tone: '#777777' },
    { x: -0.83, y: 0.32, w: 0.31, h: 0.94, tone: '#161616' },
    { x: 0.03, y: 0.45, w: 0.69, h: 0.29, tone: '#303030' },
    { x: 0.04, y: 0.45, w: 0.3, h: 0.03, tone: '#ececec' },
    { x: 0.02, y: 0.01, w: 1.55, h: 0.025, tone: '#777777' },
    { x: 0.02, y: -0.16, w: 1.55, h: 0.025, tone: '#777777' },
    { x: 0.02, y: -0.33, w: 1.55, h: 0.025, tone: '#777777' },
    { x: 0.02, y: -0.5, w: 1.55, h: 0.025, tone: '#777777' },
    { x: 0.72, y: 0.01, w: 0.25, h: 0.045, tone: '#d6d6d6' },
    { x: 0.72, y: -0.16, w: 0.25, h: 0.045, tone: '#bdbdbd' },
    { x: 0.72, y: -0.33, w: 0.25, h: 0.045, tone: '#d6d6d6' },
  ],
}

function ScreenMark({ x, y, w, h, tone = '#777777' }: Mark) {
  return <mesh position={[x, y, 0.059]}>
    <boxGeometry args={[w, h, 0.008]} />
    <meshStandardMaterial color={tone} roughness={0.95} metalness={0.02} />
  </mesh>
}

export function LaptopModel({ screen }: { screen: ProjectScreen }) {
  const keys = Array.from({ length: 50 }, (_, index) => {
    const row = Math.floor(index / 10)
    const column = index % 10
    return { x: (column - 4.5) * 0.245, z: 0.18 + row * 0.19, width: column === 4 && row === 4 ? 0.5 : 0.17, key: row + '-' + column }
  })

  return <group rotation={[0.015, -0.12, 0.015]} scale={1.06}>
    <RoundedBox args={[2.72, 1.76, 0.11]} radius={0.07} smoothness={4} position={[0, 0.46, 0]} castShadow>
      <meshStandardMaterial color="#282828" roughness={0.28} metalness={0.78} />
    </RoundedBox>
    <mesh position={[0, 0.46, 0.059]}>
      <planeGeometry args={[2.54, 1.58]} />
      <meshStandardMaterial color="#050505" roughness={0.92} metalness={0.04} />
    </mesh>
    {screenMarks[screen].map((mark, index) => <ScreenMark key={screen + '-' + index} {...mark} />)}
    <RoundedBox args={[3.12, 0.13, 1.6]} radius={0.055} smoothness={4} position={[0, -0.46, 0.69]} castShadow>
      <meshStandardMaterial color="#333333" roughness={0.34} metalness={0.72} />
    </RoundedBox>
    <mesh position={[0, -0.388, 0.71]}>
      <boxGeometry args={[2.84, 0.012, 1.31]} />
      <meshStandardMaterial color="#151515" roughness={0.98} />
    </mesh>
    {keys.map((key) => <mesh key={key.key} position={[key.x, -0.379, key.z]}>
      <boxGeometry args={[key.width, 0.012, 0.09]} />
      <meshStandardMaterial color="#555555" roughness={0.72} metalness={0.2} />
    </mesh>)}
    <RoundedBox args={[0.65, 0.012, 0.32]} radius={0.025} smoothness={3} position={[0, -0.376, 1.29]}>
      <meshStandardMaterial color="#646464" roughness={0.56} metalness={0.32} />
    </RoundedBox>
    <mesh position={[0, -0.397, 1.47]}>
      <boxGeometry args={[0.82, 0.025, 0.03]} />
      <meshStandardMaterial color="#7a7a7a" roughness={0.5} metalness={0.4} />
    </mesh>
  </group>
}
