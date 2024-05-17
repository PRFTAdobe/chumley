package com.chumley.core.models.impl;

import com.adobe.cq.export.json.ComponentExporter;
import com.adobe.cq.export.json.ExporterConstants;
import com.adobe.cq.wcm.core.components.models.Embed;
import com.adobe.cq.wcm.core.components.models.embeddable.YouTube;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import lombok.Getter;
import lombok.experimental.Delegate;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Exporter;
import org.apache.sling.models.annotations.ExporterOption;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.Via;
import org.apache.sling.models.annotations.injectorspecific.Self;
import org.apache.sling.models.annotations.injectorspecific.SlingObject;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;
import org.apache.sling.models.annotations.via.ResourceSuperType;
import org.jetbrains.annotations.NotNull;

import javax.annotation.PostConstruct;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

@Model(adaptables = {SlingHttpServletRequest.class}, adapters = {YouTube.class, Embed.class,
  ComponentExporter.class}, resourceType = EmbedImpl.RESOURCE_TYPE, defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
@Exporter(name = ExporterConstants.SLING_MODEL_EXPORTER_NAME, extensions = ExporterConstants.SLING_MODEL_EXTENSION, options = {
  @ExporterOption(name = "MapperFeature.SORT_PROPERTIES_ALPHABETICALLY", value = "true"),
  @ExporterOption(name = "SerializationFeature.WRITE_DATES_AS_TIMESTAMPS", value = "false")})
@JsonSerialize(as = EmbedImpl.class)
public class EmbedImpl implements YouTube, ComponentExporter, Embed {
  static final String RESOURCE_TYPE = "chumley/components/embed";
  @Getter
  private final Map<String, Object> youTubeProps = new HashMap<>();
  @SlingObject
  protected Resource resource;
  @Self
  @Via(type = ResourceSuperType.class)
  @Delegate(excludes = DelegationExclusion.class)
  private Embed delegate;
  @ValueMapValue(name = PN_ASPECT_RATIO)
  private String iFrameAspectRatio;
  @ValueMapValue(name = PN_HEIGHT)
  private String iFrameHeight;
  @ValueMapValue(name = PN_WIDTH)
  private String iFrameWidth;
  @ValueMapValue(name = PN_AUTOPLAY)
  private Boolean isAutoPlay;
  @ValueMapValue(name = PN_LOOP)
  private Boolean isLoop;
  @ValueMapValue(name = PN_MUTE)
  private Boolean isMute;
  @ValueMapValue(name = PN_PLAYS_INLINE)
  private Boolean isPlaysInline;
  @ValueMapValue(name = PN_REL)
  private Boolean isRel;
  @ValueMapValue(name = PN_LAYOUT)
  private String layout;
  @ValueMapValue(name = PN_VIDEO_ID)
  private String videoId;

  @JsonIgnore
  @Override
  public String getEmbeddableResourceType() {
    return delegate.getEmbeddableResourceType();
  }

  @Override
  public @NotNull String getExportedType() {
    return RESOURCE_TYPE;
  }

  @PostConstruct
  public void activate() {
    if (null != videoId && !videoId.isEmpty() && Objects.requireNonNull(getType()).toString().equals("EMBEDDABLE")) {
      youTubeProps.put(PN_ASPECT_RATIO, iFrameAspectRatio);
      youTubeProps.put(PN_HEIGHT, iFrameHeight);
      youTubeProps.put(PN_WIDTH, iFrameWidth);
      youTubeProps.put(PN_AUTOPLAY, isAutoPlay);
      youTubeProps.put(PN_LOOP, isLoop);
      youTubeProps.put(PN_MUTE, isMute);
      youTubeProps.put(PN_PLAYS_INLINE, isPlaysInline);
      youTubeProps.put(PN_REL, isRel);
      youTubeProps.put(PN_LAYOUT, layout);
      youTubeProps.put(PN_VIDEO_ID, videoId);
    }
  }

  private interface DelegationExclusion {

    String getExportedType();

    String getEmbeddableResourceType();
  }
}
