import { createImageUrlBuilder, type SanityImageSource } from '@sanity/image-url';

export type SanityImage = {
  asset?: { _ref?: string };
  alt?: string;
  crop?: { top?: number; bottom?: number; left?: number; right?: number };
  hotspot?: { x?: number; y?: number; width?: number; height?: number };
};

export function createSanityImageBuilder(projectId: string, dataset: string) {
  const builder = createImageUrlBuilder({ projectId, dataset });

  return {
    url(
      image: SanityImage | undefined,
      options: { width?: number; height?: number; fit?: 'crop' | 'max' | 'min' | 'clip' | 'fill' } = {},
    ): string {
      if (!image?.asset?._ref) return '';
      const { width = 1800, height, fit = 'crop' } = options;
      let chain = builder.image(image as SanityImageSource).auto('format');
      if (width) chain = chain.width(width);
      if (height) chain = chain.height(height).fit(fit);
      return chain.url();
    },
  };
}
