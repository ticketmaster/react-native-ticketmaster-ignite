#import "TMIgniteEventHub.h"

static __weak id<TMIgniteEventSink> _sink = nil;

@implementation TMIgniteEventHub

+ (id<TMIgniteEventSink>)sink {
  return _sink;
}

+ (void)setSink:(id<TMIgniteEventSink>)sink {
  _sink = sink;
}

@end
