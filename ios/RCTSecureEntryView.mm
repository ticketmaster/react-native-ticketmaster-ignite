#import "RCTSecureEntryView.h"
#import <React/RCTBridgeModule.h>
#import <React/RCTUtils.h>
#import <react/renderer/components/TicketmasterIgniteSpecs/ComponentDescriptors.h>
#import <react/renderer/components/TicketmasterIgniteSpecs/EventEmitters.h>
#import <react/renderer/components/TicketmasterIgniteSpecs/Props.h>
#import <react/renderer/components/TicketmasterIgniteSpecs/RCTComponentViewHelpers.h>
#import "TMIgniteSwiftFactory.h"

#import <React/RCTFabricComponentsPlugins.h>

using namespace facebook::react;

@interface RCTSecureEntryView () <RCTSecureEntryViewViewProtocol>
@end

@implementation RCTSecureEntryView {
  UIView<TMIgniteSecureEntryView> *_view;
}

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
  return concreteComponentDescriptorProvider<SecureEntryViewComponentDescriptor>();
}

- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    static const auto defaultProps = std::make_shared<const SecureEntryViewProps>();
    _props = defaultProps;

    _view = [TMIgniteSwiftFactory makeSecureEntryView];
    self.contentView = _view;
  }

  return self;
}

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
  const auto &oldViewProps = *std::static_pointer_cast<SecureEntryViewProps const>(_props);
  const auto &newViewProps = *std::static_pointer_cast<SecureEntryViewProps const>(props);

  if (oldViewProps.token != newViewProps.token) {
    NSString *tokenValue = [NSString stringWithUTF8String:newViewProps.token.c_str()];
    [_view setToken:tokenValue];
  }

  // offsetTop is Android-only, no-op on iOS
  // Property is handled by codegen but not used in iOS implementation

  [super updateProps:props oldProps:oldProps];
}

Class<RCTComponentViewProtocol> SecureEntryViewCls(void)
{
  return RCTSecureEntryView.class;
}

@end
