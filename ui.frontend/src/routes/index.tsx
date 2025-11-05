import {
  ComponentMapping,
  Utils,
  withComponentMappingContext,
} from '@adobe/aem-react-editable-components';
import { Model } from '@adobe/aem-spa-page-model-manager';
import '@/import-components';
import { useQuery } from '@tanstack/react-query';
import { RouteObject } from 'react-router-dom';
import CorePage, { CorePageProps } from '@/components/CorePage';

const createPageRoutes = (
  cqChildren: Record<string, Model>,
  componentMapping: typeof ComponentMapping,
) => {
  const routes: RouteObject[] = [];
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
const createDynamicPageRoutes = (
  cqChildren: Record<string, Model>,
  loader: (key: string) => Promise<Model>,
) => {
  const routes: RouteObject[] = [];
  if (cqChildren) {
    Object.keys(cqChildren).forEach((cqChild) => {
      const childProps = Utils.modelToProps(cqChildren[cqChild]) as Record<
        string,
        unknown
      >;

      const CorePageWithComponentMappingContext =
        withComponentMappingContext(CorePage);
      const PageComponent = ({ cqPath }: { cqPath: string }) => {
        const { data } = useQuery({ queryKey: [cqPath] }) as {
          data: CorePageProps;
        };
        return (
          <CorePageWithComponentMappingContext
            {...Utils.modelToProps(data as Model)}
          />
        );
      };

      routes.push({
        element: <PageComponent cqPath={childProps.cqPath as string} />,
        loader: () => loader(childProps.cqPath as string),
        path: childProps.route as string,
        shouldRevalidate: () => false,
      });
    });
  }
  return routes;
};

export { createDynamicPageRoutes, createPageRoutes };
