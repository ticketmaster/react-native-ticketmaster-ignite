#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

/// The native view behind the `SecureEntryView` Fabric component.
/// Adopted by the Swift `SecureEntryWrapperView` (a `UIView`); created through `TMIgniteSwiftFactory`.
@protocol TMIgniteSecureEntryView <NSObject>

- (void)setToken:(NSString *)token NS_SWIFT_NAME(setToken(_:));

@end

NS_ASSUME_NONNULL_END
