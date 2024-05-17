/* eslint-disable react/destructuring-assignment */
import React from 'react';
import classNames from 'classnames';
import lightOrDark from '@/utils/lightOrDark';
import {
  ContainerV1,
  ContainerV1Properties,
} from '@adobe/aem-core-components-react-spa';
import './ChumleyContainer.css';

interface ChumleyContainerProps extends Omit<ContainerV1Properties, 'layout'> {
  addGapBetweenComponents?: boolean;
  backgroundColor?: string;
  blockPadding?: string;
  id: string;
  layout?: 'RESPONSIVE_GRID' | 'SIMPLE';
}

const ChumleyContainer = (
  props: ChumleyContainerProps,
): React.JSX.Element | null => {
  const calculateBackgroundStyle = () => {
    const backgroundStyle = [];
    if (props.backgroundColor) {
      backgroundStyle.push(
        `--container-background-color: ${props.backgroundColor}`,
      );
      if (props.backgroundColor === '#1abc9c') {
        backgroundStyle.push('--container-border-color: #16a085');
      }
    }
    if (props.blockPadding) {
      backgroundStyle.push(
        `--container-block-padding: var(--chumley-size-${props.blockPadding})`,
      );
    }
    return backgroundStyle.join('; ');
  };
  const containerProps = {
    aemNoDecoration: props.addGapBetweenComponents !== true,
    backgroundStyle: calculateBackgroundStyle(),
    baseCssClass: classNames(
      'chumley-container',
      {
        'chumley-container--with-gap': props.addGapBetweenComponents === true,
      },
      {
        [`chumley-scrim-${lightOrDark(props.backgroundColor!)}`]:
          props.backgroundColor,
      },
    ),
    id: props.id,
  };
  let layoutProperty: 'responsiveGrid' | 'simple' | undefined;
  if (props.layout === 'RESPONSIVE_GRID') {
    layoutProperty = 'responsiveGrid';
  } else if (props.layout === 'SIMPLE') {
    layoutProperty = 'simple';
  }
  return (
    <ContainerV1 {...{ ...props, ...containerProps }} layout={layoutProperty} />
  );
};

export default ChumleyContainer;
