#import "RCTNativeConfig.h"
#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
#import <ReactCommon/RCTTurboModule.h>
#import <TicketmasterIgniteSpecs/TicketmasterIgniteSpecs.h>

static NSMutableDictionary<NSString *, NSString *> *NativeConfigStore(void) {
  static NSMutableDictionary<NSString *, NSString *> *store = nil;
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    store = [NSMutableDictionary new];
  });
  return store;
}


@implementation RCTNativeConfig

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
(const facebook::react::ObjCTurboModule::InitParams &)params
{
  return std::make_shared<facebook::react::NativeConfigSpecJSI>(params);
}


- (void)setConfig:(NSString *)key value:(NSString *)value {
  [RCTNativeConfig setConfig:value forKey:key];
}

- (void)setImage:(NSString *)key uri:(NSString *)uri {
  [RCTNativeConfig setConfig:uri forKey:key];
}


+ (NSString *)getConfig:(NSString *)key {
  if (!key) return nil;
  @synchronized (NativeConfigStore()) {
    return NativeConfigStore()[key];
  }
}

+ (void)setConfig:(nullable NSString *)value forKey:(NSString *)key {
  if (!key) return;
  @synchronized (NativeConfigStore()) {
    if (value) {
      NativeConfigStore()[key] = value;
    } else {
      [NativeConfigStore() removeObjectForKey:key];
    }
  }
}

+ (UIImage *)getImage:(NSString *)key {
  NSString *imagePath = [RCTNativeConfig getConfig:key];
  if (!imagePath) return nil;

  NSURL *url = [NSURL URLWithString:imagePath];
  if (url.scheme) {
    NSData *data = [NSData dataWithContentsOfURL:url];
    return data ? [UIImage imageWithData:data] : nil;
  }

  return [UIImage imageWithContentsOfFile:imagePath];
}

+ (NSString *)moduleName
{
  return @"NativeConfig";
}

@end