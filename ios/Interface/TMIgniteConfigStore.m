#import "TMIgniteConfigStore.h"

@implementation TMIgniteConfigStore {
  NSMutableDictionary<NSString *, NSString *> *_store;
}

+ (TMIgniteConfigStore *)shared {
  static TMIgniteConfigStore *instance = nil;
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    instance = [TMIgniteConfigStore new];
  });
  return instance;
}

- (instancetype)init {
  if (self = [super init]) {
    _store = [NSMutableDictionary new];
  }
  return self;
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

- (void)removeAll {
  @synchronized (_store) {
    [_store removeAllObjects];
  }
}

@end
