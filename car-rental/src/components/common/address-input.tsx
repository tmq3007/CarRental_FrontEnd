import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { MapPin } from "lucide-react";
import { useGetProvincesQuery, useGetDistrictsQuery, useGetWardsQuery } from "@/lib/services/local-api/address-api";
import { useState } from "react";

interface AddressInputProps {
    onLocationChange: (location: string) => void;
}

const AddressInput = ({ onLocationChange }: AddressInputProps) => {
    const [selectedProvinceCode, setSelectedProvinceCode] = useState<number | null>(null);
    const [selectedDistrictCode, setSelectedDistrictCode] = useState<number | null>(null);
    const [selectedWardCode, setSelectedWardCode] = useState<number | null>(null);
    const [selectedProvinceName, setSelectedProvinceName] = useState<string>("");
    const [selectedDistrictName, setSelectedDistrictName] = useState<string>("");
    const [selectedWardName, setSelectedWardName] = useState<string>("");

    // Fetch provinces
    const { data: provinces = [], isLoading: provincesLoading } = useGetProvincesQuery();

    // Fetch districts based on selected province
    const { data: districts = [], isLoading: districtsLoading } = useGetDistrictsQuery(selectedProvinceCode!, {
        skip: !selectedProvinceCode,
    });

    // Fetch wards based on selected district
    const { data: wards = [], isLoading: wardsLoading } = useGetWardsQuery(selectedDistrictCode!, {
        skip: !selectedDistrictCode,
    });

    // Handle province change
    const handleProvinceChange = (provinceCode: string) => {
        const province = provinces.find(p => p.code === Number(provinceCode));
        setSelectedProvinceCode(province?.code || null);
        setSelectedProvinceName(province?.name || "");
        setSelectedDistrictCode(null); // Reset district
        setSelectedDistrictName("");
        setSelectedWardCode(null); // Reset ward
        setSelectedWardName("");
        onLocationChange(province?.name || "");
    };

    // Handle district change
    const handleDistrictChange = (districtCode: string) => {
        const district = districts.find(d => d.code === Number(districtCode));
        setSelectedDistrictCode(district?.code || null);
        setSelectedDistrictName(district?.name || "");
        setSelectedWardCode(null); // Reset ward
        setSelectedWardName("");
        onLocationChange(`${selectedProvinceName}, ${district?.name || ""}`);
    };

    // Handle ward change
    const handleWardChange = (wardCode: string) => {
        const ward = wards.find(w => w.code === Number(wardCode));
        setSelectedWardCode(ward?.code || null);
        setSelectedWardName(ward?.name || "");
        onLocationChange(`${selectedProvinceName}, ${selectedDistrictName}, ${ward?.name || ""}`);
    };

    return (
        <div className="space-y-4">
            {/* Province Selection */}
            <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Province
                </Label>
                <Select onValueChange={handleProvinceChange} disabled={provincesLoading}>
                    <SelectTrigger className="h-12 bg-white hover:bg-green-50">
                        <SelectValue placeholder={provincesLoading ? "Loading..." : "Select province"} />
                    </SelectTrigger>
                    <SelectContent>
                        {provinces.map((province) => (
                            <SelectItem key={province.code} value={province.code.toString()}>
                                {province.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* District Selection */}
            <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    District
                </Label>
                <Select
                    onValueChange={handleDistrictChange}
                    disabled={districtsLoading || !selectedProvinceCode}
                >
                    <SelectTrigger className="h-12 bg-white hover:bg-green-50">
                        <SelectValue placeholder={districtsLoading ? "Loading..." : "Select district"} />
                    </SelectTrigger>
                    <SelectContent>
                        {districts.map((district) => (
                            <SelectItem key={district.code} value={district.code.toString()}>
                                {district.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Ward Selection */}
            <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Ward
                </Label>
                <Select
                    onValueChange={handleWardChange}
                    disabled={wardsLoading || !selectedDistrictCode}
                >
                    <SelectTrigger className="h-12 bg-white hover:bg-green-50">
                        <SelectValue placeholder={wardsLoading ? "Loading..." : "Select ward"} />
                    </SelectTrigger>
                    <SelectContent>
                        {wards.map((ward) => (
                            <SelectItem key={ward.code} value={ward.code.toString()}>
                                {ward.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
};

export default AddressInput;