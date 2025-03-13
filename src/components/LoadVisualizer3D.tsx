
import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Box, Text } from '@react-three/drei';
import { Trailer } from '@/lib/trailers';
import * as THREE from 'three';

interface LoadVisualizer3DProps {
  trailer: Trailer;
  loadDimensions: { length: number; width: number; height: number };
}

const TrailerModel: React.FC<{
  dimensions: { length: number; width: number; height: number };
  position?: [number, number, number];
}> = ({ dimensions, position = [0, 0, 0] }) => {
  // Scale trailer to fit well in view
  return (
    <Box 
      args={[dimensions.length, dimensions.height, dimensions.width]} 
      position={position}
    >
      <meshStandardMaterial color="#e0e0e0" transparent opacity={0.3} />
      <Text
        position={[0, dimensions.height / 2 + 0.5, 0]}
        color="black"
        fontSize={0.5}
        anchorX="center"
        anchorY="bottom"
      >
        Trailer
      </Text>
    </Box>
  );
};

const LoadModel: React.FC<{
  dimensions: { length: number; width: number; height: number };
}> = ({ dimensions }) => {
  const loadRef = useRef<THREE.Mesh>(null);

  // Add a simple animation to highlight the load
  useFrame((state) => {
    if (loadRef.current) {
      loadRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.02;
    }
  });

  return (
    <Box 
      ref={loadRef}
      args={[dimensions.length, dimensions.height, dimensions.width]} 
      position={[0, 0, 0]}
    >
      <meshStandardMaterial color="#3b82f6" />
      <Text
        position={[0, dimensions.height / 2 + 0.3, 0]}
        color="black"
        fontSize={0.4}
        anchorX="center"
        anchorY="bottom"
      >
        Load
      </Text>
    </Box>
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
    <div className="h-[400px] w-full bg-white">
      <Canvas shadows>
        <ambientLight intensity={0.5} />
        <directionalLight 
          position={[10, 10, 10]} 
          intensity={1} 
          castShadow 
          shadow-mapSize-width={2048} 
          shadow-mapSize-height={2048} 
        />
        <PerspectiveCamera makeDefault position={[10, 5, 10]} />
        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={5}
          maxDistance={20}
        />
        <TrailerModel dimensions={trailerScaled} />
        <LoadModel dimensions={loadScaled} />
        <gridHelper args={[20, 20, '#888888', '#cccccc']} />
      </Canvas>
    </div>
  );
};

export default LoadVisualizer3D;
