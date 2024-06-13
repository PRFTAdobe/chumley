package com.chumley.core.models.impl;

import com.adobe.aem.spa.project.core.models.Page;
import com.adobe.cq.export.json.ComponentExporter;
import com.adobe.cq.export.json.ExporterConstants;
import com.adobe.cq.export.json.hierarchy.HierarchyNodeExporter;
import com.day.cq.search.PredicateGroup;
import com.day.cq.search.Query;
import com.day.cq.search.QueryBuilder;
import com.day.cq.search.eval.PathPredicateEvaluator;
import com.day.cq.search.eval.TypePredicateEvaluator;
import com.day.cq.search.result.Hit;
import com.day.cq.search.result.SearchResult;
import com.day.cq.wcm.api.PageManager;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import lombok.experimental.Delegate;
import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Exporter;
import org.apache.sling.models.annotations.ExporterOption;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.Via;
import org.apache.sling.models.annotations.injectorspecific.OSGiService;
import org.apache.sling.models.annotations.injectorspecific.ScriptVariable;
import org.apache.sling.models.annotations.injectorspecific.Self;
import org.apache.sling.models.annotations.injectorspecific.SlingObject;
import org.apache.sling.models.annotations.via.ResourceSuperType;
import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.annotation.PostConstruct;
import javax.jcr.Session;
import java.util.Collections;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import static com.chumley.core.models.impl.SpaPageImpl.RESOURCE_TYPE;

@Model(adaptables = {SlingHttpServletRequest.class}, adapters = {Page.class,
  ComponentExporter.class}, resourceType = RESOURCE_TYPE, defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
@Exporter(name = ExporterConstants.SLING_MODEL_EXPORTER_NAME, extensions = ExporterConstants.SLING_MODEL_EXTENSION, options = {
  @ExporterOption(name = "MapperFeature.SORT_PROPERTIES_ALPHABETICALLY", value = "true"),
  @ExporterOption(name = "SerializationFeature.WRITE_DATES_AS_TIMESTAMPS", value = "false")})
@JsonSerialize(as = SpaPageImpl.class)
public class SpaPageImpl implements Page {

  static final String RESOURCE_TYPE = "chumley/components/spa";
  private static final String CONTENT_ROOT_PATH = "/content";
  private static final String HTML_EXTENSION = ".html";
  private static final String LIMIT = "-1";
  private static final Logger LOG = LoggerFactory.getLogger(SpaPageImpl.class);
  private static final String PAGE_PATH = "pagePath";
  private static final String PARAM_LIMIT = "p.limit";
  private static final String PATH = ":path";
  private static final String ROUTE = "route";
  private static final String WCMMODE = "wcmmode";
  private Map<String, Map<String, Object>> children;
  @ScriptVariable
  private com.day.cq.wcm.api.Page currentPage;
  private String exportedType;
  private boolean isDynamic = true;
  @Self
  @Via(type = ResourceSuperType.class)
  @Delegate(excludes = DelegationExclusion.class)
  private Page page;
  @OSGiService
  private QueryBuilder queryBuilder;
  @SlingObject
  private ResourceResolver resourceResolver;
  @Self
  private SlingHttpServletRequest slingHttpServletRequest;

  @JsonProperty(":children")
  public Map<String, ?> getChildren() {
    if (isDynamic) {
      return children;
    } else {
      Map<String, ? extends HierarchyNodeExporter> exportedChildren = page.getExportedChildren();
      String pagePath = slingHttpServletRequest.getParameter(PAGE_PATH);
      if (null != pagePath && exportedChildren.containsKey(pagePath)) {
        Map<String, Page> exportedChild = new LinkedHashMap<>();
        exportedChild.put(pagePath, (Page) exportedChildren.get(pagePath));
        return exportedChild;
      } else {
        return exportedChildren;
      }
    }
  }

  @PostConstruct
  public void activate() {
    final String rootPath = currentPage.getPath();
    String wccmode = slingHttpServletRequest.getParameter(WCMMODE);
    if (null == wccmode || !wccmode.equals("disabled")) {
      isDynamic = false;
    }

    exportedType = RESOURCE_TYPE;
    children = getPages(rootPath);
  }

  private Map<String, Map<String, Object>> getPages(String rootPath) {
    Map<String, Map<String, Object>> childMap = new HashMap<>();
    final List<Hit> hits = getChildPages(rootPath);
    try {
      for (final Hit hit : hits) {
        final String childPath = hit.getPath();
        String route = getFormattedPagePath(childPath);

        final Map<String, Object> properties = new HashMap<>();
        properties.put(PATH, childPath);
        properties.put(ROUTE, route);

        if (StringUtils.isNotBlank(childPath)) {
          childMap.put(hit.getPath(), properties);
        }
      }
    } catch (Exception e) {
      if (LOG.isErrorEnabled()) {
        LOG.error("Exception in children retrievals : {}", e.getMessage());
      }
    }

    return childMap;
  }

  private List<Hit> getChildPages(final String rootPath) {
    Map<String, String> predicatemap = new HashMap<>();
    List<Hit> hits = null;

    predicatemap.put(PathPredicateEvaluator.PATH, rootPath);
    predicatemap.put(TypePredicateEvaluator.TYPE, "cq:Page");
    predicatemap.put(PARAM_LIMIT, LIMIT);
    final PredicateGroup predicateGroup = PredicateGroup.create(predicatemap);
    final Session session = resourceResolver.adaptTo(Session.class);
    final Query query = queryBuilder.createQuery(predicateGroup, session);
    final SearchResult searchResult = query.getResult();

    if (null != searchResult) {
      hits = searchResult.getHits();
    }
    return hits;
  }

  private String getFormattedPagePath(String pagePath) {
    final PageManager pageManager = resourceResolver.adaptTo(PageManager.class);
    if (StringUtils.isNotBlank(pagePath) &&
      pagePath.startsWith(CONTENT_ROOT_PATH) && pageManager != null) {
      final com.day.cq.wcm.api.Page page = pageManager.getPage(trimSuffix(pagePath));
      if (page != null) {
        String vanityURL = page.getVanityUrl();
        if (StringUtils.isEmpty(vanityURL)) {
          pagePath = addSuffix(resourceResolver.map(page.getPath()));
        } else {
          pagePath = vanityURL;
        }
      }
    }
    return pagePath;
  }

  private String trimSuffix(String pagePath) {
    if (pagePath.endsWith(HTML_EXTENSION)) {
      int endIdx = pagePath.length() - HTML_EXTENSION.length();
      pagePath = pagePath.substring(0, endIdx);
    }
    return pagePath;
  }

  private String addSuffix(String pagePath) {
    if (!pagePath.endsWith(HTML_EXTENSION)) {
      pagePath = pagePath + HTML_EXTENSION;
    }
    return pagePath;
  }

  @Override
  public @NotNull String getExportedType() {
    return exportedType;
  }

  @Override
  @JsonIgnore
  public Map<String, ? extends Page> getExportedChildren() {
    return Collections.emptyMap();
  }

  public interface DelegationExclusion {
    String getExportedType();

    Map<String, ? extends Page> getExportedChildren();
  }
}
