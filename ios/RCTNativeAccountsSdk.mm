#import "RCTNativeAccountsSdk.h"
#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>
#import <ReactCommon/RCTTurboModule.h>
#import <TicketmasterIgniteSpecs/TicketmasterIgniteSpecs.h>
#import "TMIgniteSwiftFactory.h"

@implementation RCTNativeAccountsSdk {
  id<TMIgniteAccountsSDK> accountsSDK;
}


- (instancetype)init {
  if (self = [super init]) {
    accountsSDK = [TMIgniteSwiftFactory makeAccountsSDK];
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
  [accountsSDK configureAccountsSDKWithResolve:resolve reject:reject];
}

- (void)notifyConfigurationRefreshed
{
  dispatch_async(dispatch_get_main_queue(), ^{
    [[NSNotificationCenter defaultCenter] postNotificationName:@"ConfigurationRefreshed" object:nil];
  });
}

- (void)login:(RCTPromiseResolveBlock)resolve
       reject:(RCTPromiseRejectBlock)reject
{
  [accountsSDK loginWithResolve:resolve reject:reject];
}

- (void)logout:(RCTPromiseResolveBlock)resolve
        reject:(RCTPromiseRejectBlock)reject
{
  [accountsSDK logoutWithResolve:resolve reject:reject];
}

- (void)logoutAll:(RCTPromiseResolveBlock)resolve
           reject:(RCTPromiseRejectBlock)reject
{
  [accountsSDK logoutAllWithResolve:resolve reject:reject];
}

- (void)isLoggedIn:(RCTPromiseResolveBlock)resolve
            reject:(RCTPromiseRejectBlock)reject
{
  [accountsSDK isLoggedInWithResolve:resolve reject:reject];
}

- (void)getMemberInfo:(RCTPromiseResolveBlock)resolve
               reject:(RCTPromiseRejectBlock)reject
{
  [accountsSDK getMemberInfoWithResolve:resolve reject:reject];
}

- (void)getToken:(RCTPromiseResolveBlock)resolve
          reject:(RCTPromiseRejectBlock)reject
{
  [accountsSDK getTokenWithResolve:resolve reject:reject];
}

- (void)refreshToken:(RCTPromiseResolveBlock)resolve
              reject:(RCTPromiseRejectBlock)reject
{
  [accountsSDK refreshTokenWithResolve:resolve reject:reject];
}

- (void)getSportXRData:(RCTPromiseResolveBlock)resolve
                reject:(RCTPromiseRejectBlock)reject
{
  [accountsSDK getSportXRDataWithResolve:resolve reject:reject];
}

+ (NSString *)moduleName
{
  return @"NativeAccountsSdk";
}

@end
