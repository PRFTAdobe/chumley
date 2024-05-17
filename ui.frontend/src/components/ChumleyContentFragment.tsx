/* eslint-disable react/no-danger,react/jsx-sort-props */
import React from 'react';
import './ChumleyContentFragment.css';

interface ContentFragmentElement {
  ':type': string;
  dataType: string;
  multiValue: boolean;
  title: string;
  value: string;
}

interface ContentFragmentProps {
  baseCssClass?: string;
  elements: Record<string, ContentFragmentElement>;
  elementsOrder: string[];
  id?: string;
}

const ChumleyContentFragment = ({
  elements,
  elementsOrder,
  id,
  baseCssClass = 'chumley-content-fragment',
}: ContentFragmentProps): React.JSX.Element | null => (
  <div className={baseCssClass} id={id}>
    {elementsOrder.map(
      (element) =>
        ({
          copy: (
            <div
              className={`${baseCssClass}__copy`}
              dangerouslySetInnerHTML={{ __html: elements.copy.value }}
              key={element}
            />
          ),
          heading: (
            <h1 className={`${baseCssClass}__heading`} key={element}>
              {elements.heading.value}
            </h1>
          ),
          image: (
            <div className={`${baseCssClass}__image`} key={element}>
              <img alt="Chumley" src={elements.image.value} />
            </div>
          ),
          quote: (
            <div
              className={`${baseCssClass}__quote`}
              dangerouslySetInnerHTML={{ __html: elements.quote.value }}
              key={element}
            />
          ),
        })[element],
    )}
  </div>
);

export default ChumleyContentFragment;
