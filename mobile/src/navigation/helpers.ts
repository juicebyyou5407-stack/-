import type { NavigationProp } from "@react-navigation/native";
import type { MainTabParamList } from "./types";

// Dashboard and Contracts tabs don't own CustomerDetail themselves; tapping
// a row there hands off to the Customers tab's stack, which is the single
// place that screen (and its edit/add-contract/add-activity children) live.
export function navigateToCustomer(
  navigation: NavigationProp<any>,
  customerId: string
) {
  const parent = navigation.getParent<NavigationProp<MainTabParamList>>();
  (parent ?? navigation).navigate("CustomersTab", {
    screen: "CustomerDetail",
    params: { customerId },
  } as never);
}
