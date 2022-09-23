import {createSlice, current, PayloadAction} from '@reduxjs/toolkit';

export interface OrderListProp {
  city: string;
  clientId: string;
  dueDate: string;
  hash: string;
  loanType: string;
  modifiedDate: string;
  orderDate: string;
  orderNumber: string;
  postalCode: string;
  state: string;
  status: string;
  street1: string;
}

interface OrderListProps {
  orderList: OrderListProp[];
  downloadedOrderList: string[];
}

const initialState = {
  orderList: [],
  downloadedOrderList: [],
};

const orderListSlice = createSlice({
  name: 'orderList',
  initialState,
  reducers: {
    // reset the state
    resetOrderList: () => initialState,
    updateOrderListInitialState: (
      state: OrderListProps,
      action: PayloadAction<OrderListProp[]>,
    ) => {
      current(state);
      state.orderList = action.payload;
    },
    addOrderToDownloadedList: (
      state: OrderListProps,
      action: PayloadAction<{order: string}>,
    ) => {
      current(state);
      state.downloadedOrderList.push(action.payload.order);
    },
  },
});

export const {
  updateOrderListInitialState,
  addOrderToDownloadedList,
  resetOrderList,
} = orderListSlice.actions;
export default orderListSlice.reducer;
