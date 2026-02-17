import { TicketsSdkModal } from '../src/TicketsSdkModal';

jest.mock('../specs/NativeTicketsSdkModal', () => ({
  __esModule: true,
  default: {
    showTicketsSdkModal: jest.fn(),
  },
}));

describe('TicketsSdkModal', () => {
  it('exposes the showTicketsSdkModal method', () => {
    expect(TicketsSdkModal?.showTicketsSdkModal).toBeDefined();
  });

  it('calls the native showTicketsSdkModal method', () => {
    TicketsSdkModal?.showTicketsSdkModal();
    expect(TicketsSdkModal?.showTicketsSdkModal).toHaveBeenCalled();
  });
});
