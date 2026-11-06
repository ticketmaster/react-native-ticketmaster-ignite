#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

/// Modal Tickets SDK presentation used by the `NativeTicketsSdkModal` TurboModule.
/// Implemented in Swift by `TicketsSDKModal`; obtained through `TMIgniteSwiftFactory`.
@protocol TMIgniteTicketsSDKModal <NSObject>

- (void)showTicketsSdkModal:(nullable NSString *)deepLinkId NS_SWIFT_NAME(showTicketsSdkModal(_:));

@end

NS_ASSUME_NONNULL_END
