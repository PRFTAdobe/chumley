import { Page, withModel } from '@adobe/aem-react-editable-components';
import { PageProperties } from '@adobe/aem-react-editable-components/dist/components/Page';
import { ContainerState } from '@adobe/aem-react-editable-components/dist/components/Container';

class App extends Page<PageProperties, ContainerState> {
  render() {
    return (
      <div>
        {this.childComponents}
        {this.childPages}
      </div>
    );
  }
}

// eslint-disable-next-line react-refresh/only-export-components
export default withModel(App);
