import React from 'react';
import { ButtonProps, CoreButton } from 'aem-react-core-wcm-components-base';
import './ChumleyButton.css';

type ChumleyButtonProps = ButtonProps;

const ChumleyButton = (props: ChumleyButtonProps): React.JSX.Element => (
  <CoreButton {...props} baseCssClass="chumley-button" />
);

export default ChumleyButton;
