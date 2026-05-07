# PAGES

ng g c pages/pos --skip-tests &&
ng g c pages/kitchen --skip-tests &&
ng g c pages/orders-history --skip-tests &&
ng g c pages/cash-closing --skip-tests &&

# PRODUCT COMPONENTS

ng g c components/product/product-selector --skip-tests &&
ng g c components/product/custom-product --skip-tests &&
ng g c components/product/product-addons --skip-tests &&
ng g c components/product/selected-addons --skip-tests &&

# ORDER COMPONENTS

ng g c components/order/order-card --skip-tests &&
ng g c components/order/order-card-list --skip-tests &&
ng g c components/order/order-details --skip-tests &&

# PAYMENT COMPONENTS

ng g c components/payment/payment-form --skip-tests &&

# ORDERS HISTORY COMPONENTS

ng g c components/orders-history/summary-cards --skip-tests &&
ng g c components/orders-history/filters-bar --skip-tests &&
ng g c components/orders-history/orders-table --skip-tests &&

# SHARED COMPONENTS

ng g c components/shared/menu --skip-tests &&
ng g c components/shared/dialog --skip-tests &&
ng g c components/shared/button --skip-tests
