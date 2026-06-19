#import "RCTNativeConfig.h"
#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
#import <ReactCommon/RCTTurboModule.h>
#import <TicketmasterIgniteSpecs/TicketmasterIgniteSpecs.h>

static RCTNativeConfig *_sharedInstance = nil;

@implementation RCTNativeConfig {
  NSMutableDictionary<NSString *, NSString *> *_store;
}

- (instancetype)init {
  if (self = [super init]) {
    _store = [NSMutableDictionary new];
    _sharedInstance = self;
  }
  return self;
}

+ (nullable instancetype)sharedInstance {
  return _sharedInstance;
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
  return std::make_shared<facebook::react::NativeConfigSpecJSI>(params);
}

- (void)setConfig:(NSString *)key value:(NSString *)value {
  if (!key) return;
  @synchronized (_store) {
    if (value) {
      _store[key] = value;
    } else {
      [_store removeObjectForKey:key];
    }
  }
}

- (void)setImage:(NSString *)key uri:(NSString *)uri {
  if (!key) return;
  @synchronized (_store) {
    if (uri) {
      _store[key] = uri;
    } else {
      [_store removeObjectForKey:key];
    }
  }
}

- (NSString *)getConfig:(NSString *)key {
  if (!key) return nil;
  @synchronized (_store) {
    return _store[key];
  }
}

- (UIImage *)getImage:(NSString *)key {
  NSString *imagePath;
  @synchronized (_store) {
    imagePath = _store[key];
  }
  if (!imagePath) return nil;

  NSURL *url = [NSURL URLWithString:imagePath];
  if (url.scheme) {
    NSData *data = [NSData dataWithContentsOfURL:url];
    return data ? [UIImage imageWithData:data] : nil;
  }

  return [UIImage imageWithContentsOfFile:imagePath];
}

+ (NSString *)moduleName {
  return @"NativeConfig";
}

@end
