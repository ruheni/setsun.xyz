/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.1.4 public/models/sketch_cat.glb --transform --types
Author: katarkhei (https://sketchfab.com/katarkhei)
License: CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)
Source: https://sketchfab.com/3d-models/sketch-cat-79c1321b05ca47b79ee3111ff449518e
Title: Sketch Cat
*/

import * as THREE from "three";
import { useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import { GLTF } from "three-stdlib";
import { GroupProps } from "@react-three/fiber";
import { Material } from "three";

type GLTFResult = GLTF & {
  nodes: {
    Cube001_0: THREE.Mesh;
    Cube001_1: THREE.Mesh;
    Cube_0: THREE.Mesh;
    Cube_1: THREE.Mesh;
  };
  materials: {
    ["Material.012"]: THREE.MeshStandardMaterial;
    ["Material.009"]: THREE.MeshStandardMaterial;
    ["Material.008"]: THREE.MeshStandardMaterial;
    ["Material.007"]: THREE.MeshStandardMaterial;
  };
};

type StencilProps = {
  stencilWrite: boolean;
  stencilRef: number;
  stencilFunc: THREE.StencilFunc;
  stencilFail: THREE.StencilOp;
  stencilZFail: THREE.StencilOp;
  stencilZPass: THREE.StencilOp;
};

type Props = GroupProps & {
  customMaterial?: THREE.Material;
  stencil?: StencilProps;
};

export function SketchCat({ customMaterial, stencil, ...props }: Props) {
  const { nodes, materials } = useGLTF(
    "https:/setsun.xyz/models/sketch_cat-transformed.glb"
  ) as GLTFResult;

  const materialsWithStencil = useMemo(() => {
    const transformedMaterials: Record<string, Material> = {};

    if (stencil) {
      Object.entries(materials).forEach(([key, material]) => {
        material.stencilWrite = stencil.stencilWrite;
        material.stencilRef = stencil.stencilRef;
        material.stencilFunc = stencil.stencilFunc;
        material.stencilFail = stencil.stencilFail;
        material.stencilZFail = stencil.stencilZFail;
        material.stencilZPass = stencil.stencilZPass;

        transformedMaterials[key] = material;
      });
    }

    return transformedMaterials;
  }, [stencil]);

  return (
    <group {...props} dispose={null}>
      <group rotation={[-Math.PI / 2, 0, 0]}>
        <group position={[2.37, -0.06, 2]} scale={2.07}>
          <mesh
            geometry={nodes.Cube001_0.geometry}
            material={customMaterial ?? materialsWithStencil["Material.012"]}
          />
          <mesh
            geometry={nodes.Cube001_1.geometry}
            material={customMaterial ?? materialsWithStencil["Material.009"]}
          />
        </group>
        <mesh
          geometry={nodes.Cube_0.geometry}
          material={customMaterial ?? materialsWithStencil["Material.008"]}
        />
        <mesh
          geometry={nodes.Cube_1.geometry}
          material={customMaterial ?? materialsWithStencil["Material.007"]}
        />
      </group>
    </group>
  );
}

useGLTF.preload("/models/sketch_cat-transformed.glb");
