import React, { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  useGLTF,
  ContactShadows,
  Environment,
} from "@react-three/drei";
import { proxy, useSnapshot } from "valtio";
import { HexColorPicker } from "react-colorful";
import { Helmet } from "react-helmet";

const state = proxy({
  current: null,
  items: {
    laces: "#ffffff",
    mesh: "#ffffff",
    caps: "#ffffff",
    inner: "#ffffff",
    sole: "#ffffff",
    stripes: "#ffffff",
    band: "#ffffff",
    patch: "#ffffff",
  },
});

function Shoe(props) {
  const ref = useRef();
  const snap = useSnapshot(state);
  const { nodes, materials } = useGLTF("/shoe.gltf");
  const [hovered, setHovered] = useState(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    ref.current.rotation.z = -0.2 - (1 + Math.sin(t / 1.5)) / 20;
    ref.current.rotation.x = Math.cos(t / 4) / 8;
    ref.current.rotation.y = Math.sin(t / 4) / 8;
    ref.current.position.y = (1 + Math.sin(t / 1.5)) / 10;
  });

  useEffect(() => {
    const cursor = `<svg width="64" height="64" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0)"><path fill="rgba(255, 255, 255, 0.5)" d="M29.5 54C43.031 54 54 43.031 54 29.5S43.031 5 29.5 5 5 15.969 5 29.5 15.969 54 29.5 54z" stroke="#000"/><g filter="url(#filter0_d)"><path d="M29.5 47C39.165 47 47 39.165 47 29.5S39.165 12 29.5 12 12 19.835 12 29.5 19.835 47 29.5 47z" fill="${snap.items[hovered]}"/></g><path d="M2 2l11 2.947L4.947 13 2 2z" fill="#000"/><text fill="#000" style="white-space:pre" font-family="Inter var, sans-serif" font-size="10" letter-spacing="-.01em"><tspan x="35" y="63">${hovered}</tspan></text></g><defs><clipPath id="clip0"><path fill="#fff" d="M0 0h64v64H0z"/></clipPath><filter id="filter0_d" x="6" y="8" width="47" height="47" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset dy="2"/><feGaussianBlur stdDeviation="3"/><feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"/><feBlend in2="BackgroundImageFix" result="effect1_dropShadow"/><feBlend in="SourceGraphic" in2="effect1_dropShadow" result="shape"/></filter></defs></svg>`;
    const auto = `<svg width="64" height="64" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill="rgba(255, 255, 255, 0.5)" d="M29.5 54C43.031 54 54 43.031 54 29.5S43.031 5 29.5 5 5 15.969 5 29.5 15.969 54 29.5 54z" stroke="#000"/><path d="M2 2l11 2.947L4.947 13 2 2z" fill="#000"/></svg>`;
    document.body.style.cursor = `url('data:image/svg+xml;base64,${btoa(
      hovered ? cursor : auto
    )}'), auto`;
  }, [hovered]);

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>3D Product Customizer</title>
        <link rel="canonical" href="" />
      </Helmet>
      <group
        ref={ref}
        dispose={null}
        scale={3}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(e.object.material.name);
        }}
        onPointerOut={(e) => {
          e.intersections.length === 0 && setHovered(null);
        }}
        onPointerDown={(e) => {
          e.stopPropagation();
          state.current = e.object.material.name;
        }}
        onPointerMissed={(e) => {
          state.current = null;
        }}
      >
        <mesh
          material-color={snap.items.laces}
          geometry={nodes.shoe.geometry}
          material={materials.laces}
        />
        <mesh
          material-color={snap.items.mesh}
          geometry={nodes.shoe_1.geometry}
          material={materials.mesh}
        />
        <mesh
          material-color={snap.items.caps}
          geometry={nodes.shoe_2.geometry}
          material={materials.caps}
        />
        <mesh
          material-color={snap.items.inner}
          geometry={nodes.shoe_3.geometry}
          material={materials.inner}
        />
        <mesh
          material-color={snap.items.sole}
          geometry={nodes.shoe_4.geometry}
          material={materials.sole}
        />
        <mesh
          material-color={snap.items.stripes}
          geometry={nodes.shoe_5.geometry}
          material={materials.stripes}
        />
        <mesh
          material-color={snap.items.band}
          geometry={nodes.shoe_6.geometry}
          material={materials.band}
        />
        <mesh
          material-color={snap.items.patch}
          geometry={nodes.shoe_7.geometry}
          material={materials.patch}
        />
      </group>
    </>
  );
}

export default function App() {
  const snap = useSnapshot(state);
  return (
    <div className="h-screen flex items-center justify-center bg-[#5dafb8] text-white gap-4">
      <div style={{ display: snap.current ? "block" : "none" }}>
        <HexColorPicker
          color={snap.items[snap.current]}
          onChange={(color) => (state.items[snap.current] = color)}
        />
      </div>
      <div>
        <div className="mb-2 text-center h-[50px]">
          <h1 className="text-5xl capitalize">{snap.current}</h1>
        </div>
        <div className="h-[38vh] w-[35vw] bg-white shadow-2xl mb-[20px] rounded-xl">
          {/* 3D Model will be displayed in here */}
          <Canvas
            concurrent
            pixelRatio={[1, 1.5]}
            camera={{ position: [0, 0, 2.75] }}
          >
            <ambientLight intensity={0.3} />
            <spotLight
              intensity={0.3}
              angle={0.1}
              penumbra={1}
              position={[5, 25, 20]}
            />
            {/* When rendering 3D models, if there are any errors, Suspense will capture them. */}
            <Suspense fallback={null}>
              <Shoe />
              <Environment files="royal_esplanade_1k.hdr" />
              <ContactShadows
                rotation-x={Math.PI / 2}
                position={[0, -0.8, 0]}
                opacity={0.25}
                width={10}
                height={10}
                blur={2}
                far={1}
              />
            </Suspense>
            <OrbitControls
              minPolarAngle={Math.PI / 2}
              maxPolarAngle={Math.PI / 2}
              enableZoom={true}
              enablePan={true}
              enableRotate={true}
            />
          </Canvas>
        </div>
      </div>
    </div>
  );
}
