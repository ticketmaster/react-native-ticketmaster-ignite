#import "RCTNativeAccountsSdk.h"
#import <React/RCTUtils.h>
#import <React/RCTBridge+Private.h>
#import <React/RCTConvert.h>

#if __has_include(<react_native_ticketmaster_ignite/react_native_ticketmaster_ignite-Swift.h>)
// For cocoapods framework, the generated swift header will be inside react_native_ticketmaster module
#import <react_native_ticketmaster_ignite/react_native_ticketmaster_ignite-Swift.h>
#else
// For static libraries
#import "react_native_ticketmaster_ignite-Swift.h"
#endif

@implementation RCTNativeAccountsSdk {
  NativeAccountsSdk *_impl;
}

// It's been stated if using swift there is no need for this https://reactnative.dev/docs/the-new-architecture/turbo-modules-with-swift 
//RCT_EXPORT_MODULE(NativeAccountsSdk)

- (instancetype)init {
  if (self = [super init]) {
    _impl = [NativeAccountsSdk new];
  }
  return self;
}

- (void)configureAccountsSDK:(RCTPromiseResolveBlock)resolve
                       reject:(RCTPromiseRejectBlock)reject
{
  [_impl configureAccountsSDKWithResolve:resolve reject:reject];
}

- (void)login:(RCTPromiseResolveBlock)resolve
       reject:(RCTPromiseRejectBlock)reject
{
  [_impl loginWithResolve:resolve reject:reject];
}

- (void)logout:(RCTPromiseResolveBlock)resolve
        reject:(RCTPromiseRejectBlock)reject
{
  [_impl logoutWithResolve:resolve reject:reject];
}

- (void)logoutAll:(RCTPromiseResolveBlock)resolve
           reject:(RCTPromiseRejectBlock)reject
{
  [_impl logoutAllWithResolve:resolve reject:reject];
}

- (void)isLoggedIn:(RCTPromiseResolveBlock)resolve
            reject:(RCTPromiseRejectBlock)reject
{
  [_impl isLoggedInWithResolve:resolve reject:reject];
}

- (void)getMemberInfo:(RCTPromiseResolveBlock)resolve
               reject:(RCTPromiseRejectBlock)reject
{
  [_impl getMemberInfoWithResolve:resolve reject:reject];
}

- (void)getToken:(RCTPromiseResolveBlock)resolve
          reject:(RCTPromiseRejectBlock)reject
{
  [_impl getTokenWithResolve:resolve reject:reject];
}

- (void)refreshToken:(RCTPromiseResolveBlock)resolve
              reject:(RCTPromiseRejectBlock)reject
{
  [_impl refreshTokenWithResolve:resolve reject:reject];
}

- (void)getSportXRData:(RCTPromiseResolveBlock)resolve
                reject:(RCTPromiseRejectBlock)reject
{
  [_impl getSportXRDataWithResolve:resolve reject:reject];
}

@end
