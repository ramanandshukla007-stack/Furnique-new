import React from 'react'

export default function FabricVisualizer({
  baseSrc,
  maskSrc,
  fabricSrc,
  alt = 'preview'
}: {
  baseSrc: string
  maskSrc: string
  fabricSrc: string
  alt?: string
}) {
  // We use CSS layering: base image, overlay fabric clipped by mask using mask-image.
  return (
    <div className="relative w-full max-w-xl">
      <img src={baseSrc} alt={alt} className="w-full h-auto block" />
      <div
        aria-hidden
        className="absolute inset-0 mix-blend-multiply"
        style={{
          WebkitMaskImage: `url(${maskSrc})`,
          maskImage: `url(${maskSrc})`,
          backgroundImage: `url(${fabricSrc})`,
          backgroundSize: 'cover'
        }}
      />
    </div>
  )
}
