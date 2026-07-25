"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Center, OrbitControls, Text } from "@react-three/drei";
import { Group } from "three";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedWatchProps {
  className?: string;
}

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
      <mesh position={[0, length / 2, 0]}>
        <boxGeometry args={[width, length, depth]} />
        <meshStandardMaterial color={color} metalness={0.9} roughness={0.15} />
      </mesh>
    </group>
  );
}

function Watch() {
  const hourRot = useRef(0);
  const minuteRot = useRef(0);
  const secondRot = useRef(0);

  useFrame(() => {
    const now = new Date();
    const ms = now.getMilliseconds() / 1000;
    const s = now.getSeconds() + ms;
    const m = now.getMinutes() + s / 60;
    const h = (now.getHours() % 12) + m / 60;

    const tickSecond = Math.floor(now.getSeconds());
    secondRot.current = -(tickSecond / 60) * Math.PI * 2;
    minuteRot.current = -(m / 60) * Math.PI * 2;
    hourRot.current = -(h / 12) * Math.PI * 2;
  });

  const faceCamera: [number, number, number] = [Math.PI / 2, 0, 0];
  const bezelRadius = 1.6;
  const dialRadius = 1.35;
  const markerRingRadius = 1.1;

  return (
    <group position={[0, 0, 0]}>
      {/* Bezel ring */}
      <mesh position={[0, 0, 0.25]}>
        <torusGeometry args={[bezelRadius, 0.12, 32, 96]} />
        <meshStandardMaterial color="#c9a96e" metalness={0.9} roughness={0.15} />
      </mesh>

      {/* Case body */}
      <mesh position={[0, 0, 0]} rotation={faceCamera}>
        <cylinderGeometry args={[bezelRadius, bezelRadius, 0.4, 96]} />
        <meshStandardMaterial color="#c9a96e" metalness={0.85} roughness={0.2} />
      </mesh>

      {/* Dial face - Deep Midnight Navy */}
      <mesh position={[0, 0, 0.21]} rotation={faceCamera}>
        <cylinderGeometry args={[dialRadius, dialRadius, 0.05, 96]} />
        <meshStandardMaterial color="#0f172a" metalness={0.4} roughness={0.45} />
      </mesh>

      {/* Roman numeral hour markers (I–XII) */}
      {ROMAN_NUMERALS.map((numeral, i) => {
        const angle = (i / 12) * Math.PI * 2;
        return (
          <Text
            key={`hour-${i}`}
            position={[
              Math.sin(angle) * markerRingRadius,
              Math.cos(angle) * markerRingRadius,
              0.24,
            ]}
            fontSize={0.16}
            color="#c9a96e"
            anchorX="center"
            anchorY="middle"
          >
            {numeral}
          </Text>
        );
      })}

      {/* Hands */}
      <group position={[0, 0, 0.3]}>
        <Hand length={0.75} width={0.06} depth={0.03} color="#f5f0e8" rotationRef={hourRot} />
      </group>
      <group position={[0, 0, 0.33]}>
        <Hand length={1.05} width={0.04} depth={0.03} color="#f5f0e8" rotationRef={minuteRot} />
      </group>
      <group position={[0, 0, 0.36]}>
        <Hand length={1.15} width={0.015} depth={0.02} color="#c9a96e" rotationRef={secondRot} />
      </group>

      {/* Center hub */}
      <mesh position={[0, 0, 0.4]} rotation={faceCamera}>
        <cylinderGeometry args={[0.08, 0.08, 0.06, 32]} />
        <meshStandardMaterial color="#c9a96e" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Crown */}
      <mesh position={[bezelRadius + 0.05, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.09, 0.09, 0.18, 24]} />
        <meshStandardMaterial color="#c9a96e" metalness={0.9} roughness={0.1} />
      </mesh>
    </group>
  );
}

export function AnimatedWatch({ className }: AnimatedWatchProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.08, y: -10 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={cn("group relative aspect-square w-full cursor-grab active:cursor-grabbing", className)}
    >
      {/* Ambient gold glow that intensifies on hover */}
      <motion.div
        aria-hidden
        className="absolute left-1/2 top-1/2 -z-10 h-3/4 w-3/4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/20 blur-[100px] transition-all duration-500 group-hover:bg-gold/35 group-hover:blur-[120px]"
        animate={{ opacity: [0.4, 0.7, 0.4], scale: [0.95, 1.05, 0.95] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      <Canvas camera={{ position: [0, 0.4, 6.8], fov: 42 }} dpr={[1, 2]}>
        <ambientLight intensity={0.45} />
        <spotLight position={[4, 5, 5]} angle={0.4} penumbra={1} intensity={1.0} />
        <spotLight position={[-4, -3, 4]} angle={0.4} penumbra={1} intensity={0.4} />
        <pointLight position={[0, 0, 4]} intensity={0.5} />
        <Watch />
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          enableDamping
          dampingFactor={0.08}
          rotateSpeed={0.9}
        />
        <Environment preset="city" />
      </Canvas>
    </motion.div>
  );
}
