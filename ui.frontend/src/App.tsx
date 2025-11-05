import { Page, withModel } from '@adobe/aem-react-editable-components';
import { ContainerState } from '@adobe/aem-react-editable-components/dist/components/Container';
import { PageProperties } from '@adobe/aem-react-editable-components/dist/components/Page';

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

export default withModel(App);
