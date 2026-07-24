"use client";



import { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, Center, Text } from "@react-three/drei";
import { Group } from "three";
import { cn } from "@/lib/utils";

// Ordered starting at the 12 o'clock position, then clockwise.
const ROMAN_NUMERALS = [
  "XII",
  "I",
  "II",
  "III",
  "IV",
  "V",
  "VI",
  "VII",
  "VIII",
  "IX",
  "X",
  "XI",
];


/** A single clock hand: a box that pivots from the watch center. */
function Hand({
  length,
  width,
  depth,
  color,
  rotationRef,
}: {
  length: number;
  width: number;
  depth: number;
  color: string;
  rotationRef: React.MutableRefObject<number>;
}) {
  const ref = useRef<Group>(null);

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.z = rotationRef.current;
    }
  });

  return (
    <group ref={ref}>
      {/* Offset the box up so the group rotates around the dial center */}
      <mesh position={[0, length / 2, 0]}>
        <boxGeometry args={[width, length, depth]} />
        <meshStandardMaterial color={color} metalness={0.9} roughness={0.15} />
      </mesh>
    </group>
  );
}

function WatchCase({ isRotating }: { isRotating: boolean }) {
  const groupRef = useRef<Group>(null);

  // Live hand angles, updated every frame from the real clock (radians,
  // negative = clockwise). Kept in refs so nothing re-renders React.
  const hourRot = useRef(0);
  const minuteRot = useRef(0);
  const secondRot = useRef(0);

  useFrame((_, delta) => {
    if (isRotating && groupRef.current) {
      // Frame-rate independent, gentle showcase rotation.
      groupRef.current.rotation.y += delta * 0.4;
    }

    const now = new Date();
    const s = now.getSeconds();
    const m = now.getMinutes() + s / 60;
    const h = (now.getHours() % 12) + m / 60;

    secondRot.current = -(s / 60) * Math.PI * 2;
    minuteRot.current = -(m / 60) * Math.PI * 2;
    hourRot.current = -(h / 12) * Math.PI * 2;
  });


  // Cylinders default to having their circular faces on the Y axis, so we
  // rotate them a quarter turn on X to make the watch face point at the camera
  // (matching the torus bezel, which already lies in the XY plane).
  const faceCamera: [number, number, number] = [Math.PI / 2, 0, 0];

  // Radii chosen so the parts nest cleanly: bezel outer edge > dial > markers.
  const bezelRadius = 1.6;
  const dialRadius = 1.35;
  const markerRingRadius = 1.1;

  return (
    <group ref={groupRef}>
      <Center>
        {/* Bezel ring (already faces the camera in the XY plane) */}
        <mesh position={[0, 0, 0.25]}>
          <torusGeometry args={[bezelRadius, 0.12, 32, 96]} />
          <meshStandardMaterial color="#c9a96e" metalness={0.9} roughness={0.15} />
        </mesh>

        {/* Case body */}
        <mesh position={[0, 0, 0]} rotation={faceCamera}>
          <cylinderGeometry args={[bezelRadius, bezelRadius, 0.4, 96]} />
          <meshStandardMaterial color="#c9a96e" metalness={0.85} roughness={0.2} />
        </mesh>

        {/* Dial face, recessed slightly inside the bezel */}
        <mesh position={[0, 0, 0.21]} rotation={faceCamera}>
          <cylinderGeometry args={[dialRadius, dialRadius, 0.05, 96]} />
          <meshStandardMaterial color="#1a1a2e" metalness={0.3} roughness={0.6} />
        </mesh>

        {/* Roman numeral hour markers (I–XII) on the dial face */}
        {ROMAN_NUMERALS.map((numeral, i) => {
          const angle = (i / 12) * Math.PI * 2;
          return (
            <Text
              key={`hour-${i}`}
              position={[
                Math.sin(angle) * markerRingRadius,
                Math.cos(angle) * markerRingRadius,
                0.25,
              ]}
              fontSize={0.18}
              color="#c9a96e"
              anchorX="center"
              anchorY="middle"
            >
              {numeral}
            </Text>
          );
        })}


        {/* Hands, stacked slightly above the dial. Grouped so they pivot
            around the true center of the watch. */}
        <group position={[0, 0, 0.28]}>
          <Hand length={0.75} width={0.06} depth={0.03} color="#f5f0e8" rotationRef={hourRot} />
        </group>
        <group position={[0, 0, 0.31]}>
          <Hand length={1.05} width={0.04} depth={0.03} color="#f5f0e8" rotationRef={minuteRot} />
        </group>
        <group position={[0, 0, 0.34]}>
          <Hand length={1.15} width={0.015} depth={0.02} color="#c9a96e" rotationRef={secondRot} />
        </group>

        {/* Center hub */}
        <mesh position={[0, 0, 0.38]} rotation={faceCamera}>
          <cylinderGeometry args={[0.08, 0.08, 0.06, 32]} />
          <meshStandardMaterial color="#c9a96e" metalness={0.9} roughness={0.1} />
        </mesh>


        {/* Crown on the side of the case */}
        <mesh position={[bezelRadius + 0.05, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.09, 0.09, 0.18, 24]} />
          <meshStandardMaterial color="#c9a96e" metalness={0.9} roughness={0.1} />
        </mesh>
      </Center>
    </group>
  );
}

interface Product360ViewerProps {
  className?: string;
}

export function Product360Viewer({ className }: Product360ViewerProps) {
  const [isRotating, setIsRotating] = useState(true);

  return (
    <div className={cn("relative aspect-square overflow-hidden bg-black", className)}>
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }} dpr={[1, 2]}>
        <ambientLight intensity={0.3} />
        <spotLight position={[5, 5, 5]} angle={0.3} penumbra={1} intensity={1} />
        <spotLight position={[-5, -5, 5]} angle={0.3} penumbra={1} intensity={0.5} />
        <pointLight position={[0, 0, 3]} intensity={0.2} />
        <WatchCase isRotating={isRotating} />
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          minDistance={3}
          maxDistance={8}
          onStart={() => setIsRotating(false)}
          onEnd={() => setTimeout(() => setIsRotating(true), 3000)}
        />
        <Environment preset="city" />
      </Canvas>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
        <p className="text-[10px] tracking-[0.2em] uppercase text-cream/40">
          Drag to rotate &middot; Scroll to zoom
        </p>
      </div>
    </div>
  );
}
