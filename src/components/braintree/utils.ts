import type { BraintreePayPalButtonsComponentProps } from "../../types/braintreePayPalButtonTypes";
import type { PayPalButtonsComponentProps } from "../../types/paypalButtonTypes";

/**
 * Override the createOrder callback to send the PayPal checkout instance as argument
 * to the defined createOrder function for braintree component button
 *
 * @param braintreeButtonProps the component button options
 */
const decorateCreateOrder = (
    braintreeButtonProps: BraintreePayPalButtonsComponentProps,
    payPalCheckoutInstance: unknown
) => {
    if (
        braintreeButtonProps.createOrder != undefined &&
        payPalCheckoutInstance != undefined
    ) {
        // Keep the createOrder function reference
        const functionReference = braintreeButtonProps.createOrder;

        braintreeButtonProps.createOrder = (data, actions) =>
            functionReference(data, {
                ...actions,
                braintree: payPalCheckoutInstance,
            });
    }
};

/**
 * Override the onApprove callback to send the payload as argument
 * to the defined onApprove function for braintree component button
 *
 * @param braintreeButtonProps the component button options
 */
const decorateOnApprove = (
    braintreeButtonProps: BraintreePayPalButtonsComponentProps,
    payPalCheckoutInstance: unknown
) => {
    if (
        braintreeButtonProps.onApprove != undefined &&
        payPalCheckoutInstance != undefined
    ) {
        // Store the createOrder function reference
        const braintreeOnApprove = braintreeButtonProps.onApprove;

        braintreeButtonProps.onApprove = async (data, actions) =>
            braintreeOnApprove(data, {
                ...actions,
                braintree: payPalCheckoutInstance,
            });
    }
};

/**
 * Massage needed functions to adapt to PayPal SDK types
 * Currently only modify the createOrder and onApprove callbacks
 *
 * @param braintreeButtonProps the component button options
 * @returns a new copy of the component button options casted as {@link PayPalButtonsComponentProps}
 */
export const decorateActions = (
    buttonProps: BraintreePayPalButtonsComponentProps,
    payPalCheckoutInstance: unknown
): PayPalButtonsComponentProps => {
    decorateCreateOrder(buttonProps, payPalCheckoutInstance);
    decorateOnApprove(buttonProps, payPalCheckoutInstance);

    return { ...buttonProps } as PayPalButtonsComponentProps;
};