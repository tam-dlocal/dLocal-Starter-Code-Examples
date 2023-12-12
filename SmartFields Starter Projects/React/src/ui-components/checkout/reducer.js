export function reducer(state, action) {
    switch (action.type) {
        case 'set-empty':
            return { ...state, empty: { ...state.empty, [action.payload.field]: action.payload.value } };
        case 'set-complete':
            return { ...state, complete: { ...state.complete, [action.payload.field]: action.payload.value } };
        case 'set-errors':
            return { ...state, errors: { ...state.errors, [action.payload.field]: action.payload.value } };
        case 'set-fields':
            return { ...state, fields: { ...state.fields, [action.payload.field]: action.payload.value } };
        case 'set-dlocal-instance':
            return { ...state, dlocalInstance: action.payload };
        default:
            return state;
    }
}

export const initialState = {
    empty: { pan: true, cvv: true, expiration: true },
    complete: { pan: false, cvv: false, expiration: false },
    errors: { pan: null, cvv: null, expiration: null },
    fields: { pan: null, cvv: null, expiration: null },
    dlocalInstance: null
};
