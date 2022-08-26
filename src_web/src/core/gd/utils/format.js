module.exports = {

    number(value, decimalPlaces=2, addCommas) {

        let normalized = typeof value === 'number' ? value.toFixed(decimalPlaces) : parseFloat(value).toFixed(decimalPlaces);
        normalized = isNaN(normalized) ? 0 : normalized;
        let parts = normalized.toString().split(".");
        return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (+parts[1] ? "." + parts[1] : "");
    }




};