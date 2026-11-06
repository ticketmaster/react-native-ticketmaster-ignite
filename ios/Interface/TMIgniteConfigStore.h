#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

/// Process-wide key/value store for the configuration JavaScript pushes through the
/// `NativeConfig` TurboModule.
///
/// Written by the Objective-C++ React layer (`RCTNativeConfig`) and read by the Swift SDK
/// layer (`Config.swift`). It lives in `ios/Interface/` because both sides depend on it and
/// it must stay free of React and Ticketmaster SDK dependencies so it can be a leaf target
/// under Swift Package Manager.
@interface TMIgniteConfigStore : NSObject

@property (class, nonatomic, readonly) TMIgniteConfigStore *shared;

- (void)setConfig:(NSString *)key value:(nullable NSString *)value;
- (void)setImage:(NSString *)key uri:(nullable NSString *)uri;
- (nullable NSString *)getConfig:(NSString *)key;
- (nullable UIImage *)getImage:(NSString *)key;

/// Clears every stored value. Called when a fresh `NativeConfig` module instance is created
/// (i.e. a new JavaScript runtime), which re-pushes its configuration on mount.
- (void)removeAll;

@end

NS_ASSUME_NONNULL_END
