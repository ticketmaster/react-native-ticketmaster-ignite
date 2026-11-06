#import "TMIgniteSwiftFactory.h"

// This is the only file that imports the Swift layer. Under Swift Package Manager the Swift
// sources are a separate target (`RNTicketmasterIgniteSwift`), which plain Objective-C can
// `@import`. Under CocoaPods they are part of this pod, exposed through the generated header.
#if RN_TICKETMASTER_IGNITE_SWIFTPM
@import RNTicketmasterIgniteSwift;
#elif __has_include(<react_native_ticketmaster_ignite/react_native_ticketmaster_ignite-Swift.h>)
#import <react_native_ticketmaster_ignite/react_native_ticketmaster_ignite-Swift.h>
#else
#import "react_native_ticketmaster_ignite-Swift.h"
#endif

@implementation TMIgniteSwiftFactory

+ (id<TMIgniteAccountsSDK>)makeAccountsSDK
{
  return [AccountsSDK new];
}

+ (id<TMIgniteRetailSDK>)makeRetailSDK
{
  return [RetailSDK new];
}

+ (id<TMIgniteTicketsSDKModal>)makeTicketsSDKModal
{
  return [TicketsSDKModal new];
}

+ (UIView<TMIgniteTicketsEmbeddedView> *)makeTicketsEmbeddedView
{
  return [[TicketsSDKEmbeddedView alloc] init];
}

+ (UIView<TMIgniteSecureEntryView> *)makeSecureEntryView
{
  return [[SecureEntryWrapperView alloc] init];
}

@end
