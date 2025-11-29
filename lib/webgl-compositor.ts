/**
 * WebGL Compositor for fabric visualization
 * Handles real-time blending of fabric textures onto furniture using Three.js
 */

import type { WebGLRenderParams } from '@/lib/types/visualizer'

export interface CompositorConfig {
  canvas: HTMLCanvasElement
  width: number
  height: number
}

export class WebGLCompositor {
  private canvas: HTMLCanvasElement
  private gl: WebGLRenderingContext | WebGL2RenderingContext | null = null
  private width: number
  private height: number
  private program: WebGLProgram | null = null
  private textures: Map<string, WebGLTexture> = new Map()
  private vertexBuffer: WebGLBuffer | null = null
  private texCoordBuffer: WebGLBuffer | null = null

  constructor(config: CompositorConfig) {
    this.canvas = config.canvas
    this.width = config.width
    this.height = config.height
    this.initWebGL()
  }

  private initWebGL() {
    try {
      this.gl = this.canvas.getContext('webgl2') || this.canvas.getContext('webgl')
      if (!this.gl) {
        console.error('WebGL not supported')
        return
      }

      // Set canvas size
      this.canvas.width = this.width
      this.canvas.height = this.height
      this.gl.viewport(0, 0, this.width, this.height)

      // Create shader program
      this.createShaderProgram()
      this.setupBuffers()
    } catch (error) {
      console.error('WebGL initialization error:', error)
    }
  }

  private createShaderProgram() {
    if (!this.gl) return

    const vertexShaderSource = `
      attribute vec2 position;
      attribute vec2 texCoord;
      varying vec2 vTexCoord;

      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
        vTexCoord = texCoord;
      }
    `

    const fragmentShaderSource = `
      precision mediump float;
      
      uniform sampler2D uOriginalImage;
      uniform sampler2D uMaskImage;
      uniform sampler2D uFabricTexture;
      uniform sampler2D uNormalMap;
      uniform sampler2D uRoughnessMap;
      uniform float uTileScale;
      uniform float uRotation;
      uniform vec3 uLightDirection;

      varying vec2 vTexCoord;

      // Rotation matrix
      mat2 rotate(float angle) {
        float c = cos(angle);
        float s = sin(angle);
        return mat2(c, -s, s, c);
      }

      void main() {
        // Sample original image
        vec4 originalColor = texture2D(uOriginalImage, vTexCoord);
        
        // Sample mask (1.0 = fabric, 0.0 = background)
        float maskAlpha = texture2D(uMaskImage, vTexCoord).r;
        
        if (maskAlpha < 0.01) {
          // Background: use original image
          gl_FragColor = originalColor;
        } else {
          // Fabric area: apply texture with PBR shading
          vec2 fabricTexCoord = vTexCoord * uTileScale;
          fabricTexCoord = rotate(uRotation) * (fabricTexCoord - 0.5) + 0.5;
          
          vec4 fabricColor = texture2D(uFabricTexture, fabricTexCoord);
          vec3 normalMap = texture2D(uNormalMap, fabricTexCoord).rgb * 2.0 - 1.0;
          float roughness = texture2D(uRoughnessMap, fabricTexCoord).r;
          
          // Simple PBR-like shading: adjust brightness based on normal and roughness
          float diffuse = max(dot(normalMap, uLightDirection), 0.3);
          float specular = pow(diffuse, 1.0 / (roughness + 0.1)) * (1.0 - roughness);
          
          vec3 finalColor = fabricColor.rgb * diffuse + vec3(specular);
          
          // Blend fabric with original using mask alpha (feathering)
          gl_FragColor = vec4(
            mix(originalColor.rgb, finalColor, maskAlpha),
            1.0
          );
        }
      }
    `

    const vertexShader = this.compileShader(
      vertexShaderSource,
      this.gl.VERTEX_SHADER
    )
    const fragmentShader = this.compileShader(
      fragmentShaderSource,
      this.gl.FRAGMENT_SHADER
    )

    if (!vertexShader || !fragmentShader) return

    const program = this.gl.createProgram()
    if (!program) return

    this.gl.attachShader(program, vertexShader)
    this.gl.attachShader(program, fragmentShader)
    this.gl.linkProgram(program)

    if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
      console.error('Shader program error:', this.gl.getProgramInfoLog(program))
      return
    }

    this.program = program
  }

  private compileShader(
    source: string,
    type: number
  ): WebGLShader | null {
    if (!this.gl) return null

    const shader = this.gl.createShader(type)
    if (!shader) return null

    this.gl.shaderSource(shader, source)
    this.gl.compileShader(shader)

    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      console.error('Shader compile error:', this.gl.getShaderInfoLog(shader))
      this.gl.deleteShader(shader)
      return null
    }

    return shader
  }

  private setupBuffers() {
    if (!this.gl) return

    // Full-screen quad vertices
    const vertices = new Float32Array([
      -1, -1, 1, -1, -1, 1, 1, 1, // positions
    ])

    const texCoords = new Float32Array([
      0, 1, 1, 1, 0, 0, 1, 0, // texture coordinates
    ])

    this.vertexBuffer = this.gl.createBuffer()
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer)
    this.gl.bufferData(this.gl.ARRAY_BUFFER, vertices, this.gl.STATIC_DRAW)

    this.texCoordBuffer = this.gl.createBuffer()
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.texCoordBuffer)
    this.gl.bufferData(this.gl.ARRAY_BUFFER, texCoords, this.gl.STATIC_DRAW)
  }

  async loadTexture(url: string, name: string): Promise<boolean> {
    return new Promise((resolve) => {
      const image = new Image()
      image.crossOrigin = 'anonymous'

      image.onload = () => {
        if (!this.gl) {
          resolve(false)
          return
        }

        const texture = this.gl.createTexture()
        if (!texture) {
          resolve(false)
          return
        }

        this.gl.bindTexture(this.gl.TEXTURE_2D, texture)
        this.gl.texImage2D(
          this.gl.TEXTURE_2D,
          0,
          this.gl.RGBA,
          this.gl.RGBA,
          this.gl.UNSIGNED_BYTE,
          image
        )

        // Texture parameters
        this.gl.texParameteri(
          this.gl.TEXTURE_2D,
          this.gl.TEXTURE_WRAP_S,
          this.gl.REPEAT
        )
        this.gl.texParameteri(
          this.gl.TEXTURE_2D,
          this.gl.TEXTURE_WRAP_T,
          this.gl.REPEAT
        )
        this.gl.texParameteri(
          this.gl.TEXTURE_2D,
          this.gl.TEXTURE_MIN_FILTER,
          this.gl.LINEAR_MIPMAP_LINEAR
        )
        this.gl.texParameteri(
          this.gl.TEXTURE_2D,
          this.gl.TEXTURE_MAG_FILTER,
          this.gl.LINEAR
        )
        this.gl.generateMipmap(this.gl.TEXTURE_2D)

        this.textures.set(name, texture)
        resolve(true)
      }

      image.onerror = () => {
        console.error(`Failed to load texture: ${url}`)
        resolve(false)
      }

      image.src = url
    })
  }

  async render(params: WebGLRenderParams): Promise<void> {
    if (!this.gl || !this.program) return

    try {
      // Load textures
      await Promise.all([
        this.loadTexture(params.originalImageUrl, 'original'),
        this.loadTexture(params.maskUrl, 'mask'),
        this.loadTexture(params.fabricTextureUrl, 'fabric'),
        params.normalMapUrl ? this.loadTexture(params.normalMapUrl, 'normal') : Promise.resolve(true),
        params.roughnessMapUrl ? this.loadTexture(params.roughnessMapUrl, 'roughness') : Promise.resolve(true),
      ])

      this.gl.useProgram(this.program)

      // Set uniforms
      const tileScaleLoc = this.gl.getUniformLocation(this.program, 'uTileScale')
      this.gl.uniform1f(tileScaleLoc, params.tileScale)

      const rotationLoc = this.gl.getUniformLocation(this.program, 'uRotation')
      this.gl.uniform1f(rotationLoc, (params.rotation * Math.PI) / 180)

      const lightDirLoc = this.gl.getUniformLocation(this.program, 'uLightDirection')
      this.gl.uniform3f(lightDirLoc, 0.5, 0.8, 0.5)

      // Bind textures to samplers
      this.bindTextureToSampler('original', 0, 'uOriginalImage')
      this.bindTextureToSampler('mask', 1, 'uMaskImage')
      this.bindTextureToSampler('fabric', 2, 'uFabricTexture')
      this.bindTextureToSampler('normal', 3, 'uNormalMap')
      this.bindTextureToSampler('roughness', 4, 'uRoughnessMap')

      // Setup vertex attributes
      const positionLoc = this.gl.getAttribLocation(this.program, 'position')
      const texCoordLoc = this.gl.getAttribLocation(this.program, 'texCoord')

      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer)
      this.gl.enableVertexAttribArray(positionLoc)
      this.gl.vertexAttribPointer(positionLoc, 2, this.gl.FLOAT, false, 0, 0)

      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.texCoordBuffer)
      this.gl.enableVertexAttribArray(texCoordLoc)
      this.gl.vertexAttribPointer(texCoordLoc, 2, this.gl.FLOAT, false, 0, 0)

      // Render
      this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4)
    } catch (error) {
      console.error('Rendering error:', error)
    }
  }

  private bindTextureToSampler(
    textureName: string,
    unit: number,
    uniformName: string
  ) {
    if (!this.gl || !this.program) return

    const texture = this.textures.get(textureName)
    if (!texture) return

    this.gl.activeTexture(this.gl.TEXTURE0 + unit)
    this.gl.bindTexture(this.gl.TEXTURE_2D, texture)

    const samplerLoc = this.gl.getUniformLocation(this.program, uniformName)
    this.gl.uniform1i(samplerLoc, unit)
  }

  // Utility: Export canvas as image
  async exportImage(format: 'jpg' | 'png' = 'jpg'): Promise<Blob | null> {
    return new Promise((resolve) => {
      this.canvas.toBlob(
        (blob) => resolve(blob),
        format === 'jpg' ? 'image/jpeg' : 'image/png',
        format === 'jpg' ? 0.95 : undefined
      )
    })
  }

  // Utility: Get canvas as data URL
  getDataURL(format: 'jpg' | 'png' = 'jpg'): string {
    return this.canvas.toDataURL(
      format === 'jpg' ? 'image/jpeg' : 'image/png',
      format === 'jpg' ? 0.95 : undefined
    )
  }

  dispose() {
    if (this.gl) {
      this.textures.forEach((texture) => {
        this.gl?.deleteTexture(texture)
      })
      if (this.program) {
        this.gl.deleteProgram(this.program)
      }
      if (this.vertexBuffer) {
        this.gl.deleteBuffer(this.vertexBuffer)
      }
      if (this.texCoordBuffer) {
        this.gl.deleteBuffer(this.texCoordBuffer)
      }
    }
    this.textures.clear()
  }
}
