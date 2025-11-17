export type FeatureLayoutOptions = {
  index: number;
  alternate?: boolean;
};

export type FeatureLayoutClasses = {
  text: string[];
  media: string[];
  isEven: boolean;
};

/**
 * Computes responsive layout classes for feature cards with an optional alternating layout.
 */
export const computeFeatureLayout = ({ index, alternate = false }: FeatureLayoutOptions): FeatureLayoutClasses => {
  const isEven = index % 2 === 0;
  const textBase = [
    'flex flex-col justify-center gap-6 px-8 py-12',
    'lg:col-span-5',
    'lg:px-12',
    'lg:row-start-1',
  ];
  const mediaBase = [
    'relative px-8 pb-10',
    'lg:col-span-5',
    'lg:px-10 lg:py-12',
    'lg:row-start-1',
  ];

  const mediaLeftLayout = {
    isEven,
    text: [...textBase, 'lg:col-start-6', 'lg:pl-10', 'lg:order-2'],
    media: [...mediaBase, 'lg:col-start-1', 'lg:order-1'],
  };

  if (!alternate) {
    return mediaLeftLayout;
  }

  if (isEven) {
    return mediaLeftLayout;
  }

  return {
    isEven,
    text: [...textBase, 'lg:col-start-1', 'lg:pr-10', 'lg:order-1'],
    media: [...mediaBase, 'lg:col-start-6', 'lg:order-2'],
  };
};
