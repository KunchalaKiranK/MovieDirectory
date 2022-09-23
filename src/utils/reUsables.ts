import {AppliedFilters, FilterValues} from '../pages/OrderListPage';
import {FilterList} from '../_features/filterList';
import {OrderList} from '../_features/orderLists';
import {ORDER_STATUS} from './orderListStatus';

interface TempKey {
  clients: string;
  types: string;
  cities: string;
  progressStatuses: string;
  states: string;
}

const tempKey: TempKey = {
  clients: 'clientId',
  types: 'loanType',
  cities: 'city',
  progressStatuses: 'status',
  states: 'state',
};

const returnSortedList = (
  unSortedList: any,
  sortCategory: string,
  sortOrder: number = 1,
) => {
  const tempList: any = [...unSortedList];

  tempList.sort((objectOne: any, objectTwo: any) => {
    let transformedObjectOne = objectOne[sortCategory].toLowerCase(),
      transformedObjectTwo = objectTwo[sortCategory].toLowerCase();

    if (transformedObjectOne < transformedObjectTwo) {
      return -1 * sortOrder;
    }
    if (transformedObjectOne > transformedObjectTwo) {
      return 1 * sortOrder;
    }
    return 0;
  });

  return tempList;
};

const handleSearchList = (item: OrderList, searchText: string) => {
  const expr = new RegExp(searchText, 'gi');
  return (
    expr.test(item.orderNumber) ||
    expr.test(item.state) ||
    expr.test(item.street1) ||
    expr.test(item.postalCode) ||
    expr.test(item.loanType) ||
    expr.test(item.city) ||
    expr.test(item.clientId) ||
    expr.test(ORDER_STATUS[item.status].key)
  );
};

const isAppliedFilterExist = (appliedFilters: AppliedFilters) => {
  const keys = Object.keys(appliedFilters);
  for (let i = 0; i < keys.length; i++)
    if (appliedFilters[keys[i] as keyof AppliedFilters].length) return true;
  return false;
};

const returnFilteredList = (
  unFilteredList: OrderList[],
  appliedFilters: AppliedFilters,
  searchText: string,
) => {
  //if no filters, performs search over the list
  if (!isAppliedFilterExist(appliedFilters)) {
    return unFilteredList.filter((item: OrderList) =>
      handleSearchList(item, searchText),
    );
  }

  let flag: boolean = false;

  return unFilteredList.filter((item: OrderList) => {
    flag = false;
    for (let key in appliedFilters) {
      if (key === 'dueDates') {
        if (
          new Date(item.dueDate) >= appliedFilters.dueDates.startDate &&
          new Date(item.dueDate) <= appliedFilters.dueDates.endDate
        )
          flag = true;
      } else {
        for (
          let i = 0;
          i < appliedFilters[key as keyof AppliedFilters].length;
          i++
        ) {
          if (
            appliedFilters[key as keyof AppliedFilters][i].value ===
            item[tempKey[key as keyof TempKey] as keyof OrderList]
          ) {
            flag = true;
            break;
          }
        }
      }
      if (flag) break;
    }

    // if search text exist, persorms search func over the object
    if (flag && searchText) {
      flag = handleSearchList(item, searchText);
    }
    return flag;
  });
};

const returnFilterList = (ORDER_LISTS: OrderList[]) => {
  const clients = new Set<string>();
  const dueDates = new Set<any>();
  const types = new Set<string>();
  const statuses = new Set<string>();
  const progressStatuses = new Set<string>();
  const cities = new Set<string>();
  const states = new Set<string>();
  const assignments = new Set<string>();
  const tags = new Set<string>();

  ORDER_LISTS.forEach((item: OrderList) => {
    clients.add(item.clientId.toUpperCase());
    dueDates.add(item.dueDate.toUpperCase());
    types.add(item.loanType.toUpperCase());
    // statuses.add(item.status.toUpperCase());
    cities.add(item.city.toUpperCase());
    states.add(item.state.toUpperCase());
    progressStatuses.add(item.status);
  });

  let filterList: FilterList = {
    clients: Array.from(clients),
    dueDates: Array.from(dueDates),
    types: Array.from(types),
    statuses: Array.from(statuses),
    progressStatuses: Array.from(progressStatuses),
    cities: Array.from(cities),
    states: Array.from(states),
    assignments: Array.from(assignments),
    tags: Array.from(tags),
  };

  return filterList;
};

const returnNewFilterAfterRemove = (
  appliedFilters: AppliedFilters,
  key: string,
  value: string,
) => {
  if (key === 'dueDates')
    return {
      ...appliedFilters,
      dueDates: {},
    };
  else {
    const tempFilters: AppliedFilters = {
      ...appliedFilters,
      [key]: appliedFilters[key as keyof AppliedFilters].filter(
        (item: FilterValues) => item.value !== value,
      ),
    };
    return tempFilters;
  }
};

export {
  returnSortedList,
  returnFilteredList,
  isAppliedFilterExist,
  returnFilterList,
  returnNewFilterAfterRemove,
};
