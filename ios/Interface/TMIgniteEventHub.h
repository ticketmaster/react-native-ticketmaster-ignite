#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

/// Something that can deliver a named event with a dictionary body to JavaScript.
/// Implemented by the React Native event emitter module (`RCTGlobalEventEmitter`).
@protocol TMIgniteEventSink <NSObject>

- (void)emitEventWithName:(NSString *)name body:(NSDictionary<NSString *, id> *)body;

@end

/// Hand-off point between the Swift SDK layer, which produces analytics events, and the
/// React Native module that forwards them to JavaScript.
///
/// The emitter registers itself as the sink when React Native instantiates it; Swift only
/// ever talks to this hub, so the Swift sources carry no React dependency. The reference is
/// weak because React Native owns the module and recreates it with each JavaScript runtime.
@interface TMIgniteEventHub : NSObject

@property (class, nonatomic, weak, nullable) id<TMIgniteEventSink> sink;

@end

NS_ASSUME_NONNULL_END
