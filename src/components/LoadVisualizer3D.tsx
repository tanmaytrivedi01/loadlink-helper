
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Text, Line } from '@react-three/drei';
import { Trailer } from '@/lib/trailers';
import * as THREE from 'three';

interface LoadVisualizer3DProps {
  trailer: Trailer;
  loadDimensions: { length: number; width: number; height: number };
}

const TruckModel: React.FC<{
  position?: [number, number, number];
  scale?: number;
}> = ({ position = [-15, -1.5, 0], scale = 1 }) => {
  // Create a simple truck cab
  return (
    <group position={position} scale={scale}>
      {/* Cab */}
      <mesh position={[0, 2, 0]}>
        <boxGeometry args={[5, 3, 3]} />
        <meshStandardMaterial color="#444444" />
      </mesh>
      
      {/* Hood */}
      <mesh position={[3, 1, 0]}>
        <boxGeometry args={[2, 1, 3]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
      
      {/* Windshield */}
      <mesh position={[1.5, 2.5, 0]} rotation={[0, 0, Math.PI * 0.1]}>
        <boxGeometry args={[1, 2, 2.8]} />
        <meshStandardMaterial color="#88CCFF" opacity={0.7} transparent />
      </mesh>
      
      {/* Front wheels */}
      <mesh position={[3, 0, 1.5]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1, 1, 0.75, 16]} />
        <meshStandardMaterial color="#111111" />
      </mesh>
      <mesh position={[3, 0, -1.5]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1, 1, 0.75, 16]} />
        <meshStandardMaterial color="#111111" />
      </mesh>
      
      {/* Rear wheels (drive axles) */}
      <mesh position={[-1.5, 0, 1.5]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1, 1, 0.75, 16]} />
        <meshStandardMaterial color="#111111" />
      </mesh>
      <mesh position={[-1.5, 0, -1.5]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1, 1, 0.75, 16]} />
        <meshStandardMaterial color="#111111" />
      </mesh>
      <mesh position={[-3, 0, 1.5]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1, 1, 0.75, 16]} />
        <meshStandardMaterial color="#111111" />
      </mesh>
      <mesh position={[-3, 0, -1.5]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1, 1, 0.75, 16]} />
        <meshStandardMaterial color="#111111" />
      </mesh>
      
      {/* Fifth wheel */}
      <mesh position={[-4, 1, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1, 1, 0.5, 16]} />
        <meshStandardMaterial color="#555555" />
      </mesh>
    </group>
  );
};

const TrailerModel: React.FC<{
  dimensions: { length: number; width: number; height: number };
  position?: [number, number, number];
  trailerType?: string;
}> = ({ dimensions, position = [0, 0, 0], trailerType = "flatbed" }) => {
  // Create trailer based on type
  const isFlatbed = trailerType.includes("flatbed") || trailerType.includes("lowboy") || trailerType === "step-deck";
  const isLowboy = trailerType.includes("lowboy");
  const isStepDeck = trailerType === "step-deck";
  
  // Calculate wheel positions based on trailer length
  const wheelPositions = useMemo(() => {
    const wheels = [];
    const wheelGroups = Math.max(2, Math.floor(dimensions.length / 15));
    const wheelSpacing = dimensions.length / (wheelGroups + 1);
    
    for (let i = 1; i <= wheelGroups; i++) {
      const xPos = (i * wheelSpacing) - dimensions.length/2;
      wheels.push([xPos, -1.5, dimensions.width/2 - 0.3]); // Right side
      wheels.push([xPos, -1.5, -dimensions.width/2 + 0.3]); // Left side
    }
    return wheels;
  }, [dimensions.length, dimensions.width]);

  return (
    <group position={position}>
      {/* Trailer bed */}
      {isFlatbed ? (
        // For flatbed, lowboy, or step deck
        <>
          {isLowboy ? (
            // Lowboy trailer (with lower deck)
            <>
              {/* Front gooseneck section */}
              <mesh position={[-dimensions.length/2 + 5, 0, 0]}>
                <boxGeometry args={[10, 1, dimensions.width]} />
                <meshStandardMaterial color="#777777" />
              </mesh>
              
              {/* Main deck (lowered) */}
              <mesh position={[0, -1, 0]}>
                <boxGeometry args={[dimensions.length - 15, 0.5, dimensions.width]} />
                <meshStandardMaterial color="#777777" />
              </mesh>
              
              {/* Rear section */}
              <mesh position={[dimensions.length/2 - 5, 0, 0]}>
                <boxGeometry args={[10, 1, dimensions.width]} />
                <meshStandardMaterial color="#777777" />
              </mesh>
            </>
          ) : isStepDeck ? (
            // Step deck trailer
            <>
              {/* Upper deck */}
              <mesh position={[-dimensions.length/2 + 7, 0, 0]}>
                <boxGeometry args={[14, 1, dimensions.width]} />
                <meshStandardMaterial color="#777777" />
              </mesh>
              
              {/* Lower deck */}
              <mesh position={[dimensions.length/2 - (dimensions.length - 14)/2, -1, 0]}>
                <boxGeometry args={[dimensions.length - 14, 0.5, dimensions.width]} />
                <meshStandardMaterial color="#777777" />
              </mesh>
              
              {/* Sloped section connecting decks */}
              <mesh position={[-dimensions.length/2 + 14, -0.5, 0]} rotation={[0, 0, -Math.PI * 0.1]}>
                <boxGeometry args={[4, 0.5, dimensions.width]} />
                <meshStandardMaterial color="#777777" />
              </mesh>
            </>
          ) : (
            // Standard flatbed
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[dimensions.length, 1, dimensions.width]} />
              <meshStandardMaterial color="#777777" />
            </mesh>
          )}
          
          {/* Support beams */}
          {Array.from({ length: Math.floor(dimensions.length / 10) + 1 }).map((_, idx) => (
            <mesh key={`beam-${idx}`} position={[idx * 10 - dimensions.length/2 + 5, -0.6, 0]}>
              <boxGeometry args={[0.5, 0.2, dimensions.width - 0.5]} />
              <meshStandardMaterial color="#555555" />
            </mesh>
          ))}
        </>
      ) : (
        // For van or reefer trailers
        <>
          {/* Trailer base/floor */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[dimensions.length, 1, dimensions.width]} />
            <meshStandardMaterial color="#777777" />
          </mesh>
          
          {/* Trailer walls */}
          <mesh position={[0, dimensions.height/2, 0]}>
            <boxGeometry args={[dimensions.length, dimensions.height, dimensions.width]} />
            <meshStandardMaterial color="#e0e0e0" transparent opacity={0.4} />
          </mesh>
        </>
      )}
      
      {/* Wheels */}
      {wheelPositions.map((pos, idx) => (
        <mesh key={`wheel-${idx}`} position={pos} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[1, 1, 0.75, 16]} />
          <meshStandardMaterial color="#111111" />
        </mesh>
      ))}
      
      {/* King pin at front */}
      <mesh position={[-dimensions.length/2 - 1, 0, 0]}>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
      
      {/* Label */}
      <Text
        position={[0, dimensions.height + 1, 0]}
        color="black"
        fontSize={0.8}
        anchorX="center"
        anchorY="bottom"
      >
        {`${trailerType.charAt(0).toUpperCase() + trailerType.slice(1)} Trailer (${dimensions.length}')`}
      </Text>
    </group>
  );
};

const LoadModel: React.FC<{
  dimensions: { length: number; width: number; height: number };
  trailerDimensions: { length: number; width: number; height: number };
  trailerType?: string;
}> = ({ dimensions, trailerDimensions, trailerType = "flatbed" }) => {
  const loadRef = useRef<THREE.Mesh>(null);
  const isFlatbed = trailerType.includes("flatbed") || trailerType.includes("lowboy") || trailerType === "step-deck";
  const isLowboy = trailerType.includes("lowboy");
  const isStepDeck = trailerType === "step-deck";
  
  // Calculate the correct Y position based on trailer type
  const yPosition = isFlatbed 
    ? (isLowboy ? -0.75 : (isStepDeck ? -0.75 : 0.5)) + dimensions.height / 2
    : 0.5 + dimensions.height / 2;

  // Add a simple subtle animation
  useFrame((state) => {
    if (loadRef.current) {
      loadRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.2) * 0.005;
    }
  });

  return (
    <mesh 
      ref={loadRef} 
      position={[0, yPosition, 0]}
    >
      <boxGeometry args={[dimensions.length, dimensions.height, dimensions.width]} />
      <meshStandardMaterial color="#3b82f6" />
      <Text
        position={[0, dimensions.height / 2 + 0.5, 0]}
        color="black"
        fontSize={0.6}
        anchorX="center"
        anchorY="bottom"
      >
        {`Load (${dimensions.length}' x ${dimensions.width}' x ${dimensions.height}')`}
      </Text>
    </mesh>
  );
};

// Draw measurement lines
const MeasurementLines: React.FC<{
  trailerLength: number;
  loadLength: number;
}> = ({ trailerLength, loadLength }) => {
  const lineColor = new THREE.Color("#ff3333");
  
  return (
    <group position={[0, -3, 0]}>
      {/* Trailer length line */}
      <Line
        points={[
          [-trailerLength/2, 0, 0],
          [trailerLength/2, 0, 0]
        ]}
        color={lineColor}
        lineWidth={1}
      />
      
      {/* Load length line */}
      <Line
        points={[
          [-loadLength/2, 1, 0],
          [loadLength/2, 1, 0]
        ]}
        color={lineColor}
        lineWidth={1}
      />
      
      {/* End markers for trailer */}
      <Line
        points={[
          [-trailerLength/2, -0.5, 0],
          [-trailerLength/2, 0.5, 0]
        ]}
        color={lineColor}
        lineWidth={1}
      />
      <Line
        points={[
          [trailerLength/2, -0.5, 0],
          [trailerLength/2, 0.5, 0]
        ]}
        color={lineColor}
        lineWidth={1}
      />
      
      {/* End markers for load */}
      <Line
        points={[
          [-loadLength/2, 0.5, 0],
          [-loadLength/2, 1.5, 0]
        ]}
        color={lineColor}
        lineWidth={1}
      />
      <Line
        points={[
          [loadLength/2, 0.5, 0],
          [loadLength/2, 1.5, 0]
        ]}
        color={lineColor}
        lineWidth={1}
      />
      
      {/* Labels */}
      <Text position={[0, 0, 0]} color="black" fontSize={0.7} anchorY="top">
        {`Trailer: ${trailerLength}'`}
      </Text>
      <Text position={[0, 1, 0]} color="black" fontSize={0.7} anchorY="top">
        {`Load: ${loadLength}'`}
      </Text>
    </group>
  );
};

const LoadVisualizer3D: React.FC<LoadVisualizer3DProps> = ({ trailer, loadDimensions }) => {
  // Scale factors to make visualization fit nicely
  const scaleFactor = 0.2;
  
  const trailerScaled = {
    length: trailer.maxLength * scaleFactor,
    width: trailer.maxWidth * scaleFactor,
    height: trailer.maxHeight * scaleFactor
  };
  
  const loadScaled = {
    length: loadDimensions.length * scaleFactor,
    width: loadDimensions.width * scaleFactor,
    height: loadDimensions.height * scaleFactor
  };

  return (
    <div className="h-[500px] w-full bg-white">
      <Canvas shadows>
        <ambientLight intensity={0.5} />
        <directionalLight 
          position={[10, 10, 10]} 
          intensity={1} 
          castShadow 
        />
        <PerspectiveCamera makeDefault position={[0, 5, 20]} />
        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={5}
          maxDistance={50}
          target={[0, 0, 0]}
        />
        
        {/* Truck, trailer and load */}
        <TruckModel scale={scaleFactor} position={[-trailerScaled.length/2 - 3, 0, 0]} />
        <TrailerModel dimensions={trailerScaled} trailerType={trailer.type} />
        <LoadModel 
          dimensions={loadScaled} 
          trailerDimensions={trailerScaled}
          trailerType={trailer.type}
        />
        
        {/* Measurement lines */}
        <MeasurementLines 
          trailerLength={trailerScaled.length} 
          loadLength={loadScaled.length} 
        />
        
        {/* Grid and axis helpers */}
        <gridHelper args={[100, 100, '#888888', '#cccccc']} position={[0, -1.5, 0]} />
        <axesHelper args={[5]} position={[0, -1.5, 0]} />
      </Canvas>
    </div>
  );
};

export default LoadVisualizer3D;
