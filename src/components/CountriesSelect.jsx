import countries from "world-countries";
import Select from "react-select";

export function CountriesSelect({className, value, onChange, disabled}){
    const selectCountrieList = countries.map(c=> ({
        label : `${c.flag} ${c.name.common}`,
        value : c.cca2
    }))
    const selectedOption = selectCountrieList.find(opt => opt.value === value) || null;
    return(
        <Select 
            options={selectCountrieList} 
            isDisabled={disabled} 
            onChange={onChange}
            value={selectedOption}
            className={className}
            isSearchable 
            isClearable
        />
    )
}