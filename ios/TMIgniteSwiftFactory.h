#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

#import "TMIgniteAccountsSDK.h"
#import "TMIgniteRetailSDK.h"
#import "TMIgniteSecureEntryView.h"
#import "TMIgniteTicketsEmbeddedView.h"
#import "TMIgniteTicketsSDKModal.h"

NS_ASSUME_NONNULL_BEGIN

/// The single hand-off point from the Objective-C++ React layer to the Swift SDK layer.
///
/// Objective-C++ cannot import a Swift Package Manager target (there is no `-Swift.h` on its
/// search path and `@import` is unavailable in C++ mode), so the TurboModules and Fabric views
/// never name a Swift class. They ask this factory, implemented in plain Objective-C
/// (`TMIgniteSwiftFactory.m`), for objects typed by the `ios/Interface` protocols.
///
/// Keep this the only file that imports the Swift module.
@interface TMIgniteSwiftFactory : NSObject

+ (id<TMIgniteAccountsSDK>)makeAccountsSDK;
+ (id<TMIgniteRetailSDK>)makeRetailSDK;
+ (id<TMIgniteTicketsSDKModal>)makeTicketsSDKModal;
+ (UIView<TMIgniteTicketsEmbeddedView> *)makeTicketsEmbeddedView;
+ (UIView<TMIgniteSecureEntryView> *)makeSecureEntryView;

@end

NS_ASSUME_NONNULL_END
