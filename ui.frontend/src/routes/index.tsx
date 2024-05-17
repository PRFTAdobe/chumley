import React from 'react';
import { Model } from '@adobe/aem-spa-page-model-manager';
import { ComponentMapping, Utils } from '@adobe/aem-react-editable-components';
import '@/import-components';

interface Route {
  element?: React.ReactElement;
  path?: string;
}

const createPageRoutes = (
  cqChildren: Record<string, Model>,
  componentMapping: typeof ComponentMapping,
) => {
  const routes: Route[] = [];
  if (cqChildren) {
    Object.keys(cqChildren).forEach((cqChild) => {
      const childProps = Utils.modelToProps(cqChildren[cqChild]) as Record<
        string,
        unknown
      >;

      const PageComponent: React.ElementType = componentMapping.get(
        childProps.cqType as string,
      );
      if (PageComponent) {
        routes.push({
          element: <PageComponent {...childProps} />,
          path: `${cqChild}.html`,
        });
      }
    });
  }
  return routes;
};

export default createPageRoutes;
