export const PAY_DESCRIPTION = {
  transfer: "Transferencia",
  cash: "Efectivo",
  yape: "Yape",
};

export const payMethods = Object.entries(PAY_DESCRIPTION).map(
  ([value, label]) => ({
    label,
    value,
  }),
);
