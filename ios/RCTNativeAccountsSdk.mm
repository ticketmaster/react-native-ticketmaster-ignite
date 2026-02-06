#import "RCTNativeAccountsSdk.h"
#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>
#import <ReactCommon/RCTTurboModule.h>
#import <TicketmasterIgniteSpecs/TicketmasterIgniteSpecs.h>


#if __has_include(<react_native_ticketmaster_ignite/react_native_ticketmaster_ignite-Swift.h>)
// For cocoapods framework, the generated swift header will be inside react_native_ticketmaster module
#import <react_native_ticketmaster_ignite/react_native_ticketmaster_ignite-Swift.h>
#else
// For static libraries
#import "react_native_ticketmaster_ignite-Swift.h"
#endif

@implementation RCTNativeAccountsSdk {
  AccountsSdk *accountsSdk;
}


- (instancetype)init {
  if (self = [super init]) {
    accountsSdk = [AccountsSdk new];
  }
  return self;
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
(const facebook::react::ObjCTurboModule::InitParams &)params
{
  return std::make_shared<facebook::react::NativeAccountsSdkSpecJSI>(params);
}

- (void)configureAccountsSDK:(RCTPromiseResolveBlock)resolve
                      reject:(RCTPromiseRejectBlock)reject
{
  [accountsSdk configureAccountsSDKWithResolve:resolve reject:reject];
}

- (void)login:(RCTPromiseResolveBlock)resolve
       reject:(RCTPromiseRejectBlock)reject
{
  [accountsSdk loginWithResolve:resolve reject:reject];
}

- (void)logout:(RCTPromiseResolveBlock)resolve
        reject:(RCTPromiseRejectBlock)reject
{
  [accountsSdk logoutWithResolve:resolve reject:reject];
}

- (void)logoutAll:(RCTPromiseResolveBlock)resolve
           reject:(RCTPromiseRejectBlock)reject
{
  [accountsSdk logoutAllWithResolve:resolve reject:reject];
}

- (void)isLoggedIn:(RCTPromiseResolveBlock)resolve
            reject:(RCTPromiseRejectBlock)reject
{
  [accountsSdk isLoggedInWithResolve:resolve reject:reject];
}

- (void)getMemberInfo:(RCTPromiseResolveBlock)resolve
               reject:(RCTPromiseRejectBlock)reject
{
  [accountsSdk getMemberInfoWithResolve:resolve reject:reject];
}

- (void)getToken:(RCTPromiseResolveBlock)resolve
          reject:(RCTPromiseRejectBlock)reject
{
  [accountsSdk getTokenWithResolve:resolve reject:reject];
}

- (void)refreshToken:(RCTPromiseResolveBlock)resolve
              reject:(RCTPromiseRejectBlock)reject
{
  [accountsSdk refreshTokenWithResolve:resolve reject:reject];
}

- (void)getSportXRData:(RCTPromiseResolveBlock)resolve
                reject:(RCTPromiseRejectBlock)reject
{
  [accountsSdk getSportXRDataWithResolve:resolve reject:reject];
}

+ (NSString *)moduleName
{
  return @"NativeAccountsSdk";
}

@end
