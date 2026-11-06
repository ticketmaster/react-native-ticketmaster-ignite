#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

/// The native view behind the `TicketsSdkEmbeddedView` Fabric component.
/// Adopted by the Swift `TicketsSDKEmbeddedView` (a `UIView`); created through `TMIgniteSwiftFactory`.
@protocol TMIgniteTicketsEmbeddedView <NSObject>

- (void)setDeepLinkId:(nullable NSString *)deepLinkId NS_SWIFT_NAME(setDeepLinkId(_:));

@end

NS_ASSUME_NONNULL_END
