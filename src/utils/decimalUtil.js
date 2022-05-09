

import Decimal from "decimal.js"

export default function getDecimal(val, defaultVal) {
    if(val == null || val == "" || val == undefined) {
        return new Decimal(defaultVal);
    }
    return new Decimal(val);
}