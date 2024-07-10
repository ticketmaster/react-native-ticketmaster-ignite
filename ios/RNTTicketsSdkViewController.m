#import <React/RCTViewManager.h>
// Needed to use Swift files in Objective-C files
#import <react_native_ticketmaster_ignite-Swift.h>

@interface RNTTicketsSdkViewManager : RCTViewManager
@end

@implementation RNTTicketsSdkViewManager

- (dispatch_queue_t)methodQueue
{
  return dispatch_get_main_queue();
}

+ (BOOL)requiresMainQueueSetup {
  return true;
}

RCT_EXPORT_MODULE(RNTTicketsSdkView)


- (UIView *)view
{
    TicketsSdkViewController *vc = [[TicketsSdkViewController alloc] init];
  return vc.view;
}

@end


