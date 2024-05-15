import CurrencyFormat from "react-currency-format";

export const formatNumber = (value) => {
    return (
        <CurrencyFormat
            value={value}
            displayType={"text"}
            thousandSeparator={true}
            suffix={" đ"}
        />
    );
};
