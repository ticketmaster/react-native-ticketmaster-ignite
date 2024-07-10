#import <React/RCTViewManager.h>
// Needed to use Swift files in Objective-C files
#import <react_native_ticketmaster_ignite-Swift.h>

@interface RNTTicketsSdkEmbeddedViewManager : RCTViewManager
@end

@implementation RNTTicketsSdkEmbeddedViewManager

- (dispatch_queue_t)methodQueue
{
  return dispatch_get_main_queue();
}

+ (BOOL)requiresMainQueueSetup {
  return true;
}

RCT_EXPORT_MODULE(RNTTicketsSdkEmbeddedView)


- (UIView *)view
{
    TicketsSdkEmbeddedViewController *vc = [[TicketsSdkEmbeddedViewController alloc] init];
  return vc.view;
}




@end

