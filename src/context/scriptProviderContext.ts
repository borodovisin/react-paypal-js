import { createContext } from "react";
//Internal dependencies
import type {
    ScriptContextState,
    ReactPayPalScriptOptions,
    ScriptReducerAction,
} from "../types/scriptProviderTypes";
import { DISPATCH_ACTION, SCRIPT_LOADING_STATE } from "../types/enums";
import type { PayPalScriptOptions } from "@paypal/paypal-js/types/script-options";
import { isUndefined, hashStr, undefinedArgumentErrorMessage } from "../utils";
import { SCRIPT_ID } from "../constants";

/**
 * Generate a new random identifier for react-paypal-js
 *
 * @returns the {@code string} containing the random library name
 */
export function getScriptID(options: PayPalScriptOptions): string {
    if (isUndefined(options))
        throw new Error(undefinedArgumentErrorMessage("getScriptID"));
    return `react-paypal-js-${hashStr(JSON.stringify(options))}`;
}

/**
 * Destroy the PayPal SDK from the document page
 *
 * @param reactPayPalScriptID the script identifier
 */
export function destroySDKScript(reactPayPalScriptID: string): void {
    const scriptNode = self.document.querySelector<HTMLScriptElement>(
        `script[${SCRIPT_ID}="${reactPayPalScriptID}"]`
    );

    if (scriptNode != null && scriptNode.parentNode)
        scriptNode.parentNode.removeChild(scriptNode);
}

/**
 * Reducer function to handle complex state changes on the context
 *
 * @param state  the current state on the context object
 * @param action the action to be executed on the previous state
 * @returns a the same state if the action wasn't found, or a new state otherwise
 */
export function scriptReducer(
    state: ScriptContextState,
    action: ScriptReducerAction
): ScriptContextState {
    switch (action.type) {
        case DISPATCH_ACTION.LOADING_STATUS:
            return {
                ...state,
                loadingStatus: action.value as SCRIPT_LOADING_STATE,
            };
        case DISPATCH_ACTION.RESET_OPTIONS:
            // destroy existing script to make sure only one script loads at a time
            destroySDKScript(state.options[SCRIPT_ID]);
            // exclude the old data-react-paypal-script-id value from the hash generated by getScriptID()
            delete (action.value as PayPalScriptOptions)[SCRIPT_ID];

            return {
                ...state,
                loadingStatus: SCRIPT_LOADING_STATE.PENDING,
                options: {
                    ...(action.value as ReactPayPalScriptOptions),
                    [SCRIPT_ID]: `${getScriptID(
                        action.value as PayPalScriptOptions
                    )}`,
                },
            };

        default: {
            return state;
        }
    }
}

// Create the React context to use in the script provider component
export const ScriptContext = createContext<ScriptContextState | null>(null);