#import "RCTTicketsSdkEmbeddedView.h"
#import <React/RCTBridgeModule.h>
#import <React/RCTUtils.h>
#import <react/renderer/components/TicketmasterIgniteSpecs/ComponentDescriptors.h>
#import <react/renderer/components/TicketmasterIgniteSpecs/EventEmitters.h>
#import <react/renderer/components/TicketmasterIgniteSpecs/Props.h>
#import <react/renderer/components/TicketmasterIgniteSpecs/RCTComponentViewHelpers.h>

#if __has_include(<react_native_ticketmaster_ignite/react_native_ticketmaster_ignite-Swift.h>)
// For cocoapods framework, the generated swift header will be inside react_native_ticketmaster module
#import <react_native_ticketmaster_ignite/react_native_ticketmaster_ignite-Swift.h>
#else
// For static libraries
#import "react_native_ticketmaster_ignite-Swift.h"
#endif

#import "RCTFabricComponentsPlugins.h"

using namespace facebook::react;

@interface RCTTicketsSdkEmbeddedView () <RCTTicketsSdkEmbeddedViewViewProtocol>
@end

@implementation RCTTicketsSdkEmbeddedView {
  TicketsSdkEmbeddedView *_view;
}

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
  return concreteComponentDescriptorProvider<TicketsSdkEmbeddedViewComponentDescriptor>();
}

- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    static const auto defaultProps = std::make_shared<const TicketsSdkEmbeddedViewProps>();
    _props = defaultProps;

    _view = [[TicketsSdkEmbeddedView alloc] init];
    self.contentView = _view;
  }

  return self;
}

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
  const auto &oldViewProps = *std::static_pointer_cast<TicketsSdkEmbeddedViewProps const>(_props);
  const auto &newViewProps = *std::static_pointer_cast<TicketsSdkEmbeddedViewProps const>(props);

  // offsetTop is Android-only, no-op on iOS
  // Property is handled by codegen but not used in iOS implementation

  [super updateProps:props oldProps:oldProps];
}

Class<RCTComponentViewProtocol> TicketsSdkEmbeddedViewCls(void)
{
  return RCTTicketsSdkEmbeddedView.class;
}

@end
