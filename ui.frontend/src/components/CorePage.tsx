import { Page } from '@adobe/aem-react-editable-components';
import { ContainerState } from '@adobe/aem-react-editable-components/dist/components/Container';
import { PageProperties } from '@adobe/aem-react-editable-components/dist/components/Page';
import classNames from 'classnames';

export interface CorePageProps extends PageProperties {
  cssClassNames: string;
  title?: string;
}

class CorePage extends Page<CorePageProps, ContainerState> {
  constructor(props: CorePageProps) {
    super(props);
    if (this.props.title) {
      document.title = this.props.title;
    }
  }

  get containerProps() {
    const attrs = super.containerProps;
    attrs.className = classNames(
      `${attrs.className || ''}`,
      `${this.props.cssClassNames || ''}`,
    );
    return attrs;
  }

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  componentDidUpdate(prevProps: CorePageProps) {
    const { title } = this.props;
    const { title: prevTitle } = prevProps;
    if (typeof title !== 'undefined' && title !== prevTitle) {
      document.title = title;
      window.scrollTo(0, 0);
    }
  }
}

export default CorePage;
