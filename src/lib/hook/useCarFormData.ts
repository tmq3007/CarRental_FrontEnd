import { AddCarDTO } from "../services/car-api";

export function useCarFormData() {
    const toFormData = (dto: AddCarDTO): FormData => {
        const formData = new FormData();

        // ✅ Flat string fields
        formData.append("LicensePlate", dto.LicensePlate);
        formData.append("BrandName", dto.BrandName);
        formData.append("Model", dto.Model);
        formData.append("ProductionYear", dto.ProductionYear);
        formData.append("Transmission", dto.Transmission);
        formData.append("Color", dto.Color);
        formData.append("NumberOfSeats", dto.NumberOfSeats);
        formData.append("Fuel", dto.Fuel);
        formData.append("Mileage", dto.Mileage);
        formData.append("FuelConsumption", dto.FuelConsumption);
        formData.append("Description", dto.Description ?? "");
        formData.append("BasePrice", dto.BasePrice);
        formData.append("RequiredDeposit", dto.RequiredDeposit);

        // ✅ Address (nested object)
        formData.append("SearchAddress", dto.Address.Search);
        formData.append("CityProvince", dto.Address.ProvinceName);
        formData.append("District", dto.Address.DistrictName);
        formData.append("Ward", dto.Address.WardName);
        formData.append("HouseNumber", dto.Address.HouseNumber);

        // ✅ AdditionalFunctions (booleans)
        for (const [key, value] of Object.entries(dto.AdditionalFunctions)) {
            formData.append(key, String(value));
        }

        // ✅ TermsOfUse (booleans + string)
        for (const [key, value] of Object.entries(dto.TermsOfUse)) {
            formData.append(key, typeof value === "boolean" ? String(value) : value);
        }

        // ✅ Documents (files)
        if (dto.Documents.RegistrationPaper)
            formData.append("RegistrationPaper", dto.Documents.RegistrationPaper);
        if (dto.Documents.CertificateOfInspection)
            formData.append("CertificateOfInspection", dto.Documents.CertificateOfInspection);
        if (dto.Documents.Insurance)
            formData.append("Insurance", dto.Documents.Insurance);

        // ✅ Images (files)
        if (dto.Images.Front) formData.append("FrontImage", dto.Images.Front);
        if (dto.Images.Back) formData.append("BackImage", dto.Images.Back);
        if (dto.Images.Left) formData.append("LeftImage", dto.Images.Left);
        if (dto.Images.Right) formData.append("RightImage", dto.Images.Right);

        return formData;
    };

    return { toFormData };
}

