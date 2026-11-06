#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

/// Promise callbacks with the same shape as React Native's `RCTPromiseResolveBlock` and
/// `RCTPromiseRejectBlock`, declared here so the Swift layer can accept them without importing
/// React. The TurboModules pass their React Native blocks straight through.
typedef void (^TMIgnitePromiseResolveBlock)(id _Nullable result);
typedef void (^TMIgnitePromiseRejectBlock)(NSString *_Nullable code,
                                           NSString *_Nullable message,
                                           NSError *_Nullable error);

/// Accounts SDK operations used by the `NativeAccountsSdk` TurboModule.
///
/// Implemented in Swift by `AccountsSDK`; the Objective-C++ layer obtains an instance through
/// `TMIgniteSwiftFactory` and only ever talks to this protocol, so it never needs the generated
/// Swift header.
@protocol TMIgniteAccountsSDK <NSObject>

- (void)configureAccountsSDKWithResolve:(TMIgnitePromiseResolveBlock)resolve
    reject:(TMIgnitePromiseRejectBlock)reject NS_SWIFT_NAME(configureAccountsSDK(resolve:reject:));
- (void)loginWithResolve:(TMIgnitePromiseResolveBlock)resolve
    reject:(TMIgnitePromiseRejectBlock)reject NS_SWIFT_NAME(login(resolve:reject:));
- (void)logoutWithResolve:(TMIgnitePromiseResolveBlock)resolve
    reject:(TMIgnitePromiseRejectBlock)reject NS_SWIFT_NAME(logout(resolve:reject:));
- (void)logoutAllWithResolve:(TMIgnitePromiseResolveBlock)resolve
    reject:(TMIgnitePromiseRejectBlock)reject NS_SWIFT_NAME(logoutAll(resolve:reject:));
- (void)isLoggedInWithResolve:(TMIgnitePromiseResolveBlock)resolve
    reject:(TMIgnitePromiseRejectBlock)reject NS_SWIFT_NAME(isLoggedIn(resolve:reject:));
- (void)getMemberInfoWithResolve:(TMIgnitePromiseResolveBlock)resolve
    reject:(TMIgnitePromiseRejectBlock)reject NS_SWIFT_NAME(getMemberInfo(resolve:reject:));
- (void)getTokenWithResolve:(TMIgnitePromiseResolveBlock)resolve
    reject:(TMIgnitePromiseRejectBlock)reject NS_SWIFT_NAME(getToken(resolve:reject:));
- (void)refreshTokenWithResolve:(TMIgnitePromiseResolveBlock)resolve
    reject:(TMIgnitePromiseRejectBlock)reject NS_SWIFT_NAME(refreshToken(resolve:reject:));
- (void)getSportXRDataWithResolve:(TMIgnitePromiseResolveBlock)resolve
    reject:(TMIgnitePromiseRejectBlock)reject NS_SWIFT_NAME(getSportXRData(resolve:reject:));

@end

NS_ASSUME_NONNULL_END
