import { createElement } from 'react';
import { Container } from '@adobe/aem-react-editable-components';
import {
  ContainerProperties,
  ContainerState,
} from '@adobe/aem-react-editable-components/dist/components/Container';
import './CoreExperienceFragment.css';

interface CoreExperienceFragmentProps extends ContainerProperties {
  cssClassNames: string;
  id: string;
  styleSystemElement: string;
}

class CoreExperienceFragment extends Container<
  CoreExperienceFragmentProps,
  ContainerState
> {
  public render() {
    return (
      <>
        {createElement(
          this.props.styleSystemElement ?? 'div',
          {
            className: this.props.cssClassNames,
            id: this.props.id,
          },
          this.childComponents,
        )}
      </>
    );
  }
}

export default CoreExperienceFragment;
