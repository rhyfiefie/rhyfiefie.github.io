// See hello-webxr documentation -> developers.google.com/ar/develop/webxr/hello-webxr


async function startXR() {
      const canvas = document.createElement("canvas");
      document.body.appendChild(canvas);
      const gl = canvas.getContext("webgl", { xrCompatible: true });

      const scene = new THREE.Scene()

      // object init 
      const materials = [
            new THREE.MeshBasicMaterial({ color: 0xff0000 }),
            new THREE.MeshBasicMaterial({ color: 0x0000ff }),
            new THREE.MeshBasicMaterial({ color: 0x0000ff })
            // ...
      ]

      const cube = new THREE.Mesh(new THREE.BoxBufferGeometry(0.2, 0.2, 0.2), materials);
      cube.position.set(1, 1, 1);
      scene.add(cube);

      // camera / renderer init
      const renderer = new THREE.WebGLRenderer({
            alpha: true,
            preserveDrawingBuffer: true,
            canvas: canvas,
            context: gl
      });
      renderer.autoClear = false;

      const camera = new THREE.PerspectiveCamera();
      camera.matrixAutoUpdate = false;

      const session = await navigator.xr.requestSession("immersive-ar");
      session.updateRenderState({
            baseLayer: new XRWebGLLayer(session, gl)
      });

      const referenceSpace = await session.requestReferenceSpace('local');

      const onXRFrame = (time, frame) => {
            session.requestAnimationFrame(onXRFrame);

            gl.bindFramebuffer(gl.FRAMEBUFFER, session.renderState.baseLayer.framebuffer)

            const pose = frame.getViewerPose(referenceSpace);
            if (pose) {
                  const view = pose.views[0];

                  const viewport = session.renderState.baseLayer.getViewport(view);
                  renderer.setSize(viewport.width, viewport.height)

                  camera.matrix.fromArray(view.transform.matrix)
                  camera.projectionMatrix.fromArray(view.projectionMatrix);
                  camera.updateMatrixWorld(true);

                  renderer.render(scene, camera)
            }
      }
      session.requestAnimationFrame(onXRFrame);
}


