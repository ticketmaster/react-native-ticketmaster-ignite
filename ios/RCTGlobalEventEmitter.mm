#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

#import "TMIgniteEventHub.h"

/// React Native module exposed to JavaScript as `GlobalEventEmitter`
/// (`new NativeEventEmitter(NativeModules.GlobalEventEmitter)`).
///
/// It registers itself with `TMIgniteEventHub` so the Swift SDK layer can emit analytics events
/// without importing React.
@interface RCTGlobalEventEmitter : RCTEventEmitter <TMIgniteEventSink>
@end

@implementation RCTGlobalEventEmitter

RCT_EXPORT_MODULE(GlobalEventEmitter)

- (instancetype)init {
  if (self = [super init]) {
    TMIgniteEventHub.sink = self;
  }
  return self;
}

+ (BOOL)requiresMainQueueSetup {
  return YES;
}

- (NSArray<NSString *> *)supportedEvents {
  return @[ @"igniteAnalytics" ];
}

- (void)emitEventWithName:(NSString *)name body:(NSDictionary<NSString *, id> *)body {
  [self sendEventWithName:name body:body];
}

@end
