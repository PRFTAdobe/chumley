import { CoreTitle, TitleProps } from 'aem-react-core-wcm-components-base';
import React from 'react';
import './ChumleyTitle.css';

type ChumleyTitleProps = TitleProps;

const ChumleyTitle = (props: ChumleyTitleProps): React.JSX.Element => (
  <CoreTitle {...props} baseCssClass="chumley-title" />
);

export default ChumleyTitle;
